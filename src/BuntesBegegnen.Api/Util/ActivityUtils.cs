using BuntesBegegnen.Api.Data.Entities;

namespace BuntesBegegnen.Api.Util;

// NOTE: Python implementation of RRULE: https://github.com/dateutil/dateutil/blob/0353b78b2d620816e8c37fa9025fc3862671303a/src/dateutil/rrule.py#L305

// TODO: There are many places that can be made more efficient

public static class ActivityUtils
{
    // NOTE: Maybe it would be better to just pass the date in the callback
    public static void Explode(ActivityDto activity, Action<ActivityDto, DateTimeOffset> createInstance)
    {
        if (activity.RecurrenceFrequency is not (ActivityRecurrenceFrequency.None or ActivityRecurrenceFrequency.FixedDates) &&
            activity.RepeatCount == null && activity.RepeatUntil == null)
        {
            throw new InvalidOperationException();
        }

        var instanceCount = 0;
        var done = false;
        void Emit(DateTimeOffset startTime)
        {
            if (DateOnly.FromDateTime(startTime.Date) > activity.RepeatUntil || instanceCount >= activity.RepeatCount)
            {
                done = true;
                return;
            }

            if (activity.RecurrenceExceptions.Contains(startTime))
            {
                return;
            }

            createInstance(activity, startTime);
            ++instanceCount;

            done = instanceCount >= activity.RepeatCount;
        }

        // The original start/end is always part of the series
        Emit(activity.StartTime);

        switch (activity.RecurrenceFrequency)
        {
            case ActivityRecurrenceFrequency.None:
                {
                    return;
                }

            case ActivityRecurrenceFrequency.Weekly:
                {
                    var cursor = activity.StartTime;
                    var dayOfWeekIndex = DateUtils.ToDayOfWeekIndex(activity.StartTime.DayOfWeek);

                    if (activity.RecurrenceByDay.Count > 0)
                    {
                        // When generating by week day, move the cursor to the beginning of the week
                        cursor = cursor.Subtract(TimeSpan.FromDays(dayOfWeekIndex));
                    }

                    while (done == false)
                    {
                        cursor = cursor.AddDays((activity.RecurrenceInterval ?? 1) * 7);

                        if (activity.RecurrenceByDay.Count > 0)
                        {
                            for (var i = 0; i < 7; ++i)
                            {
                                var dayOfWeek = DateUtils.DayOfWeekFromEurpeanDayOfWeekIndex(i);
                                if (activity.RecurrenceByDay.Contains(new ActivityRecurrenceByDayDto { Ordinal = 0, DayOfWeek = dayOfWeek }))
                                {
                                    var startTime = activity.StartTime.With(
                                        year: cursor.Year,
                                        month: cursor.Month,
                                        day: cursor.Day)
                                        .AddDays(i);
                                    if (startTime > activity.StartTime)
                                    {
                                        Emit(startTime);
                                    }
                                }
                            }
                        }
                        else
                        {
                            Emit(cursor);
                        }
                    }
                }
                break;

            case ActivityRecurrenceFrequency.Monthly:
                {
                    var (year, month) = (activity.StartTime.Year, activity.StartTime.Month);
                    void Next()
                    {
                        // TODO: Do this more efficiently
                        for (var i = 0; i < (activity.RecurrenceInterval ?? 1); ++i)
                        {
                            ++month;
                            if (month > 12)
                            {
                                month = 1;
                                ++year;
                            }
                        }
                    }

                    for (; done == false; Next())  // Run Next() only at the end of each iteration because the first month might contain relevant days as well
                    {
                        if (activity.RecurrenceByDay.Count > 0)
                        {
                            // TODO: Quick and dirty, this can be done much more efficently probably than looping over all days of the month (n * m)
                            for (var day = 1; day < DateTime.DaysInMonth(year, month); ++day)
                            {
                                var isWanted = activity.RecurrenceByDay.Any(x =>
                                    DateUtils.GetNthDayOfWeek(
                                        year,
                                        month,
                                        x.Ordinal,
                                        x.DayOfWeek)?.Day == day);
                                if (isWanted == false)
                                {
                                    continue;
                                }

                                var startTime = activity.StartTime.With(
                                    year: year,
                                    month: month,
                                    day: day);
                                if (startTime > activity.StartTime)
                                {
                                    Emit(startTime);
                                }
                            }
                        }
                        else if (activity.RecurrenceByMonthDay.Count > 0)
                        {
                            foreach (var monthDay in activity.RecurrenceByMonthDay.Order())
                            {
                                if (monthDay > DateTime.DaysInMonth(year, month))
                                {
                                    continue;
                                }

                                var startTime = activity.StartTime.With(
                                    year: year,
                                    month: month,
                                    day: monthDay);
                                if (startTime > activity.StartTime)
                                {
                                    Emit(startTime);
                                }
                            }
                        }
                        else
                        {
                            var startTime = activity.StartTime.With(
                                year: year,
                                month: month,
                                day: activity.StartTime.Day);
                            if (startTime > activity.StartTime)
                            {
                                Emit(startTime);
                            }
                        }
                    }
                }
                break;

            case ActivityRecurrenceFrequency.FixedDates:
                {
                    foreach (var date in activity.RecurrenceDates.Order())
                    {
                        Emit(date);
                    }
                }
                break;

            default:
                throw new InvalidOperationException($"Invalid {nameof(ActivityRecurrenceFrequency)}");
        }
    }
}
