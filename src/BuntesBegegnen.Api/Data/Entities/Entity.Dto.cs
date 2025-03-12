namespace BuntesBegegnen.Api.Data.Entities;

public record EntityDto
{
    public required int Id { get; init; }
    public required DateTimeOffset CreatedAt { get; init; }
    public required string CreatedById { get; init; }
}
