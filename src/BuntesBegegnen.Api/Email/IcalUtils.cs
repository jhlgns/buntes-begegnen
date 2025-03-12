using BuntesBegegnen.Api.Data.Entities;
using Ical.Net;
using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;
using Ical.Net.Serialization;

namespace BuntesBegegnen.Api.Email;

// https://en.wikipedia.org/wiki/ICalendar
public static class IcalUtils
{
    public static string GenerateInvitation(ActivityDto activity, string contactEmailAddress, string attendeeEmailAddress)
    {
        // TODO: Is there some sort of ID so that updates change the correct event?

        if (activity.RecurrenceFrequency == ActivityRecurrenceFrequency.FixedDates)
        {
            throw new NotImplementedException("Fixed dates are not yet implemented in IcalUtils");
        }

        var e = new CalendarEvent
        {
            // TODO: Put the promoter in here
            // TODO Uid = ,
            // TODO RecurrenceId = ,
            // TODO Sequence = ,
            Organizer = new Organizer { SentBy = new Uri($"mailto:{contactEmailAddress}") },
            Attendees = [new($"mailto:{attendeeEmailAddress}")],
            Summary = activity.Title,
            Start = new CalDateTime(activity.StartTime.DateTime),
            End = new CalDateTime(activity.EndTime.DateTime),
            IsAllDay = activity.IsAllDay,
            Location = activity.Location,
            Description = activity.Description,
            //ExceptionDates = ,
            //  TODO RecurrenceDates = activity.RecurrenceDates.Select(x => new PeriodList { [0] = new Period(x.DateTime, x + ) }).ToList(),
            RecurrenceRules =
            [
                new RecurrencePattern
                {
                    Frequency = Translate(activity.RecurrenceFrequency),
                    Interval = activity.RecurrenceInterval ?? throw new InvalidOperationException(),
                    ByDay = activity.RecurrenceByDay.Select(x => new WeekDay(x.DayOfWeek, x.Ordinal)).ToList(),
                    ByMonthDay = activity.RecurrenceByMonthDay.ToList(),
                    Until = activity.RepeatUntil!.Value.ToDateTime(new TimeOnly(0, 0)),
                }],
        };

        var calendar = new Calendar
        {
            ProductId = "buntes-begegnen.de",
            Events = { e }
        };

        var result = new CalendarSerializer().SerializeToString(calendar);
        return result;
    }

    private static FrequencyType Translate(ActivityRecurrenceFrequency frequency)
        => frequency switch
        {
            ActivityRecurrenceFrequency.None => FrequencyType.None,
            //ActivityRecurrenceFrequency.Daily => FrequencyType.Daily,
            ActivityRecurrenceFrequency.Weekly => FrequencyType.Weekly,
            ActivityRecurrenceFrequency.Monthly => FrequencyType.Monthly,
            //ActivityRecurrenceFrequency.Yearly => FrequencyType.Yearly,
            _ => throw new ArgumentOutOfRangeException(nameof(frequency)),
        };
}
