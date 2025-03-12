using System.Linq.Expressions;
using System.Security.Claims;
using System.Security.Cryptography;
using BuntesBegegnen.Api.Data;
using BuntesBegegnen.Api.Data.Entities;
using BuntesBegegnen.Api.Email;
using BuntesBegegnen.Api.Util;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Bundlor.Lib.Hosting;

namespace BuntesBegegnen.Api.UserManagement;

public class UserManager : IUserManager
{
    private static readonly IdentityError CannotRemoveRoleFromAdmin = new()
    {
        Code = "CannotRemoveRoleFromAdmin",
        Description = "Roles cannot be removed from the admin user",
    };

    private readonly UserManager<User> _userManager;
    private readonly IEmailGenerator _emailGenerator;
    private readonly BundlorWebContext _context;
    private readonly ApiOptions _options;
    private readonly ILogger<UserManager> _logger;

    public UserManager(
        UserManager<User> userManager,
        IEmailGenerator emailGenerator,
        BundlorWebContext context,
        IOptions<ApiOptions> options,
        ILogger<UserManager> logger)
    {
        _userManager = userManager;
        _emailGenerator = emailGenerator;
        _context = context;
        _options = options.Value;
        _logger = logger;
    }

    public async Task StartEmailConfirmation(User user, string newEmailAddress)
    {
        _logger.LogInformation(
            "Starting email confirmation for user {UserId}, current email address: {CurrentEmailAddress}, new email address: {NewEmailAddress}",
            user.Id,
            user.Email,
            newEmailAddress);

        var currentEntry = await _context.EmailConfirmationCodes
            .SingleOrDefaultAsync(x => x.UserId == user.Id);
        if (currentEntry != null)
        {
            _logger.LogInformation("There was a pending email confirmation code entry, deleting it");
            _context.EmailConfirmationCodes.Remove(currentEntry);
            await _context.SaveChangesAsync();
        }

        if (user.EmailConfirmed)
        {
            _logger.LogInformation("Current email address is confirmed, unconfirming");
            user.EmailConfirmed = false;
            await Update(user);
        }

        var code = RandomNumberGenerator.GetInt32(0, 1_000_000).ToString("D6");
        _logger.LogInformation("Storing email confirmation code {Code} for user {UserId}", code, user.Id);

        // NOTE: We don't store the new email address in the user profile right away so that they could still log in
        // even if they changed their email address to one that does not belong to them.

        var entry = new EmailConfirmationCode
        {
            UserId = user.Id,
            NewEmailAddress = newEmailAddress,
            Code = code,
            Expiry = DateTimeOffset.UtcNow + _options.EmailConfirmationCodeTimeToLive,
        };
        _context.EmailConfirmationCodes.Add(entry);
        await _context.SaveChangesAsync();

        try
        {
            var destinationEmailAddress = newEmailAddress ?? user.Email ??
                throw new InvalidOperationException("Cannot send confirmation email, there is no new email address and the user does not have one already");

            // TODO: Send a link via email that allows easy confirmation without entering the code (add query parameter for the confirmation code)
            await _emailGenerator.SendConfirmationEmail(user, destinationEmailAddress, entry.Code);
        }
        catch (Exception ex)
        {
            try
            {
                _context.EmailConfirmationCodes.Remove(entry);
                await _context.SaveChangesAsync();
            }
            catch { }

            throw new ConfirmationEmailException(ex);
        }
    }

    public async Task<string?> GetNewEmailAddress(User user)
    {
        if (user.EmailConfirmed)
        {
            return null;
        }

        var currentEntry = await _context.EmailConfirmationCodes
            .SingleOrDefaultAsync(x => x.UserId == user.Id);
        if (currentEntry is { NewEmailAddress: not null })
        {
            return currentEntry.NewEmailAddress;
        }

        return user.Email;
    }

    public async Task<bool> TryConfirmEmail(User user, string code)
    {
        _logger.LogInformation("Attempting to confirm email address of user {UserId} with code {Code}", user.Id, code);

        if (user.EmailConfirmed)
        {
            _logger.LogWarning("Email address is already confirmed");
            return true;
        }

        var entry = await _context.EmailConfirmationCodes
            .SingleOrDefaultAsync(x => x.UserId == user.Id && x.Code == code);
        if (entry == null || entry.Expiry < DateTimeOffset.Now)  // @SQLiteWeirdness
        {
            return false;
        }

        user.EmailConfirmed = true;

        if (entry.NewEmailAddress != null && user.Email != entry.NewEmailAddress)
        {
            _logger.LogInformation(
                "Email address change from {CurrentEmailAddress} to {NewEmailAdress} confirmed",
                user.Email,
                entry.NewEmailAddress);

            user.Email = entry.NewEmailAddress;
        }
        else
        {
            _logger.LogInformation("Email address confirmed without change");
        }

        await Update(user);

        return true;
    }

    public async Task<UserRegistrationResult> Register(CreateUserDto account, string password, string role)
    {
        _logger.LogInformation(
            "Registering user; first name: {FirstName}, last name: {LastName} email address: {Email}",
            account.FirstName,
            account.LastName,
            account.Email);

        var user = new User
        {
            UserName = account.Email,
            Email = account.Email,
            PhoneNumber = account.PhoneNumber,
            CreatedAt = DateTimeOffset.UtcNow,
            FirstName = account.FirstName,
            LastName = account.LastName,
            BirthDay = account.BirthDay,
            StreetName = account.StreetName,
            HouseNumber = account.HouseNumber,
            ZipCode = account.ZipCode,
            City = account.City,
            Goals = null,
            Hobbies = null,
            ImpairedSight = false,
            ImpairedHearing = false,
            ImpairedSpeech = false,
            ImpairedMobility = false,
            AdditionalHandicaps = null,
        };

        var result = await _userManager.CreateAsync(user, password);
        if (result.Succeeded == false)
        {
            _logger.LogWarning(LoggingCategories.Security, "Failed to create the user: {Result}", result);

            if (_options.Authentication.NotifyAdminAboutAuthenticationEvents)
            {
                await _emailGenerator.NotifyAdminAboutAuthenticationEvent(user, isRegistration: true, result: result);
            }

            return new UserRegistrationFailed(result);
        }

        var addToRoleResult = await _userManager.AddToRoleAsync(user, role);
        if (addToRoleResult.Succeeded == false)
        {
            _logger.LogWarning("Failed to add the user to role {Role}", role);
        }

        _logger.LogInformation(LoggingCategories.Security, "User {UserId} created", user.Id);

        if (_options.Authentication.NotifyAdminAboutAuthenticationEvents)
        {
            await _emailGenerator.NotifyAdminAboutAuthenticationEvent(user, isRegistration: true, result: result);
        }

        await StartEmailConfirmation(user, user.Email);

        return new UserRegistrationSucceeded(user);
    }

    public async Task<User?> TryFindByPrincipal(ClaimsPrincipal claimsPrincipal, Expression<Func<User, object>>[]? includes = null)
    {
        var userId = claimsPrincipal.FindFirstValue(ClaimTypes.UserId);
        if (userId == null)
        {
            _logger.LogInformation("User ID claim not found");
            return null;
        }

        var user = await _userManager
            .Users
            .Include(includes)
            .FirstOrDefaultAsync(x => x.Id == userId);
        if (user == null)
        {
            _logger.LogInformation("User not found in database");
        }

        return user;
    }

    public async Task<List<User>> List(
        Expression<Func<User, object>>[]? includes = null,
        Expression<Func<User, bool>>? filter = null)
    {
        var query = _userManager.Users
            .Include(includes)
            .Where(filter ?? (x => true));

        var result = await query.ToListAsync();
        return result;
    }

    public async Task<string[]> GetRoles(User user)
    {
        return (await _userManager.GetRolesAsync(user)).ToArray();
    }

    public Task<IdentityResult> AddToRole(User user, string roleName)
    {
        _logger.LogInformation("Adding user {UserId} to role {RoleName}", user.Id, roleName);
        return _userManager.AddToRoleAsync(user, roleName);
    }

    public Task<IdentityResult> RemoveFromRole(User user, string roleName)
    {
        _logger.LogInformation("Removing user {UserId} from role {RoleName}", user.Id, roleName);

        if (user.Email == _options.AdminAccount.Email)
        {
            _logger.LogWarning("Cannot remove role from admin user");
            var result = IdentityResult.Failed([CannotRemoveRoleFromAdmin]);
            return Task.FromResult(result);
        }

        return _userManager.RemoveFromRoleAsync(user, roleName);
    }

    public async Task<List<User>> ListUsersInRole(string roleName)
    {
        var result = await _userManager.GetUsersInRoleAsync(roleName);
        return result.ToList();
    }

    public Task<User?> FindByEmail(string email)
    {
        return _userManager.FindByEmailAsync(email);
    }

    public async Task<User?> Find(string id, Expression<Func<User, object>>[]? includes)
    {
        var query = _userManager.Users;
        foreach (var include in includes ?? [])
        {
            query = query.Include(include);
        }

        var result = await query.FirstOrDefaultAsync(x => x.Id == id);
        return result;
    }

    public async Task AddFavoriteCategory(User user, ActivityCategory category)
    {
        _logger.LogInformation("Adding favorite category {Category}", category);

        var isAlreadyFavorite = await _context.UserFavoriteCategories
            .AnyAsync(x => x.UserId == user.Id && x.Category == category);
        if (isAlreadyFavorite)
        {
            _logger.LogInformation("Category already favorited");
            return;
        }

        _context.UserFavoriteCategories.Add(new() { UserId = user.Id, Category = category, });
        await _context.SaveChangesAsync();
    }

    public async Task RemoveFavoriteCategory(User user, ActivityCategory category)
    {
        _logger.LogInformation("Removing favorite category {Category}", category);

        await _context.UserFavoriteCategories
            .Where(x => x.UserId == user.Id && x.Category == category)
            .ExecuteDeleteAsync();
    }

    public async Task Update(User user)
    {
        _logger.LogInformation("Updating user {UserId}", user.Id);
        await _userManager.UpdateAsync(user);
    }
}
