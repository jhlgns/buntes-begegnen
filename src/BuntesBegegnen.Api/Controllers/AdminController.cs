
using BuntesBegegnen.Api.Data;
using BuntesBegegnen.Api.Data.Entities;
using BuntesBegegnen.Api.UserManagement;
using BuntesBegegnen.Api.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BuntesBegegnen.Api.Controllers;

public class UserWithRolesDto
{
    public required User User { get; set; }
    public required string[] Roles { get; set; }
}

[Authorize(PolicyNames.Admin)]
[ApiController]
[Route("admin")]
public class AdminController : ControllerBase
{
    private readonly BundlorWebContext _context;
    private readonly SignInManager<User> _signInManager;
    private readonly IUserManager _userManager;
    private readonly ILogger<AdminController> _logger;
    private readonly ApiOptions _options;

    public AdminController(
        BundlorWebContext context,
        SignInManager<User> signInManager,
        ILogger<AdminController> logger,
        IUserManager userManager,
        IOptions<ApiOptions> options)
    {
        _context = context;
        _signInManager = signInManager;
        _logger = logger;
        _userManager = userManager;
        _options = options.Value;
    }

    [HttpGet("users")]
    public async Task<ActionResult<UserWithRolesDto[]>> GetUsers()
    {
        _logger.LogWarning("Listing all users");

        // var result = await _context.Users
        //     .Join(
        //         _context.UserRoles,
        //         user => user.Id,
        //         userRole => userRole.UserId,
        //         (user, userRole) => new { user, userRole })
        //     .GroupJoin(
        //         _context.Roles,
        //         userAndUserRole => userAndUserRole.userRole.RoleId,
        //         role => role.Id,
        //         (userAndUserRole, roles) => new { user = userAndUserRole.user, roles = roles })
        //     .Select(x => new UserWithRolesDto
        //     {
        //         User = x.user,
        //         Roles = x.roles.Select(x => x.Name!).ToArray()
        //     })
        //     .ToListAsync();

        // var result = await _context.Database.SqlQuery<UserWithRolesDto>($"""
        //     SELECT *
        //     FROM AspNetUsers users
        //     LEFT JOIN AspNetUserRoles userRoles
        //         ON userRoles.UserId == users.Id
        //     LEFT JOIN AspNetRoles roles
        //         ON roles.Id == userRoles.RoleId
        //     """)
        //     .ToListAsync();

        var result = new List<UserWithRolesDto>();

        var users = await _context.Users.ToListAsync();
        foreach (var user in users)
        {
            result.Add(new() { User = user, Roles = await _userManager.GetRoles(user) });
        }

        return Ok(result);
    }

    [HttpPost("users/{userId}/roles")]
    public async Task<ActionResult> PostUserRole(string userId, string roleName)
    {
        _logger.LogInformation("Adding user {UserId} to role {RoleName}", userId, roleName);

        var user = await _userManager.Find(userId);
        if (user == null)
        {
            _logger.LogWarning("User not found");
            return NotFound();
        }

        var result = await _userManager.AddToRole(user, roleName);
        if (result.Succeeded == false)
        {
            return BadRequest(result.ToString());
        }

        return Ok();
    }

    [HttpDelete("users/{userId}/roles")]
    public async Task<ActionResult> DeleteUserRole(string userId, string roleName)
    {
        _logger.LogInformation("Removing user {UserId} from role {RoleName}", userId, roleName);

        var user = await _userManager.Find(userId);
        if (user == null)
        {
            _logger.LogWarning("User not found");
            return NotFound();
        }

        var result = await _userManager.RemoveFromRole(user, roleName);
        if (result.Succeeded == false)
        {
            return BadRequest(result.ToString());
        }

        return Ok();
    }

    [HttpPut("users/{userId}/locked")]
    public async Task<ActionResult> PutUsersLocked(string userId, bool isLocked)
    {
        _logger.LogInformation("Setting user {UserId} account locked status to {IsLocked}", userId, isLocked);

        var user = await _userManager.Find(userId);
        if (user == null)
        {
            _logger.LogWarning("User not found");
            return NotFound();
        }

        if (user.Email == _options.AdminAccount.Email)
        {
            _logger.LogWarning("Cannot lock admin out");
            return BadRequest();
        }

        user.LockoutEnabled = true;
        user.LockoutEnd = isLocked ? DateTimeOffset.MaxValue : null;
        await _userManager.Update(user);

        return Ok();
    }

    [HttpPost("users/{userId}/reset-password")]
    public async Task<ActionResult> PostUsersResetPassword(string userId)
    {
        // TODO
        await Task.CompletedTask;
        throw new NotImplementedException();
    }

    [HttpPut("users/{userId}")]
    public async Task<ActionResult> PutUsers(string userId, User body)
    {
        // TODO
        await Task.CompletedTask;
        throw new NotImplementedException();
    }
}
