using Microsoft.EntityFrameworkCore;
using BuntesBegegnen.Api.Util;
using BuntesBegegnen.Api.Data.Entities;
using AutoMapper;
using Microsoft.Data.Sqlite;

namespace BuntesBegegnen.Api.Data;

public class ActivityStore
{
    private readonly BundlorWebContext _context;
    private readonly ILogger<ActivityStore> _logger;
    private readonly IMapper _mapper;

    public ActivityStore(BundlorWebContext context, ILogger<ActivityStore> logger, IMapper mapper)
    {
        _context = context;
        _logger = logger;
        _mapper = mapper;
    }

    public async Task<int> Create(string authorId, int promoterId)
    {
        _logger.LogInformation("Creating new activity by author ID: {AuthorId}, promoter ID: {PromoterId}", authorId, promoterId);

        var now = DateTimeOffset.UtcNow;
        var startTime = new DateTimeOffset(now.Year, now.Month, now.Day, now.Hour, now.Minute / 30 * 30, 0, 0, now.Offset)
            .AddDays(3)
            .AddHours(4);

        var activity = new Activity
        {
            CreatedById = authorId,
            CreatedAt = now,
            PromoterId = promoterId,
            Visibility = ActivityVisibility.PrivateDraft,
            Title = "(Neue Veranstaltung)",
            Category = ActivityCategory.Creativity,
            StartTime = startTime,
            EndTime = startTime.AddHours(2),
            IsAllDay = false,
            MaxNumberOfParticipants = null,
            RegistrationLocked = false,
            Location = "(Bitte Ort eingeben)",
            Description = "(Bitte Beschreibung eingeben)",
            RecurrenceFrequency = ActivityRecurrenceFrequency.None,
            RecurrenceInterval = null,
            RepeatUntil = null,
            RepeatCount = null,
        };

        _context.Activities.Add(activity);
        await _context.SaveChangesAsync();

        return activity.Id;
    }

    // NOTE: This does not load the recurrence
    public async Task<List<ActivityDto>> List(
        int? onlyId = null,
        string? userId = null,
        string? searchPattern = null,
        DateTimeOffset? minDate = null,
        DateTimeOffset? maxDate = null,
        bool onlyRegistered = false,
        bool isTeamMember = false)
    {
        if (onlyRegistered && userId is null or "")
        {
            throw new InvalidOperationException("onlyRegistered requires a userId");
        }

        var query = _context.Database.SqlQueryRaw<ActivityDto>(
            await File.ReadAllTextAsync("Data/Sql/GetActivities.sql"),
            new SqliteParameter("@onlyId", (object?)onlyId ?? DBNull.Value),
            new SqliteParameter("@userId", (object?)userId ?? DBNull.Value),
            new SqliteParameter("@searchPattern", (object?)searchPattern ?? DBNull.Value),
            new SqliteParameter("@minDate", (object?)minDate ?? DBNull.Value),
            new SqliteParameter("@maxDate", (object?)maxDate ?? DBNull.Value),
            new SqliteParameter("@onlyRegistered", (object?)onlyRegistered ?? DBNull.Value),
            new SqliteParameter("@isTeamMember", (object?)isTeamMember ?? DBNull.Value));

        // TODO: We need to load the recurrence lists here

        var __test = query.ToQueryString();

        var result = await query.ToListAsync();
        return result;
    }

    // TODO - Really, really bad performance
    public async Task<ActivityDto> LoadRecurrence(ActivityDto activity)
    {
        var result = activity with
        {
            RecurrenceDates = (await _context.Database
                .SqlQueryRaw<DateTimeOffset>($"""
                    SELECT StartTime
                    FROM ActivityRecurrenceDates
                    WHERE ActivityId == @activityId
                    ORDER BY StartTime
                    """,
                new SqliteParameter("@activityId", activity.Id))
                .ToListAsync())
                .ToHashSet(),
            RecurrenceByDay = (await _context.Database
                .SqlQueryRaw<ActivityRecurrenceByDayDto>($"""
                    SELECT *
                    FROM ActivityRecurrenceByDay
                    WHERE ActivityId == @activityId
                    ORDER BY Ordinal, DayOfWeek
                    """,
                new SqliteParameter("@activityId", activity.Id))
                .ToListAsync())
                .ToHashSet(),
            RecurrenceByMonthDay = (await _context.Database
                .SqlQueryRaw<int>($"""
                    SELECT MonthDay
                    FROM ActivityRecurrenceByMonthDay
                    WHERE ActivityId == @activityId
                    ORDER BY MonthDay
                    """,
                new SqliteParameter("@activityId", activity.Id))
                .ToListAsync())
                .ToHashSet(),
            RecurrenceExceptions = (await _context.Database
                .SqlQueryRaw<DateTimeOffset>($"""
                    SELECT StartTime
                    FROM ActivityRecurrenceExceptions
                    WHERE ActivityId == @activityId
                    ORDER BY StartTime
                    """,
                new SqliteParameter("@activityId", activity.Id))
                .ToListAsync())
                .ToHashSet(),
        };

        return result;
    }

    // TODO: Exceptional updates/deletes
    public async Task Update(ActivityDto dto, UpdateActivityDto update)
    {
        _logger.LogInformation("Updating activity {Id}", dto.Id);

        var activity = await _context.Activities.FindAsync(dto.Id)
            ?? throw new InvalidOperationException("Activity not found");

        var mustRefreshRecurrences =
            dto.RecurrenceFrequency != update.RecurrenceFrequency ||
            update.RecurrenceDates.Count > 0 ||
            update.RecurrenceByDay.Count > 0 ||
            update.RecurrenceByMonthDay.Count > 0 ||
            update.RecurrenceExceptions.Count > 0;
        if (mustRefreshRecurrences)
        {
            await _context.Database.ExecuteSqlRawAsync($"""
                DELETE FROM ActivityRecurrenceDates
                WHERE ActivityId == @activityId;

                DELETE FROM ActivityRecurrenceByDay
                WHERE ActivityId == @activityId;

                DELETE FROM ActivityRecurrenceByMonthDay
                WHERE ActivityId == @activityId;

                DELETE FROM ActivityRecurrenceExceptions
                WHERE ActivityId == @activityId;
                """,
                new SqliteParameter("@activityId", dto.Id));

            foreach (var date in update.RecurrenceDates)
            {
                _context.ActivityRecurrenceDates.Add(new()
                {
                    ActivityId = dto.Id,
                    StartTime = date,
                });
            }

            foreach (var byDay in update.RecurrenceByDay)
            {
                _context.ActivityRecurrenceByDay.Add(new()
                {
                    ActivityId = dto.Id,
                    Ordinal = byDay.Ordinal,
                    DayOfWeek = byDay.DayOfWeek,
                });
            }

            foreach (var monthDay in update.RecurrenceByMonthDay)
            {
                _context.ActivityRecurrenceByMonthDay.Add(new()
                {
                    ActivityId = dto.Id,
                    MonthDay = monthDay,
                });
            }

            foreach (var exception in update.RecurrenceExceptions)
            {
                _context.ActivityRecurrenceExceptions.Add(new()
                {
                    ActivityId = dto.Id,
                    StartTime = exception,
                });
            }
        }

        _mapper.Map(update, activity);

        await _context.SaveChangesAsync();

        _logger.LogInformation("Activity {Id} updated", dto.Id);
    }

    public async Task RegisterParticipant(ActivityDto activity, User participant)
    {
        _logger.LogInformation("Registering participant for activity {ActivityId}", activity.Id);

        if (await IsRegisteredAsParticipant(activity, participant))
        {
            _logger.LogWarning("User is already registered for activity");
            return;
        }

        var entry = new UserActivityRegistration
        {
            ActivityId = activity.Id,
            UserId = participant.Id
        };

        _context.UserActivityRegistrations.Add(entry);
        await _context.SaveChangesAsync();
    }

    public async Task UnregisterParticipant(ActivityDto activity, User participant)
    {
        _logger.LogInformation("Unregistering participant from activity {ActivityId}", activity.Id);

        var entriesDeleted = await _context.UserActivityRegistrations
            .Where(x =>
                x.ActivityId == activity.Id &&
                x.UserId == participant.Id)
            .ExecuteDeleteAsync();

        if (entriesDeleted == 0)
        {
            _logger.LogWarning("User was not registered for activity");
        }
    }

    public async Task<bool> IsRegisteredAsParticipant(ActivityDto activity, User user)
    {
        var registration = await _context.UserActivityRegistrations
            .FirstOrDefaultAsync(x =>
                x.ActivityId == activity.Id &&
                x.UserId == user.Id);

        return registration != null;
    }

    public async Task Delete(ActivityDto dto)
    {
        _logger.LogInformation("Marking activity {Id} as deleted", dto.Id);

        var activitiesUpdated = await _context.Activities
            .Where(x => x.Id == dto.Id)
            .ExecuteUpdateAsync(x => x.SetProperty(x => x.IsDeleted, true));
        if (activitiesUpdated != 1)
        {
            throw new InvalidOperationException();
        }
    }
}
