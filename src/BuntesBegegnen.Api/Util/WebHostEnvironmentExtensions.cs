namespace BuntesBegegnen.Api.Util;

public static class WebHostEnvironmentExtensions
{
    public static bool IsLocal(this IWebHostEnvironment environment)
        => environment.IsEnvironment("Local");
}
