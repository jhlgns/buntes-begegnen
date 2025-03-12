using BuntesBegegnen.Api.Localization;

namespace BuntesBegegnen.Api.Tests;

public class StringTests
{
    public static IEnumerable<object[]> DurationFormattingTestCases()
    {
        yield return [TimeSpan.FromDays(1), "1 Tag"];
        yield return [TimeSpan.FromDays(366), "366 Tage"];
        yield return [TimeSpan.FromHours(1), "1 Stunde"];
        yield return [TimeSpan.FromHours(3), "3 Stunden"];
        yield return [TimeSpan.FromMinutes(1), "1 Minute"];
        yield return [TimeSpan.FromMinutes(3), "3 Minuten"];
        yield return [TimeSpan.FromSeconds(1), "1 Sekunde"];
        yield return [TimeSpan.FromSeconds(3), "3 Sekunden"];
        yield return [new TimeSpan(1, 0, 0, 3), "1 Tag, 3 Sekunden"];
        yield return [new TimeSpan(3, 0, 5, 3), "3 Tage, 5 Minuten, 3 Sekunden"];
        yield return [new TimeSpan(1, 0, 3), "1 Stunde, 3 Sekunden"];
        yield return [new TimeSpan(3, 0, 3), "3 Stunden, 3 Sekunden"];
        yield return [new TimeSpan(14, 12, 30, 15), "14 Tage, 12 Stunden, 30 Minuten"];
    }

    [Theory]
    [MemberData(nameof(DurationFormattingTestCases))]
    public void DurationFormat(TimeSpan duration, string expected)
    {
        var formatted = Strings.Duration(duration);
        Assert.Equal(expected, formatted);
    }
}
