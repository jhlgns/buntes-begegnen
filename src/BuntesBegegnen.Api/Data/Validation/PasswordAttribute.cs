using BuntesBegegnen.Api.UserManagement;

namespace BuntesBegegnen.Api.Data.Validation;

[AttributeUsage(AttributeTargets.Property | AttributeTargets.Field | AttributeTargets.Parameter, AllowMultiple = false)]
public class PasswordAttribute : Attribute
{
    public PasswordAttribute()
    {
    }

    public int RequiredLength { get; set; } = PasswordOptions.RequiredLength;
    public int RequiredUniqueChars { get; set; } = PasswordOptions.RequiredUniqueChars;
    public bool RequireNonAlphanumeric { get; set; } = PasswordOptions.RequireNonAlphanumeric;
    public bool RequireLowercase { get; set; } = PasswordOptions.RequireLowercase;
    public bool RequireUppercase { get; set; } = PasswordOptions.RequireUppercase;
    public bool RequireDigit { get; set; } = PasswordOptions.RequireDigit;
}
