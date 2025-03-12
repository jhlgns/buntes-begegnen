using System.Text;
using Microsoft.Extensions.Logging;
using Xunit.Abstractions;

namespace BuntesBegegnen.Api.Tests.Shared;

public class TestLogger : ILogger
{
    private readonly ITestOutputHelper? _outputHelper;
    private readonly string _categoryName;
    private readonly LoggerExternalScopeProvider? _scopeProvider;

    public TestLogger(
        ITestOutputHelper? outputHelper = null,
        string? categoryName = null,
        LoggerExternalScopeProvider? scopeProvider = null)
    {
        _outputHelper = outputHelper;
        _categoryName = categoryName ?? "(test)";
        _scopeProvider = scopeProvider;
    }

    public IDisposable? BeginScope<TState>(TState state) where TState : notnull
    {
        return null;
    }

    public bool IsEnabled(LogLevel logLevel) => true;

    public void Log<TState>(
        LogLevel logLevel,
        EventId eventId,
        TState state,
        Exception? exception,
        Func<TState, Exception?, string> formatter)
    {
        if (_outputHelper == null)
        {
            return;
        }

        var level = logLevel switch
        {
            LogLevel.Trace => "trce",
            LogLevel.Debug => "dbug",
            LogLevel.Information => "info",
            LogLevel.Warning => "warn",
            LogLevel.Error => "fail",
            LogLevel.Critical => "crit",
            _ => throw new ArgumentOutOfRangeException(nameof(logLevel))
        };

        var sb = new StringBuilder();
        sb.Append(level)
            .Append(" [").Append(_categoryName).Append("] ")
            .Append(formatter(state, exception));

        if (exception != null)
        {
            sb.Append('\n').Append(exception);
        }

        _scopeProvider?.ForEachScope(
            (scope, state) =>
            {
                state.Append("\n => ");
                state.Append(scope);
            },
            sb);

        try
        {
            _outputHelper.WriteLine(sb.ToString());
        }
        catch { }
    }
}

public class TestLogger<T> : TestLogger, ILogger<T>
{
    public TestLogger(
        ITestOutputHelper? outputHelper = null,
        string? categoryName = null,
        LoggerExternalScopeProvider? scopeProvider = null)
        : base(outputHelper, categoryName, scopeProvider)
    {
    }
}
