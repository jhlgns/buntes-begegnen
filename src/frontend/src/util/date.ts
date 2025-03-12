const _daysInMonth365 = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const _daysInMonth366 = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

export function isLeapYear(year: number): boolean {
    if ((year & 3) != 0) return false;
    if ((year & 15) == 0) return true;

    return year % 25 != 0;
}

export function daysInMonth(year: number, month: number): number {
    if (month < 1 || month > 12) {
        throw Error("Invalid month");
    }

    return (isLeapYear(year) ? _daysInMonth366 : _daysInMonth365)[month - 1]!;
}

export class TimeSpan {
    constructor(
        public days: number,
        public hours: number,
        public minutes: number,
        public seconds: number,
        public milliseconds: number) { }

    public get totalMilliseconds() {
        return (
            this.days * 24 * 60 * 60 * 1000 +
            this.hours * 60 * 60 * 1000 +
            this.minutes * 60 * 1000 +
            this.seconds * 1000 +
            this.milliseconds
        );
    }

    public static parse(value: string): TimeSpan {
        const regExp = new RegExp(/((?<days>(\d+))\.)?(?<hours>\d{1,2}):(?<minutes>\d{1,2}):(?<seconds>\d{1,2})(\.(?<milliseconds>\d{1,7}))?/);
        const { days, hours, minutes, seconds, milliseconds } = regExp.exec(value)!.groups!;

        function parseOptionalNumber(value: string | undefined): number {
            if (value == null) {
                return 0;
            }

            const result = Number.parseFloat(value);
            if (Number.isNaN(result)) {
                return 0;
            }

            return result;
        }

        return new TimeSpan(
            parseOptionalNumber(days),
            parseOptionalNumber(hours),
            parseOptionalNumber(minutes),
            parseOptionalNumber(seconds),
            parseOptionalNumber(milliseconds),
        );

        //     // Example: 1.12:24:02 -> 1.12 days, 24 hours, 2 minutes
        //     // Example: 0:24:02 -> 1.12 days, 24 hours, 2 minutes
        //     // Example: 0:24:02:55.782394792 -> 1.12 days, 24 hours, 2 minutes
        //     //
        //     // TODO: Handle negative values
        //
        //     // If with day: ["d", "HH:mm:ss"] or ["d", "HH:mm:ss", "fffffff"] -> dotSegments[0] does not contain ':'
        //     // If without day: ["HH:mm:ss"] or  ["HH:mm:ss", "fffffff"] -> dotSegments[0] does contain ':'
        //     const dotSegments = value.split(".");
        //
        //     let colonSegments = [] as string[];
        //     if (dotSegments.length > 1 && dotSegments[0]!.includes(':') == false) {
        //         // Contains day - skip day, join the rest (might have milliseconds) and split by ':'
        //         colonSegments = dotSegments.slice(1).join().split(":");
        //     } else {
        //         // Does not contain day
        //         colonSegments = dotSegments[0]!.split(":");
        //     }
        //
        //     const colonNumbers = colonSegments.map(Number.parseFloat);
        //     if (colonNumbers.length != 3 || colonNumbers.some(Number.isNaN)) {
        //         throw new Error("Invalid TimeSpan string: " + value);
        //     }
        //
        //     if (colonNumbers.length == 3) {
        //         // HH:mm:ss
        //     } else if (colonNumbers.length == 4) {
        //         // HH:mm:ss
        //     }
        //
        //     if (colonNumbers.
        //     const [days, hours, minutes, seconds] = colonNumbers;
        //
        //     const result = new TimeSpan(days ?? 0, hours!, minutes!, seconds ?? 0, milliseconds ?? 0);
        //     console.debug(result);
        //     return result
    }
}

export type TimeRange = {
    start: Date;
    end: Date;
}

export function monthSpan(dateInMonth: Date): TimeRange {
    return {
        start: new Date(Date.UTC(
            dateInMonth.getUTCFullYear(),
            dateInMonth.getUTCMonth(),
            1,
            0,
            0,
            0,
            0,
        )),
        end: new Date(Date.UTC(
            dateInMonth.getUTCFullYear(),
            dateInMonth.getUTCMonth(),
            daysInMonth(dateInMonth.getUTCFullYear(), dateInMonth.getUTCMonth() + 1),
            23,
            59,
            59,
            999,
        ))
    };
}