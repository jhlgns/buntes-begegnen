using System.Net;
using BuntesBegegnen.Api.Data;
using BuntesBegegnen.Api.Data.Entities;
using BuntesBegegnen.Api.UserManagement;
using BuntesBegegnen.Api.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuntesBegegnen.Api.Controllers;

public record ClaimDto(string Type, string Value);

[Authorize(PolicyNames.Admin)]
[ApiController]
[Route("debug")]
public class DebugController : ControllerBase
{
    private readonly BundlorWebContext _context;
    private readonly IWebHostEnvironment _environment;
    private readonly SignInManager<User> _signInManager;
    private readonly ILogger<DebugController> _logger;
    private readonly RateLimiter _rateLimiter;

    public DebugController(
        BundlorWebContext context,
        IWebHostEnvironment environment,
        SignInManager<User> signInManager,
        ILogger<DebugController> logger,
        RateLimiter rateLimiter)
    {
        _context = context;
        _environment = environment;
        _signInManager = signInManager;
        _logger = logger;
        _rateLimiter = rateLimiter;
    }

    private bool IsEnabled => _environment.IsDevelopment() || _environment.IsLocal();

    [HttpGet("my-claims")]
    public ActionResult<ClaimDto[]> GetMyClaims()
    {
        if (IsEnabled == false)
        {
            return StatusCode((int)HttpStatusCode.Locked, null);
        }

        return Ok(User.Claims.Select(x => new ClaimDto(x.Type, x.Value)).ToArray());
    }

    [HttpPost("assume")]
    public async Task<ActionResult> AssumeUser(string id)
    {
        if (IsEnabled == false)
        {
            return StatusCode((int)HttpStatusCode.Locked, null);
        }

        _logger.LogWarning("User {CurrentUserId} assuming user {NewUserId}", User.TryFindUserId(), id);

        var user = await _context.Users.FindAsync(id);
        if (user == null)
        {
            _logger.LogWarning("New user not found");
            return NotFound();
        }

        await _signInManager.SignInAsync(user, isPersistent: true);

        return Ok();
    }

    [AllowAnonymous]
    [HttpGet("rate-limiting-test")]
    public ActionResult GetRateLimitingTest()
    {
        if (IsEnabled == false)
        {
            return StatusCode((int)HttpStatusCode.Locked, null);
        }

        _logger.LogInformation("Rate limit test");

        if (_rateLimiter.AttemptAquire(RateLimitedResourceId.RateLimitingTest) is LeaseAquisitionFailure)
        {
            _logger.LogWarning("Request rate limited");
            return StatusCode(StatusCodes.Status429TooManyRequests);
        }

        return Ok();
    }

    [AllowAnonymous]
    [HttpGet("error-test")]
    public ActionResult GetErrorTest()
    {
        if (IsEnabled == false)
        {
            return StatusCode((int)HttpStatusCode.Locked, null);
        }

        _logger.LogInformation("Error test");

        throw new InvalidOperationException("Oh nooo, something very serious happened!");
    }

    [HttpGet("activities-as-code")]
    public async Task<ActionResult<string>> GetActivitiesAsCode()
    {
        if (IsEnabled == false)
        {
            return StatusCode((int)HttpStatusCode.Locked, null);
        }

        var activities = await _context.Activities
            .Where(x => x.IsDeleted == false)
            .ToListAsync();

        static string NullableDateTimeOffset(DateTimeOffset? value)
        {
            if (value == null)
            {
                return "null";
            }

            return $"new DateTimeOffset({value.Value.Year}, {value.Value.Month}, {value.Value.Day}, {value.Value.Hour}, {value.Value.Minute}, {value.Value.Second}, DateTimeOffset.UtcNow.Offset)";
        }

        // TODO: Recurrence data
        var code = string.Join(
                "\n",
                activities.Select(x => $$"""
                new()
                {
                    CreatedById = admin.Id,
                    CreatedAt   = DateTimeOffset.UtcNow,
                    PromoterId  = promoter.Id,
                    Visibility  = ActivityVisibility.Public,
                    Title       = "{{x.Title}}",
                    Category    = ActivityCategory.{{x.Category}},
                    StartTime   = {{NullableDateTimeOffset(x.StartTime)}},
                    EndTime     = {{NullableDateTimeOffset(x.EndTime)}},
                    MaxNumberOfParticipants = {{x.MaxNumberOfParticipants?.ToString() ?? "null"}},
                    RegistrationLocked = {{(x.RegistrationLocked ? "true" : "false")}},
                    Location    = "{{x.Location}}",
                    Description = {{"\"\"\""}}
                    {{x.Description.ReplaceLineEndings("\n    ")}}
                    {{"\"\"\""}},
                },
                """));

        return code;
    }
}
