using AutoMapper;
using BuntesBegegnen.Api.UserManagement;
using BuntesBegegnen.Api.Util;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace BuntesBegegnen.Api.Controllers;

public class UserProfileDto
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
}

[ApiController]
[Route("profile")]
public class ProfileController : ControllerBase
{
    private readonly IUserManager _userManager;
    private readonly RateLimiter _rateLimiter;
    private readonly IMapper _mapper;
    private readonly ILogger<ProfileController> _logger;
    private readonly ApiOptions _options;

    public ProfileController(
        IUserManager userManager,
        ILogger<ProfileController> logger,
        IMapper mapper,
        IOptions<ApiOptions> options,
        RateLimiter rateLimiter)
    {
        _userManager = userManager;
        _logger = logger;
        _mapper = mapper;
        _options = options.Value;
        _rateLimiter = rateLimiter;
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserProfileDto>> GetProfile(string id)
    {
        var user = await _userManager.Find(id);
        if (user == null)
        {
            return NotFound();
        }

        var result = new UserProfileDto
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
        };

        return Ok(result);
    }
}
