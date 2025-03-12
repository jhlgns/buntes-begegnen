namespace BuntesBegegnen.Api.Util;

public static class DateUtils
{
    // Stupid american shit
    public static int ToDayOfWeekIndex(DayOfWeek day)
        => ((int)day + 6) % 7;

    public static DayOfWeek DayOfWeekFromEurpeanDayOfWeekIndex(int index)
        => (DayOfWeek)((index + 1) % 7);

    // NOTE: Ordinal starts with 1, meaning (1, Friday) is the first Friday in the month
    // -1 means the last one -- TODO: test
    public static DateOnly? GetNthDayOfWeek(int year, int month, int ordinal, DayOfWeek dayOfWeek)
    {
        if (month is < 1 or > 12)
        {
            throw new ArgumentOutOfRangeException(nameof(month));
        }

        if (ordinal is (< 1 or > 5) and not -1)
        {
            throw new ArgumentOutOfRangeException(nameof(ordinal));
        }

        var daysInMonth = DateTime.DaysInMonth(year, month);

        if (ordinal == -1)
        {
            var lastDayOfWeek = new DateTime(year, month, daysInMonth).DayOfWeek;

            // How many days to go backward from the last day of month until we reach the previous requested day of week
            var daysUntilLastRequestedDayOfWeek =
                (ToDayOfWeekIndex(lastDayOfWeek) - ToDayOfWeekIndex(dayOfWeek) + 7) % 7;

            return new DateOnly(year, month, daysInMonth - daysUntilLastRequestedDayOfWeek);
        }
        else
        {
            var firstDayOfWeek = new DateTime(year, month, 1).DayOfWeek;

            // How many days to go forward from the first day of month until we reach the next requested day of week
            var daysUntilFirstRequestedDayOfWeek =
                (ToDayOfWeekIndex(dayOfWeek) - ToDayOfWeekIndex(firstDayOfWeek) + 7) % 7;

            var resultDay = 1 + daysUntilFirstRequestedDayOfWeek + (ordinal - 1) * 7;
            if (resultDay > daysInMonth)
            {
                // This month does not have a weekday with this ordinal
                return null;
            }

            return new DateOnly(year, month, resultDay);
        }

    }

    public static (DateTimeOffset monthStart, DateTimeOffset monthEnd) GetMonthRange(int year, int month)
    {
        var monthStart = new DateTimeOffset(year, month, 1, 0, 0, 0, 0, TimeSpan.Zero);
        var monthEnd = new DateTimeOffset(year, month, DateTime.DaysInMonth(year, month), 23, 59, 59, 999, TimeSpan.Zero);

        return (monthStart, monthEnd);
    }

    public static DateTimeOffset With(
        this DateTimeOffset value,
        int? year = null,
        int? month = null,
        int? day = null,
        int? hour = null,
        int? minute = null,
        int? second = null,
        int? millisecond = null,
        TimeSpan? offset = null)
        => new DateTimeOffset(
            year ?? value.Year,
            month ?? value.Month,
            day ?? value.Day,
            hour ?? value.Hour,
            minute ?? value.Minute,
            second ?? value.Second,
            millisecond ?? value.Millisecond,
            offset ?? value.Offset);

    public static DateTimeOffset WithDate(
        this DateTimeOffset value,
        DateOnly date)
        => value.With(year: date.Year, month: date.Month, day: date.Day);
}
