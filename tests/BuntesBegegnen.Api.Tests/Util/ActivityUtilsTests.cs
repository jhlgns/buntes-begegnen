using System.Diagnostics;
using System.Linq;
using AutoMapper;
using BuntesBegegnen.Api.Data.Entities;
using BuntesBegegnen.Api.Util;

namespace BuntesBegegnen.Api.Tests.Util;

// TODO:
// * Test with 1 and with 48 months
// * Test multi-day and all day activities
// * Test without by day and by month day

public class ActivityUtilsTests
{
    private static void AssertSequence(
        DateTimeOffset startTime,
        DateTimeOffset endTime,
        ActivityRecurrenceFrequency frequency,
        int interval,
        HashSet<DateTimeOffset>? dates,
        HashSet<ActivityRecurrenceByDayDto>? byDay,
        HashSet<int>? byMonthDay,
        HashSet<DateTimeOffset>? exceptions,
        DateOnly? until,
        int? count,
        DateOnly[] expectedDates)
    {
        var activity = new ActivityDto()
        {
            Id = 1,
            CreatedAt = DateTimeOffset.UtcNow,
            CreatedById = "Me",
            StartTime = startTime,
            EndTime = endTime,
            IsAllDay = false,
            RecurrenceFrequency = frequency,
            RecurrenceInterval = interval,
            RecurrenceDates = dates ?? [],
            RecurrenceByDay = byDay ?? [],
            RecurrenceByMonthDay = byMonthDay ?? [],
            RecurrenceExceptions = exceptions ?? [],
            RepeatUntil = until,
            RepeatCount = count,
        };

        var instances = new List<ActivityDto>();
        ActivityUtils.Explode(activity, (activity, startTime) =>
        {
            var instance = activity with
            {
                IsInstance = true,
                StartTime = startTime,
                EndTime = startTime + (activity.EndTime - activity.StartTime),
            };
            instances.Add(instance);
        });
        instances = instances.OrderBy(x => x.StartTime).ToList();

        void AssertInstanceStartTime(DateOnly date, ActivityDto instance)
        {
            Assert.Equal(
                new DateTimeOffset(
                    date.Year,
                    date.Month,
                    date.Day,
                    activity.StartTime.Hour,
                    activity.StartTime.Minute,
                    activity.StartTime.Second,
                    activity.StartTime.Millisecond,
                    TimeSpan.Zero),
                instance.StartTime);
        }

        Assert.Collection(
            instances,
            expectedDates
                .Select<DateOnly, Action<ActivityDto>>(date =>
                    instance => AssertInstanceStartTime(date, instance))
                .ToArray());
    }

    [Fact]
    public void Explode_Weekly_Interval1_NoList_RepeatUntil()
    {
        AssertSequence(
            startTime: new DateTimeOffset(2024, 7, 5, 12, 0, 0, 0, TimeSpan.Zero),
            endTime: new DateTimeOffset(2024, 8, 6, 23, 59, 59, 999, TimeSpan.Zero),
            frequency: ActivityRecurrenceFrequency.Weekly,
            interval: 1,
            dates: null,
            byDay: null,
            byMonthDay: null,
            exceptions: null,
            until: new DateOnly(2024, 10, 7),
            count: null,
            expectedDates:
            [
                new DateOnly(2024, 7, 5),
                new DateOnly(2024, 7, 12),
                new DateOnly(2024, 7, 19),
                new DateOnly(2024, 7, 26),
                new DateOnly(2024, 8, 2),
                new DateOnly(2024, 8, 9),
                new DateOnly(2024, 8, 16),
                new DateOnly(2024, 8, 23),
                new DateOnly(2024, 8, 30),
                new DateOnly(2024, 9, 6),
                new DateOnly(2024, 9, 13),
                new DateOnly(2024, 9, 20),
                new DateOnly(2024, 9, 27),
                new DateOnly(2024, 10, 4),
            ]);
    }

    [Fact]
    public void Explode_Weekly_Interval3_ByWeekDay_RepeatCount()
    {
        AssertSequence(
            startTime: new DateTimeOffset(2024, 12, 6, 12, 0, 0, 0, TimeSpan.Zero),
            endTime: new DateTimeOffset(2024, 12, 6, 23, 59, 59, 999, TimeSpan.Zero),
            frequency: ActivityRecurrenceFrequency.Weekly,
            interval: 3,
            dates: null,
            byDay:
            [
                new() { Ordinal = 0, DayOfWeek = DayOfWeek.Monday, },
                new() { Ordinal = 0, DayOfWeek = DayOfWeek.Sunday, },
            ],
            byMonthDay: null,
            exceptions: null,
            until: null,
            count: 5,
            expectedDates:
            [
                new DateOnly(2024, 12, 6),
                new DateOnly(2024, 12, 23),
                new DateOnly(2024, 12, 29),
                new DateOnly(2025, 1, 13),
                new DateOnly(2025, 1, 19),
            ]);
    }

    [Fact]
    public void Explode_Monthly_Interval3_NoList_RepeatUntil()
    {
        AssertSequence(
            startTime: new DateTimeOffset(2024, 8, 6, 12, 0, 0, 0, TimeSpan.Zero),
            endTime: new DateTimeOffset(2024, 8, 6, 23, 59, 59, 999, TimeSpan.Zero),
            frequency: ActivityRecurrenceFrequency.Monthly,
            interval: 3,
            dates: null,
            byDay: null,
            byMonthDay: null,
            exceptions: null,
            until: new DateOnly(2025, 8, 5),
            count: null,
            expectedDates:
            [
                new DateOnly(2024, 8, 6),
                new DateOnly(2024, 11, 6),
                new DateOnly(2025, 2, 6),
                new DateOnly(2025, 5, 6),
            ]);
    }

    [Fact]
    public void Explode_Monthly_Interval1_NoList_RepeatUntil()
    {
        AssertSequence(
            startTime: new DateTimeOffset(2024, 8, 6, 12, 0, 0, 0, TimeSpan.Zero),
            endTime: new DateTimeOffset(2024, 8, 6, 23, 59, 59, 999, TimeSpan.Zero),
            frequency: ActivityRecurrenceFrequency.Monthly,
            interval: 1,
            dates: null,
            byDay: null,
            byMonthDay: null,
            exceptions: null,
            until: new DateOnly(2025, 8, 5),
            count: null,
            expectedDates:
            [
                new DateOnly(2024, 8, 6),
                new DateOnly(2024, 9, 6),
                new DateOnly(2024, 10, 6),
                new DateOnly(2024, 11, 6),
                new DateOnly(2024, 12, 6),
                new DateOnly(2025, 1, 6),
                new DateOnly(2025, 2, 6),
                new DateOnly(2025, 3, 6),
                new DateOnly(2025, 4, 6),
                new DateOnly(2025, 5, 6),
                new DateOnly(2025, 6, 6),
                new DateOnly(2025, 7, 6),
            ]);
    }

    [Fact]
    public void Explode_Monthly_Interval3_ByDay_RepeatUntil()
    {
        AssertSequence(
            startTime: new DateTimeOffset(2024, 8, 6, 12, 0, 0, 0, TimeSpan.Zero),
            endTime: new DateTimeOffset(2024, 8, 6, 23, 59, 59, 999, TimeSpan.Zero),
            frequency: ActivityRecurrenceFrequency.Monthly,
            interval: 3,
            dates: null,
            byDay:
            [
                // Every third Wednesday
                new ActivityRecurrenceByDayDto() { Ordinal = 3, DayOfWeek = DayOfWeek.Wednesday },
                // Every first Saturday
                new ActivityRecurrenceByDayDto() { Ordinal = 1, DayOfWeek = DayOfWeek.Saturday },
            ],
            byMonthDay: null,
            exceptions: null,
            until: new DateOnly(2025, 8, 5),
            count: null,
            expectedDates:
            [
                new DateOnly(2024, 8, 6),  // Activity start time
                new DateOnly(2024, 8, 21),  // 3rd Wednesday
                new DateOnly(2024, 11, 2),  // 1st Saturday
                new DateOnly(2024, 11, 20),  // 3rd Wednesday
                new DateOnly(2025, 2, 1),  // 1st Saturday
                new DateOnly(2025, 2, 19),  // 3rd Wednesday
                new DateOnly(2025, 5, 3),  // 1st Saturday
                new DateOnly(2025, 5, 21),  // 3rd Wednesday
                new DateOnly(2025, 8, 2)  // 1st Saturday
            ]);
    }

    [Fact]
    public void Explode_Monthly_Interval48_ByDay_RepeatUntil()
    {
        AssertSequence(
            startTime: new DateTimeOffset(2024, 8, 6, 12, 0, 0, 0, TimeSpan.Zero),
            endTime: new DateTimeOffset(2024, 8, 6, 23, 59, 59, 999, TimeSpan.Zero),
            frequency: ActivityRecurrenceFrequency.Monthly,
            interval: 48,
            dates: null,
            byDay:
            [
                // Every third Wednesday
                new ActivityRecurrenceByDayDto() { Ordinal = 3, DayOfWeek = DayOfWeek.Wednesday },
                // Every first Saturday
                new ActivityRecurrenceByDayDto() { Ordinal = 1, DayOfWeek = DayOfWeek.Saturday },
            ],
            byMonthDay: null,
            exceptions: null,
            until: null,
            count: 6,
            expectedDates:
            [
                new DateOnly(2024, 8, 6),
                new DateOnly(2024, 8, 21),
                new DateOnly(2028, 8, 5),
                new DateOnly(2028, 8, 16),
                new DateOnly(2032, 8, 7),
                new DateOnly(2032, 8, 18),
            ]);
    }

    [Fact]
    public void Explode_Monthly_Interval3_ByDay_RepeatCount()
    {
        AssertSequence(
            startTime: new DateTimeOffset(2024, 8, 6, 12, 0, 0, 0, TimeSpan.Zero),
            endTime: new DateTimeOffset(2024, 8, 6, 23, 59, 59, 999, TimeSpan.Zero),
            frequency: ActivityRecurrenceFrequency.Monthly,
            interval: 3,
            dates: null,
            byDay:
            [
                // Every third Wednesday
                new ActivityRecurrenceByDayDto() { Ordinal = 3, DayOfWeek = DayOfWeek.Wednesday },
                // Every first Saturday
                new ActivityRecurrenceByDayDto() { Ordinal = 1, DayOfWeek = DayOfWeek.Saturday },
            ],
            byMonthDay: null,
            exceptions: null,
            until: null,
            count: 5,
            expectedDates:
            [
                new DateOnly(2024, 8, 6),  // Activity start time
                new DateOnly(2024, 8, 21),  // 3rd Wednesday
                new DateOnly(2024, 11, 2),  // 1st Saturday
                new DateOnly(2024, 11, 20),  // 3rd Wednesday
                new DateOnly(2025, 2, 1),  // 1st Saturday
            ]);
    }

    [Fact]
    public void Explode_Monthly_Interval3_ByMonthDay_RepeatUntil()
    {
        AssertSequence(
            startTime: new DateTimeOffset(2024, 8, 6, 12, 0, 0, 0, TimeSpan.Zero),
            endTime: new DateTimeOffset(2024, 8, 6, 23, 59, 59, 999, TimeSpan.Zero),
            frequency: ActivityRecurrenceFrequency.Monthly,
            interval: 3,
            dates: null,
            byDay: null,
            byMonthDay: [1, 29, 31],
            exceptions: null,
            until: new DateOnly(2025, 8, 5),
            count: null,
            expectedDates:
            [
                new DateOnly(2024, 8, 6),
                new DateOnly(2024, 8, 29),
                new DateOnly(2024, 8, 31),
                new DateOnly(2024, 11, 1),
                new DateOnly(2024, 11, 29),
                new DateOnly(2025, 2, 1),
                new DateOnly(2025, 5, 1),
                new DateOnly(2025, 5, 29),
                new DateOnly(2025, 5, 31),
                new DateOnly(2025, 8, 1),
            ]);
    }

    [Fact]
    public void Explode_Monthly_Interval3_ByMonthDay_RepeatUntil_WithExceptions()
    {
        AssertSequence(
            startTime: new DateTimeOffset(2024, 8, 6, 12, 0, 0, 0, TimeSpan.Zero),
            endTime: new DateTimeOffset(2024, 8, 6, 23, 59, 59, 999, TimeSpan.Zero),
            frequency: ActivityRecurrenceFrequency.Monthly,
            interval: 3,
            dates: null,
            byDay: null,
            byMonthDay: [1, 29, 31],
            exceptions:
            [
                new DateTimeOffset(2024, 8, 29, 12, 0, 0, 0, TimeSpan.Zero),
                new DateTimeOffset(2024, 8, 31, 12, 0, 0, 0, TimeSpan.Zero),
                new DateTimeOffset(2024, 11, 1, 12, 0, 0, 0, TimeSpan.Zero),
                new DateTimeOffset(2025, 8, 1, 12, 0, 0, 0, TimeSpan.Zero),
            ],
            until: new DateOnly(2025, 8, 5),
            count: null,
            expectedDates:
            [
                new DateOnly(2024, 8, 6),
                //new DateOnly(2024, 8, 29),  except
                //new DateOnly(2024, 8, 31),  except
                //new DateOnly(2024, 11, 1),  except
                new DateOnly(2024, 11, 29),
                new DateOnly(2025, 2, 1),
                new DateOnly(2025, 5, 1),
                new DateOnly(2025, 5, 29),
                new DateOnly(2025, 5, 31),
                //new DateOnly(2025, 8, 1),  except
            ]);
    }

    [Fact]
    public void Explode_FixedDates()
    {
        AssertSequence(
            startTime: new DateTimeOffset(1997, 8, 6, 12, 0, 0, 0, TimeSpan.Zero),
            endTime: new DateTimeOffset(2024, 8, 6, 23, 59, 59, 999, TimeSpan.Zero),
            frequency: ActivityRecurrenceFrequency.FixedDates,
            interval: 3,
            dates:
            [
                new DateTimeOffset(1998, 3, 14, 12, 0, 0, 0, TimeSpan.Zero),
                new DateTimeOffset(2077, 7, 7, 12, 0, 0, 0, TimeSpan.Zero),
                new DateTimeOffset(2000, 1, 1, 12, 0, 0, 0, TimeSpan.Zero),
            ],
            byDay: null,
            byMonthDay: null,
            exceptions: null,
            until: null,
            count: null,
            expectedDates:
            [
                new DateOnly(1997, 8, 6),
                new DateOnly(1998, 3, 14),
                new DateOnly(2000, 1, 1),
                new DateOnly(2077, 7, 7),
            ]);
    }
}
