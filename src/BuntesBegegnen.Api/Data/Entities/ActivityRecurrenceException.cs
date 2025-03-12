namespace BuntesBegegnen.Api.Data.Entities;

public record ActivityRecurrenceException
{
    public int ActivityId { get; init; }
    public Activity Activity { get; init; } = null!;

    public DateTimeOffset? StartTime { get; init; }
}
