namespace BuntesBegegnen.Api.Data.Entities;

public record ActivityRecurrenceByMonthDay
{
    public required int ActivityId { get; init; }
    public Activity Activity { get; init; } = null!;

    public required int MonthDay { get; init; }
}
