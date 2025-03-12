namespace BuntesBegegnen.Api.Data.Entities;

public class ActivityRecurrenceDate
{
    public required int ActivityId { get; set; }
    public Activity Activity { get; set; } = null!;

    public required DateTimeOffset StartTime { get; set; }
}
