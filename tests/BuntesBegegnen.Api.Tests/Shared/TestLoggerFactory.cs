using Microsoft.Extensions.Logging;
using Xunit.Abstractions;

namespace BuntesBegegnen.Api.Tests.Shared;

public class TestLoggerFactory : ILoggerFactory
{
    private readonly ITestOutputHelper _out;

    public TestLoggerFactory(ITestOutputHelper @out)
    {
        _out = @out;
    }

    public void AddProvider(ILoggerProvider provider)
    {
    }

    public ILogger CreateLogger(string categoryName)
    {
        return new TestLogger(_out, categoryName);
    }

    public void Dispose()
    {
        GC.SuppressFinalize(this);
    }
}
