namespace BuntesBegegnen.Api.Data.Entities;

public record EmailConfirmationCode
{
    public int Id { get; init; }
    public required string UserId { get; init; } = null!;
    public User User { get; init; } = null!;
    public string? NewEmailAddress { get; init; }
    public required string Code { get; init; } = null!;
    public required DateTimeOffset Expiry { get; init; }
}
