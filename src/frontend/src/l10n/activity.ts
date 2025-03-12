import { dayNameByDayOfWeek, dayOfWeekByAmericanIndex, formatDate } from "@bb/l10n/date";
import { joinUnd } from "@bb/l10n/misc";
import { ActivityDto, ActivityRecurrenceFrequency } from "bundlor-web-api-client";

function dayOrdinal(ordinal: number) {
    switch (ordinal) {
        case -1: return "letzten";
        case 1: return "ersten";
        case 2: return "zweiten";
        case 3: return "dritten";
        case 4: return "vierten";
        case 5: return "fünften";
    }

    throw Error("ordinal out of range: " + ordinal);
}

export function recurrencePatternToString(activity: ActivityDto): string | null {
    // TODO: If the startTime does not fit into the recurrence pattern, it should be printed before the pattern as a single occurrence like "Am ... und jeden ..."

    function recurrenceOnly() {
        const interval = activity.recurrenceInterval ?? 1;

        switch (activity.recurrenceFrequency) {
            case ActivityRecurrenceFrequency.None:
                return null;

            case ActivityRecurrenceFrequency.Weekly: {
                let result = interval == 1 ? "Jede Woche" : `Alle ${interval} Wochen`;

                const byDay = activity.recurrenceByDay != null && activity.recurrenceByDay.length > 0
                    ? activity.recurrenceByDay
                    : [{ ordinal: 0, dayOfWeek: dayOfWeekByAmericanIndex(activity.startTime!.getDay()) }];

                const dayAdverbs = byDay.map(x => dayNameByDayOfWeek(x.dayOfWeek!) + "s");
                result += ` ${joinUnd(dayAdverbs)}`;

                return result;
            }

            case ActivityRecurrenceFrequency.Monthly: {
                let result = interval == 1 ? "Monatlich" : `Alle ${interval} Monate`;

                if (activity.recurrenceByDay != null && activity.recurrenceByDay.length > 0) {
                    const daysWithOrdinals = activity.recurrenceByDay.map(x => `${dayOrdinal(x.ordinal!)} ${dayNameByDayOfWeek(x.dayOfWeek!)}`);  // "ersten Montag"
                    result += ` an jedem ${joinUnd(daysWithOrdinals)}`;
                } else {
                    const byMonthDay = activity.recurrenceByMonthDay != null && activity.recurrenceByMonthDay.length > 0
                        ? Array.from(activity.recurrenceByMonthDay)
                        : [activity.startTime!.getDate()];

                    const days = byMonthDay.map(x => `${x}.`);
                    result += ` am ${joinUnd(days)}`;
                }

                return result;
            }

            case ActivityRecurrenceFrequency.FixedDates: {
                var instances = [activity.startTime, ...(activity.recurrenceDates ?? [])];
                if (instances.length == 1) {
                    // This is not a recurrence then
                    return null;
                }

                return joinUnd(instances.map(x => formatDate(x!)));
            }
        }

        console.warn("Unknown recurrence frequency:", activity.recurrenceFrequency);

        return null;
    }

    const recurrence = recurrenceOnly();

    if (activity.repeatCount != null) {
        return `${recurrence} für ${activity.repeatCount} Wiederholungen`;
    } else if (activity.repeatUntil != null) {
        return `${recurrence}, endet am ${formatDate(new Date(activity.repeatUntil!))}`;
    }

    return recurrence;
}
