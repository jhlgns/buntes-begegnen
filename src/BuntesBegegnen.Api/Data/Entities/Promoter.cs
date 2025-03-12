namespace BuntesBegegnen.Api.Data.Entities;

public record Promoter : Entity
{
    public required string Name { get; init; } = null!;
    public required string? Website { get; init; } = null!;
    public required string? StreetName { get; init; }
    public required string? HouseNumber { get; init; }
    public required string? ZipCode { get; init; }
    public required string? City { get; init; }

    public List<Activity> Activities { get; init; } = [];
}
