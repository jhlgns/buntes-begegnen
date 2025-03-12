namespace BuntesBegegnen.Api.Controllers;

public enum ValidationConstraintType
{
    ChildObject,
    Required,
    StringLength,
    RegularExpression,
    Password,
    Range,
}

public record ChildObjectConstraintDto(
    string Type)
{
}

// NOTE: Keep theses contraints in sync with validation.tsx

public record RequiredConstraintDto(
    string? ErrorMessage)
{
}

// Placeholders for ErrorMessageFormat: {MinLength} {MaxLength}
public record StringLengthConstraintDto(
    int MinLength,
    int MaxLength,
    string? ErrorMessageFormat)
{
}

public record RegularExpressionConstraintDto(
    string Pattern,
    string ErrorMessage)
{
}

public record PasswordConstraintDto(
    int RequiredLength,
    int RequiredUniqueChars,
    bool RequireNonAlphanumeric,
    bool RequireLowercase,
    bool RequireUppercase,
    bool RequireDigit);

public record RangeConstraintDto(
    object? Minimum,
    object? Maximum);

public record FieldValidationConstraintDto(
    ValidationConstraintType Type,
    object Constraint);

public record TypeConstraintsDto(
    Dictionary<string, FieldValidationConstraintDto[]> Fields);

// TODO: More constraints
// * EmailContraint
// * NumberRangeConstraint
// * DateRangeConstraint

public record ApiMetadataDto(
    bool PreviewModeEnabled,
    bool PreviewModeRegistrationPasswordRequired,
    bool EnableUserInteraction,
    TimeSpan? ApiMetadataRefreshInterval,
    Dictionary<string, TypeConstraintsDto> TypeConstraints);
