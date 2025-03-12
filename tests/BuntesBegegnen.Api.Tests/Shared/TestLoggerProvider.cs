using Microsoft.Extensions.Logging;
using Xunit.Abstractions;

namespace BuntesBegegnen.Api.Tests.Shared;

public class TestLoggerProvider : ILoggerProvider
{
    private readonly Func<ITestOutputHelper> _outputHelperProvider;

    public TestLoggerProvider(Func<ITestOutputHelper> outputHelperProvider)
    {
        _outputHelperProvider = outputHelperProvider;
    }

    private readonly LoggerExternalScopeProvider _scopeProvider = new();

    public ILogger CreateLogger(string categoryName)
    {
        return new TestLogger(_outputHelperProvider(), categoryName, _scopeProvider);
    }

    public void Dispose()
    {
    }
}
