using BuntesBegegnen.Api.Util;

namespace BuntesBegegnen.Api.Tests.Util;

public class DateUtilsTests
{
    [Theory]
    [InlineData(DayOfWeek.Monday, 0)]
    [InlineData(DayOfWeek.Tuesday, 1)]
    [InlineData(DayOfWeek.Wednesday, 2)]
    [InlineData(DayOfWeek.Thursday, 3)]
    [InlineData(DayOfWeek.Friday, 4)]
    [InlineData(DayOfWeek.Saturday, 5)]
    [InlineData(DayOfWeek.Sunday, 6)]
    public void ToDayOfWeekIndex(DayOfWeek dayOfWeek, int expected)
    {
        Assert.Equal(expected, DateUtils.ToDayOfWeekIndex(dayOfWeek));
    }

    [Theory]
    [InlineData(0, DayOfWeek.Monday)]
    [InlineData(1, DayOfWeek.Tuesday)]
    [InlineData(2, DayOfWeek.Wednesday)]
    [InlineData(3, DayOfWeek.Thursday)]
    [InlineData(4, DayOfWeek.Friday)]
    [InlineData(5, DayOfWeek.Saturday)]
    [InlineData(6, DayOfWeek.Sunday)]
    public void DayOfWeekFromEuropeanDayOfWeekIndex(int index, DayOfWeek expected)
    {
        Assert.Equal(expected, DateUtils.DayOfWeekFromEurpeanDayOfWeekIndex(index));
    }

    [Fact]
    public void GetNthDayOfWeek()
    {
        var data = ((int year, int month, int ordinal, DayOfWeek dayOfWeek, DateOnly? expectedNthDayOfWeekInMonth)[])
        [
            // July 2024 starts with Monday and has 5 of them
            (2024, 7, 1, DayOfWeek.Monday, new DateOnly(2024, 7, 1)),
            (2024, 7, 2, DayOfWeek.Monday, new DateOnly(2024, 7, 8)),
            (2024, 7, 3, DayOfWeek.Monday, new DateOnly(2024, 7, 15)),
            (2024, 7, 4, DayOfWeek.Monday, new DateOnly(2024, 7, 22)),
            (2024, 7, 5, DayOfWeek.Monday, new DateOnly(2024, 7, 29)),
            (2024, 7, -1, DayOfWeek.Monday, new DateOnly(2024, 7, 29)),
            // NOTE: Does not allow to call with ordinal == 6

            // October 2024 starts with Tuesday has 4 Mondays
            (2024, 10, 1, DayOfWeek.Monday, new DateOnly(2024, 10, 7)),
            (2024, 10, 2, DayOfWeek.Monday, new DateOnly(2024, 10, 14)),
            (2024, 10, 3, DayOfWeek.Monday, new DateOnly(2024, 10, 21)),
            (2024, 10, 4, DayOfWeek.Monday, new DateOnly(2024, 10, 28)),
            (2024, 10, -1, DayOfWeek.Monday, new DateOnly(2024, 10, 28)),
            (2024, 10, 5, DayOfWeek.Monday, null),

            // November 2024 starts with Friday has 4 Sundays
            (2024, 11, 1, DayOfWeek.Sunday, new DateOnly(2024, 11, 3)),
            (2024, 11, 2, DayOfWeek.Sunday, new DateOnly(2024, 11, 10)),
            (2024, 11, 3, DayOfWeek.Sunday, new DateOnly(2024, 11, 17)),
            (2024, 11, 4, DayOfWeek.Sunday, new DateOnly(2024, 11, 24)),
            (2024, 11, -1, DayOfWeek.Sunday, new DateOnly(2024, 11, 24)),
            (2024, 11, 5, DayOfWeek.Sunday, null),

            // February 2025 starts with Friday has 4 Sundays
            (2025, 2, 1, DayOfWeek.Thursday, new DateOnly(2025, 2, 6)),
            (2025, 2, 2, DayOfWeek.Thursday, new DateOnly(2025, 2, 13)),
            (2025, 2, 3, DayOfWeek.Thursday, new DateOnly(2025, 2, 20)),
            (2025, 2, 4, DayOfWeek.Thursday, new DateOnly(2025, 2, 27)),
            (2025, 2, -1, DayOfWeek.Thursday, new DateOnly(2025, 2, 27)),
            (2025, 2, -1, DayOfWeek.Saturday, new DateOnly(2025, 2, 22)),
            (2025, 2, 5, DayOfWeek.Thursday, null),
        ];

        foreach (var (year, month, ordinal, dayOfWeek, expectedNthDayOfWeekInMonth) in data)
        {
            Assert.Equal(expectedNthDayOfWeekInMonth, DateUtils.GetNthDayOfWeek(year, month, ordinal, dayOfWeek));
        }
    }
}
