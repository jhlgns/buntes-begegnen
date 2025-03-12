using System.Net;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text.RegularExpressions;
using BuntesBegegnen.Api.Controllers;
using BuntesBegegnen.Api.Util;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Xunit.Abstractions;

namespace BuntesBegegnen.Api.Tests;

public partial class AppRateLimiterTests : IClassFixture<BundlorWebApplicationFactory>
{
    private readonly BundlorWebApplicationFactory _factory;
    private readonly ITestOutputHelper _out;

    public AppRateLimiterTests(BundlorWebApplicationFactory factory, ITestOutputHelper @out)
    {
        _factory = factory;
        _out = @out;

        _factory.OutputHelper = @out;
    }

    [Fact]
    public void PartitionKey()
    {
        var options = new RateLimitOptions[]
        {
            new()
            {
                // a) 2 per 4 seconds -> repelenishment every 2 seconds
                ResourceId = RateLimitedResourceId.InquiryAnonymous,
                Period = TimeSpan.FromSeconds(4),
                PermitLimit = 2,
            },
            new()
            {
                // a) 2 per 4 seconds -> repelnishment every 2 seconds
                ResourceId = RateLimitedResourceId.ActivityRegistration,
                Period = TimeSpan.FromSeconds(4),
                PermitLimit = 2,
            },
        };

        var httpContext = new DefaultHttpContext();

        var rateLimiter = new RateLimiter(
            Mock.Of<IHttpContextAccessor>(x => x.HttpContext == httpContext),
            Options.Create(new ApiOptions() { RateLimits = options }),
            new TestLogger<RateLimiter>(_out));

        LeaseAquisitionResult result;

        //
        // 1) Alice: both resources should not affect each other because they have different partition keys
        //

        httpContext.User = new ClaimsPrincipal(
            new ClaimsIdentity([new Claim(UserManagement.ClaimTypes.UserId, "alice")]));
        httpContext.Connection.RemoteIpAddress = IPAddress.Parse("111.111.111.111");

        for (var i = 0; i < 2; ++i)
        {
            result = rateLimiter.AttemptAquire(RateLimitedResourceId.InquiryAnonymous);
            Assert.IsType<LeaseAquisitionSuccess>(result);
            result = rateLimiter.AttemptAquire(RateLimitedResourceId.ActivityRegistration);
            Assert.IsType<LeaseAquisitionSuccess>(result);
        }

        var limitedResult = rateLimiter.AttemptAquire(RateLimitedResourceId.InquiryAnonymous);
        Assert.IsType<LeaseAquisitionFailure>(limitedResult);
        limitedResult = rateLimiter.AttemptAquire(RateLimitedResourceId.ActivityRegistration);
        Assert.IsType<LeaseAquisitionFailure>(limitedResult);

        //
        // 2) Bob: should not be affected by the rate limiting of alice
        //

        httpContext.User = new ClaimsPrincipal(
            new ClaimsIdentity([new Claim(UserManagement.ClaimTypes.UserId, "bob")]));
        httpContext.Connection.RemoteIpAddress = IPAddress.Parse("222.222.222.222");

        for (var i = 0; i < 2; ++i)
        {
            result = rateLimiter.AttemptAquire(RateLimitedResourceId.InquiryAnonymous);
            Assert.IsType<LeaseAquisitionSuccess>(result);
        }

        limitedResult = rateLimiter.AttemptAquire(RateLimitedResourceId.InquiryAnonymous);
        Assert.IsType<LeaseAquisitionFailure>(limitedResult);

        //
        // 3) Anonymous: IP-based rate limiting works, but if the user ID is requested as the partition key,
        // an exception should be thrown
        //

        httpContext.User = new ClaimsPrincipal();
        httpContext.Connection.RemoteIpAddress = IPAddress.Parse("123.123.123.123");

        for (var i = 0; i < 2; ++i)
        {
            result = rateLimiter.AttemptAquire(RateLimitedResourceId.InquiryAnonymous);
            Assert.IsType<LeaseAquisitionSuccess>(result);
        }

        limitedResult = rateLimiter.AttemptAquire(RateLimitedResourceId.InquiryAnonymous);
        Assert.IsType<LeaseAquisitionFailure>(limitedResult);

        Assert.ThrowsAny<Exception>(() =>
            rateLimiter.AttemptAquire(RateLimitedResourceId.ActivityRegistration));
    }

    [Fact]
    public async Task MultiTier()
    {
        var options = new RateLimitOptions[]
        {
            new()
            {
                // a) 2 pro 4 Sekunden -> Replenishment alle 2 Sekunden
                ResourceId = RateLimitedResourceId.InquiryAnonymous,
                Period = TimeSpan.FromSeconds(4),
                PermitLimit = 2,
            },
            new()
            {
                // b) 3 pro 27 Sekunden -> Replenishment alle 9 Sekunden
                ResourceId = RateLimitedResourceId.InquiryAnonymous,
                Period = TimeSpan.FromSeconds(27),
                PermitLimit = 3,
            },
            new()
            {
                // Noise
                ResourceId = RateLimitedResourceId.Global,
                Period = TimeSpan.FromSeconds(5),
                PermitLimit = 1,
            },
        };

        var httpContext = new DefaultHttpContext();
        httpContext.Connection.RemoteIpAddress = IPAddress.Loopback;

        var rateLimiter = new RateLimiter(
            Mock.Of<IHttpContextAccessor>(x => x.HttpContext == httpContext),
            Options.Create(new ApiOptions() { RateLimits = options }),
            new TestLogger<RateLimiter>(_out));

        LeaseAquisitionResult result;

        // a) greift nach 2 Versuchen
        for (var i = 0; i < 2; ++i)
        {
            result = rateLimiter.AttemptAquire(RateLimitedResourceId.InquiryAnonymous);
            Assert.IsType<LeaseAquisitionSuccess>(result);
        }

        var limitedResult = rateLimiter.AttemptAquire(RateLimitedResourceId.InquiryAnonymous);
        Assert.IsType<LeaseAquisitionFailure>(limitedResult);

        // Auf Replenishment von a) warten
        await Task.Delay(TimeSpan.FromSeconds(2.1));

        // a) hat jetzt wieder einen frei, bei b) sind noch 2 von 3 verfügbar
        result = rateLimiter.AttemptAquire(RateLimitedResourceId.InquiryAnonymous);
        Assert.IsType<LeaseAquisitionSuccess>(result);

        // Wieder auf Replenishment von a) warten - b) ist jetzt leer
        await Task.Delay(TimeSpan.FromSeconds(2.1));

        limitedResult = rateLimiter.AttemptAquire(RateLimitedResourceId.InquiryAnonymous);
        Assert.IsType<LeaseAquisitionFailure>(limitedResult);
    }

#if false
    // TODO: Ich bin mir noch noch nicht sicher, ob wirklich alle PageModels auf das
    // Ratelimiting getestet werden sollten...

    [Fact]
    public async Task Registration()
    {
        const string rateLimitedRegex = "Bitte warte.*2 Minuten";

        var client = _factory.CreateClient();

        for (var i = 0; i < 5; ++i)
        {
            var (statusCode, content) = await AttemptRegistration(client);
            Assert.Equal(HttpStatusCode.OK, statusCode);
            Assert.DoesNotMatch(rateLimitedRegex, content);
        }

        var (limitedStatusCode, limitedContent) = await AttemptRegistration(client);
        Assert.Equal(HttpStatusCode.OK, limitedStatusCode);
        Assert.Matches(rateLimitedRegex, limitedContent);
    }

    [Fact]
    public async Task Login()
    {
        var rateLimitedRegex = RateLimitedRegex();

        var client = _factory.CreateClient();

        for (var i = 0; i < ; ++i)
        {
            var (statusCode, content) = await AttemptRegistration(client);
            Assert.Equal(HttpStatusCode.OK, statusCode);
            Assert.DoesNotMatch(rateLimitedRegex, content);
        }

        var (limitedStatusCode, limitedContent) = await AttemptRegistration(client);
        Assert.Equal(HttpStatusCode.OK, limitedStatusCode);
        Assert.Matches(rateLimitedRegex, limitedContent);
    }
#endif

    // TODO Login etc.

    private static async Task<(HttpStatusCode statusCode, string content)> AttemptRegistration(
        HttpClient client)
    {
        using var response = await client.PostAsync("/account/registrierung", JsonContent.Create(new RegistrationRequestDto
        {
            Account = new(),
            Password = "",
            PreviewModePassword = "",
        }));

        var responseContent = await response.Content.ReadAsStringAsync();

        return (response.StatusCode, responseContent);
    }

    /*
        private static async Task<(HttpStatusCode statusCode, string content)> AttemptLogin(
            HttpClient client)
        {

            var keyValuePairs = ToKeyValuePairs("Registration", registration)
                .Concat(ToKeyValuePairs("Account", account));

            using var content = new FormUrlEncodedContent(keyValuePairs);
            using var response = await client.PostAsync("/registrierung", content);
            var responseContent = await response.Content.ReadAsStringAsync();

            return (response.StatusCode, responseContent);
        }
    */

    private static IEnumerable<KeyValuePair<string, string>> ToKeyValuePairs<T>(string prefix, T value)
    {
        return typeof(T).GetProperties().Select(x =>
            new KeyValuePair<string, string>($"{prefix}.{x.Name}", x.GetValue(value)?.ToString() ?? "null"));
    }

    [GeneratedRegex(@"Bitte warte \d+ Minuten")]
    private static partial Regex RateLimitedRegex();
}
