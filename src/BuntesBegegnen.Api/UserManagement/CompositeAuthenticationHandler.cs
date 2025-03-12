using System.Security.Claims;
using System.Text.Encodings.Web;
using BuntesBegegnen.Api.Data.Entities;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace BuntesBegegnen.Api.UserManagement;

// Inspired by https://source.dot.net/#Microsoft.AspNetCore.Identity/IdentityServiceCollectionExtensions.cs,189
public class CompositeAuthenticationHandler : SignInAuthenticationHandler<AuthenticationSchemeOptions>
{
    private readonly IUserManager _userManager;
    private readonly UserManager<User> _userManager1;
    private readonly ApiOptions _options;

    public CompositeAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        IUserManager userManager,
        UserManager<User> userManager1,
        IOptions<ApiOptions> bbOptions)
        : base(options, logger, encoder)
    {
        _userManager = userManager;
        _userManager1 = userManager1;
        _options = bbOptions.Value;
    }

    public const string DefaultSchemeName = "IdentityAuthentiationWithBBAdminPassword";

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var result = await Context.AuthenticateAsync(IdentityConstants.ApplicationScheme);

        if (result.Succeeded == false)
        {
            return result;
        }

        // NOTE: We could also take the email address via header here
        var password = Request.Headers["BB-Admin-Password"].ToString();
        if (password is null or "")
        {
            return result;
        }

        var admin = await _userManager.FindByEmail(_options.AdminAccount.Email) ??
            throw new InvalidOperationException("Cannot find the admin user");

        if (await _userManager1.CheckPasswordAsync(admin, password) == false)
        {
            // TODO: Does this allow for easier brute force attacks or something like this? @Security
            Logger.LogWarning("The admin password header is present but the password is not correct");
            return result;
        }

        Logger.LogWarning("Authorizing this request with the {ClaimType} claim", ClaimTypes.AdminPasswordAuthorized);

        var identity = result.Ticket.Principal.Identities.First();
        identity.AddClaim(new Claim(ClaimTypes.AdminPasswordAuthorized, ClaimValueConstants.AdminPasswordIsAuthorized));

        return result;
    }

    protected override Task HandleSignInAsync(ClaimsPrincipal user, AuthenticationProperties? properties)
    {
        throw new NotImplementedException();
    }

    protected override Task HandleSignOutAsync(AuthenticationProperties? properties)
    {
        throw new NotImplementedException();
    }
}
