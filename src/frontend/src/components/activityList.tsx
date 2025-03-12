import { useApiResult, transformResult } from "@bb/api";
import { apiMetadataProvider } from "@bb/apiMetadataProvider";
import { InfoBox, InfoBoxStyle } from "@bb/components/infoBox";
import { LoadingSpinner } from "@bb/components/loadingSpinner";
import { monthNames } from "@bb/l10n/date";
import { activityVisibilityToString } from "@bb/l10n/enumTranslations";
import { Pages } from "@bb/pages";
import { Theme } from "@bb/style/theme";
import { useIsLargerThanMobile } from "@bb/style/layout";
import { flexColumn, flexRow } from "@bb/style/util";
import { TimeRange as TimeSpan } from "@bb/util/date";
import { readValue, Signalish } from "@bb/util/signal";
import { ActivitiesApi, ActivityDto, ActivityVisibility } from "bundlor-web-api-client";

// TODO: Paging
// TODO: I am not quite sure yet if it makes sense to show all instances

export type ActivityListParams = {
    timeSpan: TimeSpan;
    searchTerm?: string;
    onlyRegistered?: boolean;
    limit?: number;
};

export function ActivityList(props: { params: Signalish<ActivityListParams> }) {
    // TODO: Pass the limit to the API
    const activitiesResult = useApiResult(
        config => new ActivitiesApi(config).activitiesGet(
            readValue(props.params).timeSpan.start,
            readValue(props.params).timeSpan.end,
            readValue(props.params).searchTerm,
            readValue(props.params).onlyRegistered,
        ),
    );

    const params = readValue(props.params);

    return (
        <div style={flexColumn({ crossAxisAlignment: "stretch", gap: ".5rem", })}>
            {transformResult(
                activitiesResult,
                {
                    loading: () => <LoadingSpinner message="Lade Veranstaltungen..." />,
                    done: (activities) => <>
                        {activities
                            .slice(undefined, params.limit)
                            .map(x => <ActivityListItem key={`${x.id}${x.startTime}`} activity={x} />)
                        }
                    </>,
                    failed: () => <InfoBox style={InfoBoxStyle.Error}>
                        Fehler beim Laden der Veranstaltungen.
                    </InfoBox>
                }
            )}

            {params.limit != null &&
                <a
                    href={Pages.activityList().path}
                    style={{
                        fontWeight: "bold",
                    }}>
                    Alle Veranstaltungen anzeigen
                </a>
            }
        </div>
    );

    // TODO: IntersectionOberserver to load more when the sentinel scrolls into view
}

function ActivityListItem(props: { activity: ActivityDto }) {
    const { activity } = props;
    const isLargerThanMobile = useIsLargerThanMobile();

    let bg, fg: string;
    switch (activity.visibility) {
        case ActivityVisibility.PrivateDraft:
            bg = Theme.activityListItem.bgDraft;
            fg = Theme.activityListItem.fgDraft;
            break;
        case ActivityVisibility.SharedDraft:
            bg = Theme.activityListItem.bgDraft;
            fg = Theme.activityListItem.fgDraft;
            break;
        case ActivityVisibility.Public:
            bg = Theme.activityListItem.bg;
            fg = Theme.activityListItem.fg;
            break;
        default:
            bg = "blue";
            fg = "magenta";
            break;
    }

    const Date = () =>
        <div
            style={{
                ...flexColumn(),
                fontWeight: "bold",
                color: Theme.activityListItem.fgDate,
                backgroundColor: Theme.activityListItem.bgDate,
                borderRadius: Theme.borderRadius,
                minWidth: "2.8rem",
            }}>
            <div>{activity.startTime!.getDate()}.</div>
            <div>{monthNames[activity.startTime!.getMonth()]!.substring(0, 3)}</div>
        </div>;

    const Body = () =>
        <div
            style={{
                ...flexColumn({ crossAxisAlignment: "start" }),
                flexGrow: "1",
            }}>

            <div
                style={{
                    ...flexRow({ mainAxisAlignment: "space-between" }),
                    fontWeight: "bold",
                }}>
                {activity.visibility != ActivityVisibility.Public &&
                    <i class="fa-solid fa-lock" style={{ marginRight: ".5rem" }} />
                }
                {activity.title}
                {activity.visibility != ActivityVisibility.Public &&
                    <>
                        {" (Sichtbarkeit: " + activityVisibilityToString(activity.visibility!) + ")"}
                    </>
                }
            </div>

            <div>
                {activity.location}
            </div>
        </div>;

    const RegistrationIndicator = () =>
        <>
            {apiMetadataProvider.userInteractionEnabled.value &&
                <div style={flexColumn({ crossAxisAlignment: "end" })}>
                    <div style={{ flex: "1" }}>
                        {activity.isRegistered &&
                            <>
                                <i class="fa-solid fa-check" style={{ marginRight: ".5rem" }} />
                                <em>Angemeldet!</em>
                            </> ||
                            <div />
                        }
                    </div>
                    <div style={{ flex: "1" }}>{activity.currentNumberOfParticipants} / {activity.maxNumberOfParticipants ?? "unbegrenzt"}</div>
                </div>
            }
        </>;

    const href = Pages.activityDetail(
        activity.id!,
        activity.isInstance ? activity.startTime : undefined
    ).buildUrl().toString();

    return (
        <a
            href={href}
            style={{
                ...flexRow({ crossAxisAlignment: "stretch" }),
                gap: ".5em",
                color: fg,
                backgroundColor: bg,
                textDecoration: "none",
                padding: ".25rem",
                ...Theme.interactive,
            }}>

            <Date />
            <Body />
            <div style={{ flexGrow: 1 }} />

            {isLargerThanMobile &&
                <RegistrationIndicator />
            }
        </a>
    );
}
