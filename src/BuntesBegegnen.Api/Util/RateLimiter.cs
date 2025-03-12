using System.Security.Claims;
using System.Threading.RateLimiting;
using Microsoft.Extensions.Options;
using ClaimTypes = BuntesBegegnen.Api.UserManagement.ClaimTypes;

namespace BuntesBegegnen.Api.Util;

public enum RateLimitedResourceId
{
    Global,
    Registration,
    EmailConfirmation,
    Login,
    InquiryAuthenticated,
    InquiryAnonymous,
    ActivityRegistration,
    RateLimitingTest,
}

public abstract record LeaseAquisitionResult;
public record LeaseAquisitionSuccess : LeaseAquisitionResult;
public record LeaseAquisitionFailure(TimeSpan RetryAfter) : LeaseAquisitionResult;

public class RateLimiter
{
    private record RateLimitingContext(HttpContext HttpContext, RateLimitedResourceId ResourceId);

    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ILogger<RateLimiter> _logger;
    private readonly PartitionedRateLimiter<RateLimitingContext> _partitionedRateLimiter;

    public RateLimiter(
        IHttpContextAccessor httpContextAccessor,
        IOptions<ApiOptions> options,
        ILogger<RateLimiter> logger)
    {
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
        _partitionedRateLimiter = CreatePartitionedRateLimiter(options.Value.RateLimits);
    }

    public LeaseAquisitionResult AttemptAquire(RateLimitedResourceId resourceId)
    {
        var httpContext = _httpContextAccessor.HttpContext
            ?? throw new InvalidOperationException("Could not access HTTP context");

        using var lease = _partitionedRateLimiter.AttemptAcquire(new RateLimitingContext(httpContext, resourceId));

        if (lease.IsAcquired == false)
        {
            _logger.LogWarning("Could not acquire lease for resource {ResourceId}", resourceId);

            if (lease.TryGetMetadata(MetadataName.RetryAfter, out var retryAfter) == false)
            {
                throw new InvalidOperationException("Could not get 'retry after' property");
            }

            return new LeaseAquisitionFailure(retryAfter);
        }

        return new LeaseAquisitionSuccess();
    }

    private PartitionedRateLimiter<RateLimitingContext> CreatePartitionedRateLimiter(RateLimitOptions[] options)
    {
        // TODO(jh): This code is far too complicated
        var tiersByResource = Enum.GetValues<RateLimitedResourceId>()
            .ToDictionary(
                x => x,
                x => options.Where(o => o.ResourceId == x).ToArray());

        var maxTiers = tiersByResource.Max(x => x.Value.Length);

        var tiers = Enumerable.Range(0, maxTiers)
            .Select(tier => PartitionedRateLimiter.Create<RateLimitingContext, string>(context => GetPartition(context, tier)))
            .ToArray();

        if (tiers.Length == 0)
        {
            _logger.LogWarning("No ratelimiters configured");

            tiers =
            [
                PartitionedRateLimiter.Create<RateLimitingContext, string>(context => RateLimitPartition.GetNoLimiter(""))
            ];
        }

        return PartitionedRateLimiter.CreateChained(tiers);

        RateLimitPartition<string> GetPartition(RateLimitingContext context, int tierNumber)
        {
            var resourceTiers = tiersByResource![context.ResourceId];
            if (tierNumber >= resourceTiers.Length)
            {
                return RateLimitPartition.GetNoLimiter("");
            }

            var tierOptions = resourceTiers[tierNumber];

            string key;
            var user = context.HttpContext.User;
            if (user.Identity?.IsAuthenticated == true)
            {
                _logger.LogInformation("Using user ID as partition key");
                key = user.FindFirstValue(ClaimTypes.UserId)
                    ?? throw new InvalidOperationException("User is authenticated but the name identifier claim was not found");
            }
            else
            {
                _logger.LogInformation("No user ID claim found, using remote IP address as the partition key");
                key = context.HttpContext.Connection.RemoteIpAddress?.ToString()  // TODO(jh): Check that the real remote IP address appears here (and not the proxy IP address)
                    ?? throw new InvalidOperationException("HttpContext connection does not have remote IP address");
            }

            var options = CreateOptions(tierOptions);
            return RateLimitPartition.GetTokenBucketLimiter(key, _ => options);
        }
    }

    // 5 / 10m  = 1 / 2m
    // 3 / 7m   = 1 / (7/3)m
    // 100 / 1s = 1 / 0.01s (NOTE: Many replenishments per second)
    private static TokenBucketRateLimiterOptions CreateOptions(RateLimitOptions options)
        => new()
        {
            AutoReplenishment = true,
            QueueLimit = 1,
            QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
            ReplenishmentPeriod = options.Period / options.PermitLimit,
            TokenLimit = options.PermitLimit,
            TokensPerPeriod = 1,
        };
}
