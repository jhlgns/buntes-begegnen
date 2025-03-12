using System.Net;
using System.Text.RegularExpressions;
using AutoMapper;
using BuntesBegegnen.Api.Data.Entities;
using BuntesBegegnen.Api.Data.Validation;
using BuntesBegegnen.Api.UserManagement;
using BuntesBegegnen.Api.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Bundlor.Lib.Hosting;

namespace BuntesBegegnen.Api.Controllers;

public class RegistrationRequestDto
{
    public required CreateUserDto Account { get; set; }

    [Password]
    public required string Password { get; set; }

    public required string? PreviewModePassword { get; set; }
}

public class RegistrationErrorDto
{
    public required string[] Errors { get; set; }
}

public class LoginRequestDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class AccountDto
{
    public required UserDto User { get; set; }
    public required string[] Roles { get; set; }
}

[ApiController]
[Route("account")]
public class AccountController : ControllerBase
{
    private readonly IUserManager _userManager;
    private readonly SignInManager<User> _signInManager;
    private readonly RateLimiter _rateLimiter;
    private readonly IMapper _mapper;
    private readonly ILogger<AccountController> _logger;
    private readonly ApiOptions _options;

    public AccountController(
        IUserManager userManager,
        SignInManager<User> signInManager,
        ILogger<AccountController> logger,
        IMapper mapper,
        IOptions<ApiOptions> options,
        RateLimiter rateLimiter)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _logger = logger;
        _mapper = mapper;
        _options = options.Value;
        _rateLimiter = rateLimiter;
    }

    [AllowAnonymous]
    [HttpPost("register")]
    [ProducesResponseType<RegistrationErrorDto>((int)HttpStatusCode.BadRequest)]
    public async Task<ActionResult<RegistrationErrorDto>> PostRegister(RegistrationRequestDto request)
    {
        _logger.LogInformation("Trying to register user with email {Email}", request.Account.Email);

        if (_rateLimiter.AttemptAquire(RateLimitedResourceId.Registration) is LeaseAquisitionFailure)
        {
            _logger.LogWarning("Request rate limited");
            return StatusCode(StatusCodes.Status429TooManyRequests);
        }

        if (_options.PreviewMode is { IsEnabled: true } previewMode)
        {
            if (previewMode.RegistrationAllowedEmailAddressPattern is { } pattern and not "")
            {
                var isMatch = Regex.IsMatch(request.Account.Email, pattern);
                if (isMatch == false)
                {
                    _logger.LogWarning(LoggingCategories.Security, "The email address does not match the allowed pattern {Pattern}", pattern);
                    return BadRequest();
                }
            }

            if (previewMode.RegistrationPassword is { } password && request.PreviewModePassword != password)
            {
                _logger.LogWarning(LoggingCategories.Security, "The preview mode password does not match");
                return BadRequest();
            }
        }

        switch (await _userManager.Register(request.Account, request.Password, RoleNames.PublicUser))
        {
            case UserRegistrationFailed failure:
                _logger.LogInformation(LoggingCategories.Security, "User registration failed, result: {Result}", failure.Result);
                return BadRequest(new RegistrationErrorDto { Errors = failure.Result.Errors.Select(x => x.Code).ToArray() });

            case UserRegistrationSucceeded success:
                _logger.LogInformation(LoggingCategories.Security, "User registration succeeded, user ID: {UserId}", success.User.Id);
                await _signInManager.SignInAsync(success.User, isPersistent: true);
                return Ok();

            default: throw new InvalidOperationException();
        }
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult> PostLogin(LoginRequestDto request)
    {
        _logger.LogInformation("Trying to authenticate user {Email}", request.Email);

        if (_rateLimiter.AttemptAquire(RateLimitedResourceId.Login) is LeaseAquisitionFailure)
        {
            _logger.LogWarning("Request rate limited");
            return StatusCode(StatusCodes.Status429TooManyRequests);
        }

        var user = await _userManager.FindByEmail(request.Email);
        if (user == null)
        {
            _logger.LogWarning(LoggingCategories.Security, "User not found");
            return BadRequest();
        }

        var result = await _signInManager.PasswordSignInAsync(user, request.Password, isPersistent: true, lockoutOnFailure: false);
        if (result.Succeeded == false)
        {
            _logger.LogWarning(LoggingCategories.Security, "Failed to sign in via password, result: {Result}", result);
            return BadRequest();
        }

        _logger.LogInformation("Authentication succeeded");

        return Ok();
    }

    [HttpPost("logout")]
    public async Task<ActionResult> PostLogout()
    {
        _logger.LogInformation("User signing out");

        await _signInManager.SignOutAsync();
        return Ok();
    }

    [HttpGet("mine")]
    public async Task<ActionResult<AccountDto>> GetAccount()
    {
        var user = await _userManager.TryFindByPrincipal(User);
        if (user == null)
        {
            _logger.LogWarning("User not found");
            return NotFound();
        }

        // NOTE: We could query the roles and the user info in one query
        var account = new AccountDto
        {
            User = _mapper.Map<UserDto>(user),
            Roles = await _userManager.GetRoles(user),
        };

        return Ok(account);
    }

    [HttpDelete("mine")]
    public async Task<ActionResult> DeleteAccount()
    {
        // TODO
        await Task.CompletedTask;
        throw new InvalidOperationException();
    }
}
