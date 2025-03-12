using BuntesBegegnen.Api.Util;

namespace BuntesBegegnen.Api;

public record AdminAccountOptions
{
    public string Email { get; init; } = "";
    public string Password { get; init; } = "";
}

public record DefaultPromoterOptions
{
    public string Name { get; init; } = null!;
    public string? Website { get; init; } = null!;
    public string? StreetName { get; init; }
    public string? HouseNumber { get; init; }
    public string? ZipCode { get; init; }
    public string? City { get; init; }
}

public record RateLimitOptions
{
    public RateLimitedResourceId ResourceId { get; init; }
    public TimeSpan Period { get; init; }
    public int PermitLimit { get; init; }
}

public record MetadataOptions
{
    public TimeSpan? ApiMetadataRefreshInterval { get; set; } = TimeSpan.FromSeconds(30);
}

public record PreviewModeOptions
{
    public bool IsEnabled { get; init; }  // NOTE: The registration protection is only active, if the preview mode is enabled!!!
    public string? RegistrationPassword { get; init; }
    public string? RegistrationAllowedEmailAddressPattern { get; init; }  // NOTE: Registration can be disabled entirely by using an impossible regex like '$a'
    public bool EnableUserInteraction { get; set; }
}

public record ChatOptions
{
    public int MessagePageSize { get; init; } = 20;
}

public record AuthenticationOptions
{
    public TimeSpan CookieTimeToLive { get; init; } = TimeSpan.FromDays(1);
    public bool NotifyAdminAboutAuthenticationEvents { get; init; } = true;
}

public record ApiOptions
{
    public const string Key = "BundlorWeb";  // TODO: Rename

    public AuthenticationOptions Authentication { get; init; } = new();
    public AdminAccountOptions AdminAccount { get; init; } = new();
    public DefaultPromoterOptions DefaultPromoter { get; init; } = new();
    public bool SeedBogusData { get; init; }
    public bool OverwriteInitialActivities { get; init; }
    public MetadataOptions Metadata { get; init; } = new();
    public PreviewModeOptions PreviewMode { get; init; } = new();
    public string ProxyHostName { get; init; } = "";
    public string ContactEmailAddress { get; init; } = "";  // TODO: Where is this used?
    public TimeSpan EmailConfirmationCodeTimeToLive { get; init; } = TimeSpan.FromDays(1);
    public TimeSpan HousekeepingInterval { get; init; } = TimeSpan.FromMinutes(10);
    public string[] AllowedCorsOrigins { get; init; } = [];
    public RateLimitOptions[] RateLimits { get; init; } = [];
}
