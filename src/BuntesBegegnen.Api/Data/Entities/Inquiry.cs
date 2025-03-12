namespace BuntesBegegnen.Api.Data.Entities;

public enum InquiryType
{
    General = 1,
    ActivitySuggestion = 2,
    PlatformSuggestion = 3,
}

public record Inquiry : Entity
{
    public required string? EmailAddress { get; init; }  // NOTE: Only for non authenticated users
    public required InquiryType Type { get; init; }
    public required string Message { get; init; }
    public required bool IsAnonymous { get; init; }
    public required string? IpAddress { get; init; }
}
