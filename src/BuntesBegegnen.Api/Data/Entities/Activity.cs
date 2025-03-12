namespace BuntesBegegnen.Api.Data.Entities;

public enum ActivityVisibility
{
    //AdminOnly = 1,  // Not used at the time - activities must be deleted setting the Entity.IsDeleted flag
    PrivateDraft = 2,  // Only visible to the author
    SharedDraft = 3,  // Shared internally in team
    Public = 4,  // Visible for the world
}

public enum ActivityCategory
{
    Excursion = 1,
    Creativity = 2,
    Exercise = 3,
}

// TODO: https://icalendar.org/rrule-tool.html
public enum ActivityRecurrenceFrequency
{
    None = 0,
    //Daily = 1,  // Every {Interval}th day -- NOT YET SUPPORTED
    Weekly = 2,  // Every {Interval}th week on days {ByDay.DayOfWeek} (ByDay.Ordinal is ignored)
    Monthly = 3,  // Every {Interval}th month on days [{ByDay.Ordinal}th {ByDay.DayOfWeek}]
    //Yearly = 4,  // Every {Interval}th year by month {ByMonth} on days [{ByDay.Ordinal}th {ByDay.DayOfWeek}] -- NOT YET SUPPORTED
    FixedDates = 5,
}

public record Activity : Entity
{
    public required int PromoterId { get; init; }
    public Promoter Promoter { get; init; } = null!;

    public required string Title { get; init; } = null!;
    public required ActivityVisibility Visibility { get; init; }
    public required ActivityCategory Category { get; init; }
    public required DateTimeOffset StartTime { get; init; }
    public required DateTimeOffset EndTime { get; init; }
    public required bool IsAllDay { get; init; }
    public required int? MaxNumberOfParticipants { get; init; }
    public required bool RegistrationLocked { get; init; }
    public required string Location { get; init; } = null!;
    public required string Description { get; init; } = null!;

    public required ActivityRecurrenceFrequency RecurrenceFrequency { get; init; }
    public required int? RecurrenceInterval { get; init; }
    public required DateOnly? RepeatUntil { get; init; }
    public required int? RepeatCount { get; init; }

    public List<ActivityRecurrenceDate> RecurrenceDates { get; set; } = [];
    public List<ActivityRecurrenceByDay> RecurrenceByDay { get; set; } = [];
    public List<ActivityRecurrenceByMonthDay> RecurrenceByMonthDay { get; set; } = [];
    public List<ActivityRecurrenceException> RecurrenceExceptions { get; set; } = [];
}
