namespace BuntesBegegnen.Api.Data.Entities;

public record Entity
{
    public int Id { get; init; }

    public required DateTimeOffset CreatedAt { get; init; }

    public required string? CreatedById { get; init; }
    public User? CreatedBy { get; init; }

    public bool IsDeleted { get; init; }
}
