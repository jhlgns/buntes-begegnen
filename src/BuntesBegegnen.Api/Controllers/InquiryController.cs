using BuntesBegegnen.Api.Data;
using BuntesBegegnen.Api.Data.Entities;
using BuntesBegegnen.Api.Util;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuntesBegegnen.Api.Controllers;

[ApiController]
[Route("inquiry")]
public class InquiryController : ControllerBase
{
    private readonly InquiryHandler _inquiryHandler;
    private readonly RateLimiter _rateLimiter;
    private readonly ILogger<InquiryController> _logger;

    public InquiryController(
        InquiryHandler inquiryHandler,
        RateLimiter rateLimiter,
        ILogger<InquiryController> logger)
    {
        _inquiryHandler = inquiryHandler;
        _rateLimiter = rateLimiter;
        _logger = logger;
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<ActionResult> PostInquiry(CreateInquiryDto inquiry)
    {
        _logger.LogInformation("Creating inquiry");

        var resourceId = User.Identity?.IsAuthenticated == true
            ? RateLimitedResourceId.InquiryAuthenticated
            : RateLimitedResourceId.InquiryAnonymous;
        if (_rateLimiter.AttemptAquire(resourceId) is LeaseAquisitionFailure)
        {
            _logger.LogWarning("Request rate limited");
            return StatusCode(StatusCodes.Status429TooManyRequests);
        }

        await _inquiryHandler.HandleInquiry(inquiry);

        return Ok();
    }
}
