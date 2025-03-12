namespace BuntesBegegnen.Api.Data.Entities;

public record ActivityRecurrenceByDay
{
    public required int ActivityId { get; init; }
    public Activity Activity { get; init; } = null!;

    public required int Ordinal { get; init; }
    public required DayOfWeek DayOfWeek { get; init; }
}
