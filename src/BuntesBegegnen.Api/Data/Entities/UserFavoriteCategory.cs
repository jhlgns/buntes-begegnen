namespace BuntesBegegnen.Api.Data.Entities;

public record UserFavoriteCategory
{
    public required string UserId { get; init; } = null!;
    public User User { get; init; } = null!;

    public required ActivityCategory Category { get; init; }
}
