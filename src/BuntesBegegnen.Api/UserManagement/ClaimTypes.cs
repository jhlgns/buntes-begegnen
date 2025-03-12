namespace BuntesBegegnen.Api.UserManagement;

public static class ClaimTypes
{
    public const string Role = "role";
    public const string UserName = "user_name";
    public const string UserId = "sub";
    public const string Email = "email";
    public const string SecurityStamp = "jti";

    public const string FirstName = "first_name";
    public const string LastName = "last_name";

    public const string EmailAddressConfirmed = "email_confirmed";

    public const string AdminPasswordAuthorized = "admin_password_authorized";
}

public static class ClaimValueConstants
{
    public const string EmailAddressIsConfirmed = "yes";
    public const string EmailAddressIsNotConfirmed = "no";

    public const string AdminPasswordIsAuthorized = "yes";
    public const string AdminPasswordIsUnauthorized = "no";
}
