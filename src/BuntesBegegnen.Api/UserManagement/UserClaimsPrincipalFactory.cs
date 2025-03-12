using System.Security.Claims;
using BuntesBegegnen.Api.Data.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace BuntesBegegnen.Api.UserManagement;

public class ClaimsPrincipalFactory : UserClaimsPrincipalFactory<User, IdentityRole>
{
    public ClaimsPrincipalFactory(
        UserManager<User> userManager,
        RoleManager<IdentityRole> roleManager,
        IOptions<IdentityOptions> optionsAccessor)
        : base(userManager, roleManager, optionsAccessor)
    {
    }

    protected override async Task<ClaimsIdentity> GenerateClaimsAsync(User user)
    {
        var result = await base.GenerateClaimsAsync(user);
        var value = user.EmailConfirmed
            ? ClaimValueConstants.EmailAddressIsConfirmed
            : ClaimValueConstants.EmailAddressIsNotConfirmed;
        result.AddClaim(new(ClaimTypes.EmailAddressConfirmed, value));

        return result;
    }
}
