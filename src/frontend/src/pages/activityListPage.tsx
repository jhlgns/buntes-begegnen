import { getApiResult, ResultStatus } from "@bb/api";
import { apiMetadataProvider } from "@bb/apiMetadataProvider";
import { ActivityCalendar } from "@bb/components/activityCalendar";
import { ActivityList, ActivityListParams } from "@bb/components/activityList";
import { breadcrumbStrings } from "@bb/components/breadcrumbs";
import { Button } from "@bb/components/button";
import { Checkbox, TextInput } from "@bb/components/input";
import { QuakePanel, usePageInfo } from "@bb/components/pageInfo";
import { Field, fieldConfigs } from "@bb/field";
import { monthNames } from "@bb/l10n/date";
import { Pages } from "@bb/pages";
import { flexRow } from "@bb/style/util";
import { monthSpan } from "@bb/util/date";
import { useComputed, useSignal } from "@preact/signals";
import { ActivitiesApi } from "bundlor-web-api-client";
import { LocationHook, useLocation } from "preact-iso";
import { useMemo } from "preact/hooks";

// TODO: Debounce the parameter changes

async function createActivity(location: LocationHook) {
    const result = await getApiResult(config => new ActivitiesApi(config).activitiesPost());
    if (result.status == ResultStatus.Failed) {
        // TODO: Show error
        return;
    }

    location.route(Pages.activityEditor(result.response!.id).path);
}

function usePanel() {
    const location = useLocation();
    return {
        title: "Veranstaltungen",
        content: (
            <>
                {/* TODO: Show warning when user has no promoter assigned */}
                <Button onClick={() => createActivity(location)}>Neue Veranstaltung erstellen</Button>
            </>
        ),
    } as QuakePanel;
}

export function ActivityListPage() {
    usePageInfo({
        breadcrumbs: breadcrumbStrings.activityList,
        quakePanel: usePanel(),
    });

    const searchTerm = useMemo(() => new Field(fieldConfigs.string, ""), []);
    const onlyRegistered = useMemo(() => new Field(fieldConfigs.boolean, false), []);

    const year = useSignal(new Date().getFullYear());
    const month = useSignal(new Date().getMonth() + 1);
    const currentMonthName = useComputed(() => monthNames[month.value - 1]);

    const params = useComputed(() => ({
        timeSpan: monthSpan(new Date(year.value, month.value, 1)),
        searchTerm: searchTerm.value.value,
        onlyRegistered: onlyRegistered.value.value,
    } as ActivityListParams));

    // TODO: More filters
    // * Diesen Monat
    // * Innerhalb der naechsten 3 Monate
    // * Meine Freunde?

    return (
        <>
            <h1>Veranstaltungen</h1>

            <div style={flexRow({ mainAxisAlignment: "start" })}>
                <Button onClick={() => { if (--month.value == 0) { month.value = 12; --year.value; } }}>
                    <i class="fa-solid fa-arrow-left" style={{ width: "1rem", height: "1rem", }} />
                </Button>
                <Button onClick={() => { if (++month.value == 13) { month.value = 1; ++year.value; } }}>
                    <i class="fa-solid fa-arrow-right" style={{ width: "1rem", height: "1rem", }} />
                </Button>
                <span style={{ margin: "0 1rem" }}>{currentMonthName} {year}</span>
            </div>

            <div style={flexRow({ crossAxisAlignment: "end", gap: "1rem" })}>
                <TextInput
                    label="Suchbegriff"
                    field={searchTerm}
                    placeholder="Gib hier einen Suchbegriff ein..."
                    style={{ flex: 1 }} />

                {apiMetadataProvider.userInteractionEnabled.value &&
                    <Checkbox
                        label="Nur angemeldete"
                        field={onlyRegistered} />
                }
            </div>

            <div style={{ height: "1rem", }} />

            <ActivityCalendar params={params} />

            <div style="height: 3rem" />
            {/* TODO */}
            <ActivityList params={params} />
        </>
    );
}
