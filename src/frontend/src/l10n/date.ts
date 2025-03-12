import { DayOfWeek } from "bundlor-web-api-client";

export const monthNames = [
    "Januar",
    "Februar",
    "März",
    "April",
    "Mai",
    "Juni",
    "Juli",
    "August",
    "September",
    "Oktober",
    "November",
    "Dezember",
];

export const dayNames = [
    "Montag",
    "Dienstag",
    "Mittwoch",
    "Donnerstag",
    "Freitag",
    "Samstag",
    "Sonntag",
];

export function americanToEuropeanDayOfWeekIndex(americanIndex: number): number {
    return (americanIndex + 6) % 7;
}

// Index: Monday = 0, Sunday = 6
export function dayOfWeekByIndex(index: number): DayOfWeek {
    if (index < 0 || index > 6) {
        throw new Error();
    }

    const result = Object.values(DayOfWeek)[(index + 1) % 7]!;
    return result;
}
console.assert(dayOfWeekByIndex(0) == DayOfWeek.Monday);  // TODO: Create unit tests
console.assert(dayOfWeekByIndex(6) == DayOfWeek.Sunday);

export function dayOfWeekByAmericanIndex(index: number): DayOfWeek {
    if (index < 0 || index > 6) {
        throw new Error();
    }

    const result = Object.values(DayOfWeek)[index]!;
    return result;
}

export function dayNameByDayOfWeek(dayOfWeek: DayOfWeek) {
    const index = (Object.keys(DayOfWeek).indexOf(dayOfWeek) + 6) % 7;
    if (index == -1) {
        throw new Error();
    }

    return dayNames[index];
}
console.assert(dayNameByDayOfWeek(DayOfWeek.Monday) == "Montag");
console.assert(dayNameByDayOfWeek(DayOfWeek.Sunday) == "Sonntag");

export function pad2(x: number) {
    return x.toString().padStart(2, "0");
}

export function pad4(x: number) {
    return x.toString().padStart(4, "0");
}

export function formatDate(date: Date) {
    // ddd, dd. MMM yyyy
    return `${dayNames[(date.getDay() + 6) % 7]}, ${date.getDate()}. ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatTime(date: Date) {
    // HH:mm
    return `${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

export function formatTimeSpan(start: Date, end: Date): string {
    var isSameDay =
        start.getFullYear() == end.getFullYear() &&
        start.getMonth() == end.getMonth() &&
        start.getDate() == end.getDate();

    if (isSameDay) {
        return `${formatDate(start)} von ${formatTime(start)} bis ${formatTime(end)}`;
    }

    return `${formatDate(start)} von ${formatTime(start)} bis ${formatDate(end)} ${formatTime(end)}`;
}

export function dateToLocalString(date: Date) {
    return `${pad4(date.getFullYear())}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

export function dateToDateOnly(date: Date) {
    return `${pad4(date.getUTCFullYear())}-${pad2(date.getUTCMonth())}-${pad2(date.getUTCDate())}`;
}
