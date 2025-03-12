import { transformResult, useApiResult } from "@bb/api";
import { InfoBox, InfoBoxStyle } from "@bb/components/infoBox";
import { LoadingSpinner } from "@bb/components/loadingSpinner";
import { americanToEuropeanDayOfWeekIndex } from "@bb/l10n/date";
import { Pages } from "@bb/pages";
import { Theme } from "@bb/style/theme";
import { flexColumn } from "@bb/style/util";
import { daysInMonth, TimeRange } from "@bb/util/date";
import { readValue, Signalish } from "@bb/util/signal";
import { ActivitiesApi, ActivityDto } from "bundlor-web-api-client";
import { ComponentChildren } from "preact";

type ActivityCalendarParams = {
    timeSpan: TimeRange;
}

export function ActivityCalendar(props: { params: Signalish<ActivityCalendarParams> }) {
    const activitiesResult = useApiResult(
        config => new ActivitiesApi(config).activitiesGet(
            readValue(props.params).timeSpan.start,
            readValue(props.params).timeSpan.end,
            undefined,
            false,
        ),
    );

    const params = readValue(props.params);
    console.debug("Params:", params);
    const year = params.timeSpan.start.getFullYear();
    const month = params.timeSpan.start.getMonth() + 1;

    return transformResult(
        activitiesResult,
        {
            loading: () => <>
                <Calendar activities={[]} year={year} month={month} />,
                <LoadingSpinner message="Lade Veranstaltungen..." />
            </>,
            done: (response) => <Calendar activities={response} year={year} month={month} />,
            failed: () => <InfoBox style={InfoBoxStyle.Error}>Fehler beim Laden der Veranstaltungen.</InfoBox>
        }
    );
}

function Calendar(props: { activities: ActivityDto[], year: number, month: number }) {
    const { year, month } = props;

    const firstDayOfMonth = new Date(year, month - 1, 1, 0, 0, 0);
    const monthStartOffset = americanToEuropeanDayOfWeekIndex(firstDayOfMonth.getDay());
    var numberOfDays = daysInMonth(year, month);

    const now = new Date();

    function Td(props: { isHead: boolean, children?: ComponentChildren }) {
        return (
            <td style={{
                border: "1px solid black",
                padding: 0,
                ...props.isHead == false && { height: "7rem" },
                overflow: "hidden",
                textAlign: "center",
            }}>
                {props.children}
            </td>
        );
    }

    const buildRow = (row: number) =>
        <tr>
            {[0, 1, 2, 3, 4, 5, 6].map(column => buildColumn(row, column))}
        </tr>;

    const buildColumn = (row: number, column: number) => {
        const cellIndex = row * 7 + column;
        const dayOfMonth = cellIndex - monthStartOffset + 1;
        console.debug("row", row, "column", column, "=> dayOfMonth", dayOfMonth);

        if (cellIndex < monthStartOffset || dayOfMonth > numberOfDays) {
            return <Td isHead={false}></Td>;
        }

        const isToday =
            props.year == now.getFullYear() &&
            props.month == now.getMonth() + 1 &&
            dayOfMonth == now.getDate();

        const [dayBg, dayFg] = isToday
            ? [Theme.blue.bg, Theme.blue.fgAlt]
            : [Theme.activityListItem.bgDate, Theme.activityListItem.fgDate];  // TODO: Theme colors

        const maxActivitiesToShow = 2;
        const activitiesOfDay = props.activities.filter(x => x.startTime!.getDate() == dayOfMonth);
        const hasMore = activitiesOfDay.length > maxActivitiesToShow;

        return (
            <Td isHead={false}>
                <div
                    style={{
                        ...flexColumn({ mainAxisAlignment: "start", crossAxisAlignment: "stretch" }),
                        height: "100%",
                    }}>

                    <span
                        style={{
                            color: dayFg,
                            backgroundColor: dayBg,
                        }}>
                        {dayOfMonth}
                    </span>

                    <div>
                        {activitiesOfDay.slice(undefined, maxActivitiesToShow).map(activity =>
                            <div
                                style={{
                                    fontSize: ".8rem",
                                    backgroundColor: Theme.activityListItem.bg,
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis ellipsis",
                                    overflow: "hidden",
                                    outline: "1px solid black",
                                }}>
                                <a
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}
                                    href={Pages.activityDetail(activity.id!, /* TODO: Instance */).path}>
                                    {activity.title}
                                </a>
                            </div>
                        )}
                        {hasMore &&
                            <div
                                style={{
                                    fontSize: ".8rem",
                                    backgroundColor: Theme.activityListItem.bg,
                                    whiteSpace: "nowrap",
                                    textOverflow: "ellipsis ellipsis",
                                    overflow: "hidden",
                                    outline: "1px solid black",
                                }}>
                                <a
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}>
                                    + {activitiesOfDay.length - maxActivitiesToShow} weitere
                                </a>
                            </div>
                        }
                    </div>
                </div>
            </Td>
        );
    }

    return (
        <table class="table"
            style={{ tableLayout: "fixed" }}>
            <thead>
                <tr>
                    <Td isHead={true}>Mo</Td>
                    <Td isHead={true}>Di</Td>
                    <Td isHead={true}>Mi</Td>
                    <Td isHead={true}>Do</Td>
                    <Td isHead={true}>Fr</Td>
                    <Td isHead={true}>Sa</Td>
                    <Td isHead={true}>So</Td>
                </tr>
            </thead>

            <tbody>
                {[0, 1, 2, 3, 4].map(buildRow)}
            </tbody>
        </table>
    );
}
