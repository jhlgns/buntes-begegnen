using System.Linq.Expressions;
using System.Security.Claims;
using BuntesBegegnen.Api.Data.Entities;
using Microsoft.AspNetCore.Identity;

namespace BuntesBegegnen.Api.UserManagement;

public interface IUserManager
{
    Task StartEmailConfirmation(User user, string newEmailAddress);

    Task<string?> GetNewEmailAddress(User user);

    Task<bool> TryConfirmEmail(User user, string code);

    Task<UserRegistrationResult> Register(CreateUserDto account, string password, string role);

    Task<User?> TryFindByPrincipal(ClaimsPrincipal claimsPrincipal, Expression<Func<User, object>>[]? includes = null);

    Task<List<User>> List(
        Expression<Func<User, object>>[]? includes = null,
        Expression<Func<User, bool>>? filter = null);

    Task<string[]> GetRoles(User user);

    Task<IdentityResult> AddToRole(User user, string roleName);

    Task<IdentityResult> RemoveFromRole(User user, string roleName);

    Task<List<User>> ListUsersInRole(string roleName);

    Task<User?> FindByEmail(string email);

    Task<User?> Find(string id, Expression<Func<User, object>>[]? includes = null);

    Task AddFavoriteCategory(User user, ActivityCategory category);

    Task RemoveFavoriteCategory(User user, ActivityCategory category);

    Task Update(User user);
}
