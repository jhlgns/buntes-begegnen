namespace BuntesBegegnen.Api.Data.Entities;

public record UserActivityVote
{
    public required int ActivityId { get; init; }
    public Activity Activity { get; init; } = null!;

    public required string UserId { get; init; } = null!;
    public User User { get; init; } = null!;
}
