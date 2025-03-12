using BuntesBegegnen.Api.UserManagement;

namespace BuntesBegegnen.Api.Util;

public class LoggingScopeMiddleware
{
    private readonly RequestDelegate _next;

    public LoggingScopeMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context, ILogger<LoggingScopeMiddleware> logger)
    {
        var userId = context.User.TryFindUserId()?.ToString() ?? "anonymous";

        using (logger.BeginScope("UserId:{UserId}", userId))
        {
            await _next(context);
        }
    }
}
