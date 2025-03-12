namespace BuntesBegegnen.Api.UserManagement;

public class PasswordOptions
{
    public const int RequiredLength = 6;
    public const int RequiredUniqueChars = 3;
    public const bool RequireNonAlphanumeric = true;
    public const bool RequireLowercase = false;
    public const bool RequireUppercase = false;
    public const bool RequireDigit = false;
}
