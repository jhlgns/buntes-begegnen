using System.Security.Claims;

namespace BuntesBegegnen.Api.UserManagement;

public static class ClaimsPrincipalExtensions
{
    public static string RequireUserId(this ClaimsPrincipal principal)
        => principal.FindFirstValue(ClaimTypes.UserId)
            ?? throw new InvalidOperationException("User ID not found");

    public static string? TryFindUserId(this ClaimsPrincipal principal)
        => principal.FindFirstValue(ClaimTypes.UserId);
}
