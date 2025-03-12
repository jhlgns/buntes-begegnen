using System.Linq.Expressions;
using System.Net;
using AutoMapper;
using BuntesBegegnen.Api.Data;
using BuntesBegegnen.Api.Data.Entities;
using BuntesBegegnen.Api.Email;
using BuntesBegegnen.Api.UserManagement;
using BuntesBegegnen.Api.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Bundlor.Lib.Hosting;

namespace BuntesBegegnen.Api.Controllers;

// TODO: Implement recurrence exceptions
// TODO: Register to recurring activities? -> for recurring activities, an instance is needed - can only register for one instance at a time

public class ActivityCreatedDto
{
    public required int Id { get; set; }
}

[ApiController]
[Route("activities")]
public class ActivitiesController : ControllerBase
{
    private const int MaxPageSize = 50;

    private readonly ActivityStore _store;
    private readonly IUserManager _userManager;
    private readonly IEmailGenerator _emailGenerator;
    private readonly ILogger<ActivitiesController> _logger;
    private readonly IAuthorizationService _authorizationService;
    private readonly RateLimiter _rateLimiter;
    private readonly ApiOptions _options;

    public ActivitiesController(
        ActivityStore store,
        IUserManager userManager,
        IEmailGenerator emailGenerator,
        ILogger<ActivitiesController> logger,
        IAuthorizationService authorizationService,
        RateLimiter rateLimiter,
        IOptions<ApiOptions> options)
    {
        _store = store;
        _userManager = userManager;
        _emailGenerator = emailGenerator;
        _logger = logger;
        _authorizationService = authorizationService;
        _rateLimiter = rateLimiter;
        _options = options.Value;
    }

    [Authorize(PolicyNames.TeamMember)]
    [HttpPost]
    public async Task<ActionResult<ActivityCreatedDto>> PostActivity()
    {
        var user = await _userManager.TryFindByPrincipal(User)
            ?? throw new InvalidOperationException("User not found");
        if (user.PromoterId == null)
        {
            return _logger.LogBadRequest("The user is not assigned to a promoter");
        }

        var id = await _store.Create(user.Id, user.PromoterId.Value);

        return Ok(new ActivityCreatedDto { Id = id });
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<ActionResult<ActivityDto[]>> GetActivies(
        DateTimeOffset minDate,
        DateTimeOffset maxDate,
        string? searchTerm,
        bool onlyRegistered = false)
    {
        if (maxDate - minDate > TimeSpan.FromDays(31))
        {
            return _logger.LogBadRequest("Can only query activities in time ranges of at most 31 days");
        }

        var normalizedSearchPattern = searchTerm is null or ""
            ? null
            : $"%{searchTerm.Trim('%').ToLower()}%";

        var activities = await _store.List(
            userId: User.TryFindUserId(),
            searchPattern: normalizedSearchPattern,
            minDate: minDate,
            maxDate: maxDate,
            onlyRegistered: onlyRegistered,
            isTeamMember: await IsTeamMember());

        var instances = new List<ActivityDto>();
        foreach (var activity in activities)
        {
            var it = activity;
            if (activity.RecurrenceFrequency is not (ActivityRecurrenceFrequency.None or ActivityRecurrenceFrequency.FixedDates))
            {
                // TODO!!!
                it = await _store.LoadRecurrence(activity);
            }

            ActivityUtils.Explode(it, (activity, startTime) =>
            {
                // NOTE: I guess this could be done more efficiently when passing minDate and maxDate to Explode()
                var endTime = startTime + (activity.EndTime - activity.StartTime);
                if (startTime > maxDate || endTime < minDate)
                {
                    return;
                }

                // _logger.LogDebug(
                //     "Exploding activity {ActivityId} ({ActivityTitle}, frequency: {ActivityRecurrenceFrequency}) with start time {StartTime} (original start time: {OriginalStartTime})",
                //     activity.Id,
                //     activity.Title,
                //     activity.RecurrenceFrequency,
                //     startTime,
                //     activity.StartTime);

                var instance = activity with
                {
                    IsInstance = true,
                    StartTime = startTime,
                    EndTime = endTime,
                };

                instances.Add(instance);
            });
        }

        instances = instances.OrderBy(x => x.StartTime).ToList();

        return Ok(instances);
    }

    [AllowAnonymous]
    [HttpGet("{id}")]
    public async Task<ActionResult<ActivityDto>> GetActivity(int id)
    {
        var activity = await Find(id);
        if (activity == null)
        {
            return _logger.LogNotFound("Activity {Id} not found", id);
        }

        switch (activity.Visibility)
        {
            case ActivityVisibility.SharedDraft when await IsTeamMember() == false:
                return NotFound($"Activity {id} not found");

            case ActivityVisibility.PrivateDraft when User.TryFindUserId() != activity.CreatedById:
                return NotFound($"Activity {id} not found");
        }

        // TODO
        activity = await _store.LoadRecurrence(activity);

        return Ok(activity);
    }

    [Authorize(PolicyNames.TeamMember)]
    [HttpPut("{id}")]
    public async Task<ActionResult> PutActivity(int id, UpdateActivityDto update)
    {
        _logger.LogInformation("Updating activity {Id}", id);

        var activity = await Find(id);
        if (activity == null)
        {
            return _logger.LogNotFound("The activity {Id} was not found", id);
        }

        if (Validate(activity, update) is { } result)
        {
            return result;
        }

        await _store.Update(activity, update);

        return Ok();
    }

    [Authorize(PolicyNames.TeamMember)]
    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteActivity(int id)
    {
        _logger.LogInformation("Deleting activity {Id}", id);

        var activity = await Find(id);
        if (activity == null)
        {
            return _logger.LogNotFound("Activity not found");
        }

        var isOwner = User.TryFindUserId() is { } userId && userId == activity.CreatedById;
        if (activity.Visibility == ActivityVisibility.PrivateDraft && isOwner == false)
        {
            return _logger.LogBadRequest("Activities with visibility PrivateDraft can only be deleted by the owner");
        }

        await _store.Delete(activity);

        return Ok();
    }

    [HttpPost("{id}/register")]
    public async Task<ActionResult> PostRegister(int id)
    {
        _logger.LogInformation("Registering the user to activity {ActivityId}", id);

        if (_options.PreviewMode is { IsEnabled: true, EnableUserInteraction: false })
        {
            return StatusCode((int)HttpStatusCode.Locked, "User interaction is disabled");
        }

        if (_rateLimiter.AttemptAquire(RateLimitedResourceId.ActivityRegistration) is LeaseAquisitionFailure)
        {
            _logger.LogWarning("Request rate limited");
            return StatusCode(StatusCodes.Status429TooManyRequests);
        }

        var activity = await Find(id);
        if (activity == null)
        {
            return _logger.LogNotFound("Activity not found");
        }

        if (activity.StartTime < DateTimeOffset.UtcNow)
        {
            return _logger.LogBadRequest("Cannot register for an activity which is already over");
        }

        var (max, current) = (activity.MaxNumberOfParticipants, activity.CurrentNumberOfParticipants);
        if (max != null && current >= max)
        {
            return _logger.LogBadRequest(
                "Cannot register because the limit for participants is reached on this activity (current: {Current}, Max: {Max}",
                current,
                max);
        }

        if (activity.RegistrationLocked)
        {
            return _logger.LogBadRequest("Cannot register because the registration is locked for this activity");
        }

        var user = await _userManager.TryFindByPrincipal(User);
        if (user == null)
        {
            return _logger.LogNotFound("User not found");
        }

        if (await _store.IsRegisteredAsParticipant(activity, user))
        {
            return _logger.LogBadRequest("User is already registered");
        }

        // TODO: Send email, but debounce, maybe only send email every 5 minutes or so
        _logger.LogInformation("Sending invitation email");
        await _emailGenerator.SendActivityInvitation(user, activity);

        await _store.RegisterParticipant(activity, user);

        return Ok();
    }

    [HttpPost("{id}/unregister")]
    public async Task<ActionResult> PostUnregister(int id)
    {
        _logger.LogInformation("Unregistering the user from activity {ActivityId}", id);

        if (_options.PreviewMode is { IsEnabled: true, EnableUserInteraction: false })
        {
            return StatusCode((int)HttpStatusCode.Locked, "User interaction is disabled");
        }

        var activity = await Find(id);
        if (activity == null)
        {
            return _logger.LogNotFound("Activity {Id} not found", id);
        }

        if (activity.StartTime < DateTimeOffset.UtcNow)
        {
            return _logger.LogBadRequest("Cannot unregister from an activity which is already over");
        }

        var user = await _userManager.TryFindByPrincipal(User);
        if (user == null)
        {
            return _logger.LogNotFound("User not found");
        }

        if (await _store.IsRegisteredAsParticipant(activity, user) == false)
        {
            return _logger.LogBadRequest("User is not registered");
        }

        await _store.UnregisterParticipant(activity, user);

        return Ok();
    }

    private async Task<ActivityDto?> Find(int id)
    {
        var activity = (await _store.List(
                onlyId: id,
                userId: User.TryFindUserId(),
                isTeamMember: await IsTeamMember()))
            .SingleOrDefault();

        return activity;
    }

    private async Task<bool> IsTeamMember()
    {
        var result = await _authorizationService.AuthorizeAsync(User, null, PolicyNames.TeamMember);
        return result.Succeeded;
    }

    private BadRequestObjectResult? Validate(ActivityDto activity, UpdateActivityDto update)
    {
        var errors = new List<string>();

        if (update.PromoterId != activity.PromoterId)
        {
            errors.Add("The promoter cannot be changed yet");
        }

        // TODO: Check if title exists

        var isOwner = User.TryFindUserId() is { } userId && userId == activity.CreatedById;
        if (isOwner == false && activity.Visibility != update.Visibility && update.Visibility == ActivityVisibility.PrivateDraft)
        {
            errors.Add("Only the owner can change the visibility to PrivateDraft");
        }

        if (update.StartTime > update.EndTime)
        {
            errors.Add("Start time must be before end time");
        }

        if (update.MaxNumberOfParticipants < activity.CurrentNumberOfParticipants)
        {
            errors.Add("There are currently more registered participants than the specified maximum number of participants");
        }

        var numberOfRecurrenceLists =
            (update.RecurrenceByDay.Count > 1 ? 1 : 0) +
            (update.RecurrenceByMonthDay.Count > 1 ? 1 : 0) +
            (update.RecurrenceDates.Count > 1 ? 1 : 0);

        var numberOfLimits =
            (update.RepeatUntil != null ? 1 : 0) +
            (update.RepeatCount != null ? 1 : 0);

        if (update.RecurrenceFrequency is ActivityRecurrenceFrequency.Weekly or ActivityRecurrenceFrequency.Monthly)
        {
            // Validation for weekly recurrence
            if (update.RecurrenceFrequency == ActivityRecurrenceFrequency.Weekly)
            {
                if (update.RecurrenceInterval is < 1 or > 52)
                {
                    errors.Add("For weekly recurrence the interval must be >= 1 and <= 52");
                }

                if (update.RecurrenceByDay.Count > 7 || update.RecurrenceByDay.Any(x => x.Ordinal != 0))
                {
                    errors.Add("For weekly recurrence the recurrence by day list may not have more than 7 elements and the ordinal of each entry must be 0");
                }

                if (update.RecurrenceByMonthDay.Count > 0)
                {
                    errors.Add("For weekly the recurrence by month day list must be empty");
                }

                if (update.RecurrenceDates.Count > 0)
                {
                    errors.Add("For weekly recurrence the recurrence dates list must be empty");
                }
            }
            // Validation for monthly recurrence
            else if (update.RecurrenceFrequency == ActivityRecurrenceFrequency.Monthly)
            {
                if (update.RecurrenceInterval is < 1 or > 48)
                {
                    errors.Add("For monthly recurrence the recurrence interval must be >= 1 and <= 48");
                }

                if (update.RecurrenceByDay.Count > 31 || update.RecurrenceByDay.Any(x => x.Ordinal is not (-1 or >= 1 and <= 5)))
                {
                    errors.Add("For monthly recurrence the recurrence by day list may not have more than 31 elements and the ordinal of each entry must be -1 or >= 1 and <= 5");
                }

                if (update.RecurrenceByMonthDay.Any(x => x is < 1 or > 31))
                {
                    errors.Add("For monthly recurrence the the recurrence by month day values must be >= 1 and <= 31");
                }

                if (update.RecurrenceDates.Count > 0)
                {
                    errors.Add("For monthly recurrence the recurrence dates list must be empty");
                }
            }

            // Validation for both weekly and monthly recurrence

            if (numberOfRecurrenceLists > 1)
            {
                errors.Add("Can only have one recurrence list");
            }

            if (numberOfLimits != 1)
            {
                errors.Add("For monthly and weekly recurrence there must be a limit");
            }

            if (update.RepeatCount is < 0 or > 1000)
            {
                errors.Add("The repeat count must be >= 0 and <= 1000");
            }

            if (update.RepeatUntil < DateOnly.FromDateTime(activity.StartTime.Date) || update.RepeatUntil > DateOnly.FromDateTime(activity.StartTime.AddYears(4).Date))
            {
                errors.Add("Can only repeat for at most 4 years from the activity start time");
            }
        }
        else if (update.RecurrenceFrequency == ActivityRecurrenceFrequency.FixedDates)
        {
            if (update.RecurrenceInterval != null)
            {
                errors.Add("For fixed dates the recurrence interval must be null");
            }

            if (update.RecurrenceByDay.Count > 0)
            {
                errors.Add("For fixed dates the recurrence by day list must be empty");
            }

            if (update.RecurrenceByMonthDay.Count > 0)
            {
                errors.Add("For fixed dates the recurrence by month day list must be empty");
            }

            if (update.RecurrenceDates.Count < 1)
            {
                errors.Add("For fixed dates the recurrence dates list must not be empty");
            }
        }
        else  // Non-recurring
        {
            if (update.RecurrenceInterval != null)
            {
                errors.Add("For non-recurring activities, the interval must be null");
            }

            if (numberOfRecurrenceLists != 0)
            {
                errors.Add("Non-recurring activities cannot have recurrence lists");
            }

            if (numberOfLimits != 0)
            {
                errors.Add("Non-recurring activities cannot have recurrence limits");
            }
        }

        if (errors.Count != 0)
        {
            var formatted = string.Join("", errors.Select(x => $"\n*{x}"));
            return _logger.LogBadRequest("The update validation failed, errors: {Errors}", formatted);
        }

        return null;
    }
}
