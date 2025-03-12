import { useApiResult, transformResult, getApiResult } from "@bb/api";
import { apiMetadataProvider } from "@bb/apiMetadataProvider";
import { breadcrumbStrings } from "@bb/components/breadcrumbs";
import { Button, ButtonState } from "@bb/components/button";
import { Fieldset } from "@bb/components/fieldset";
import { InfoBox, InfoBoxStyle } from "@bb/components/infoBox";
import { LoadingSpinner } from "@bb/components/loadingSpinner";
import { QuakePanel, usePageInfo } from "@bb/components/pageInfo";
import { recurrencePatternToString } from "@bb/l10n/activity";
import { formatTimeSpan } from "@bb/l10n/date";
import { activityCategoryToString } from "@bb/l10n/enumTranslations";
import { doRoute } from "@bb/pageBlocker";
import { Pages } from "@bb/pages";
import { Theme } from "@bb/style/theme";
import { userInfoProviderContext } from "@bb/userInfoProvider";
import { readValue, Signalish, SignalLike } from "@bb/util/signal";
import { useSignal, useComputed, Signal, ReadonlySignal } from "@preact/signals";
import { ActivitiesApi, ActivityDto } from "bundlor-web-api-client";
import { ComponentChildren } from "preact";
import { LocationHook, useLocation } from "preact-iso";
import { useContext, useEffect } from "preact/hooks";

// TODO: Show instances of this activity at the bottom and show the recurrence pattern
// TODO: The instance query parameter might be used to mislead participants, showing injected dates

export function ActivityDetailPage(props: { id: Signalish<number>, query?: { instance?: string } }) {
    const id = readValue(props.id);
    const rebuildHook = useSignal(0);

    const activityResult = useApiResult(
        config => new ActivitiesApi(config).activitiesIdGet(readValue(id)),
        [rebuildHook],
    );

    usePageInfo({
        breadcrumbs: useComputed(() =>
            breadcrumbStrings.activityDetail(id, activityResult.value?.response?.title ?? "Lade...")
        ),
        quakePanel: usePanel(id),
    });

    return transformResult(
        activityResult,
        {
            loading: () => <LoadingSpinner />,
            done: (response) => <Detail activity={fix(response)} reload={() => rebuildHook.value++} />,
            failed: (error) => (
                <InfoBox style={InfoBoxStyle.Error}>
                    {error.code == 404
                        ? "Das Angebot wurde nicht gefunden."
                        : "Unbekannter Fehler beim Laden des Angebots."
                    }
                </InfoBox>
            )
        }
    );

    function fix(activity: ActivityDto) {
        // TODO: Rework the instancing and make it easier
        if (props.query?.instance != null) {
            var instance = new Date(+props.query?.instance);
            activity = {
                ...activity,
                startTime: instance,
                endTime: new Date(instance.valueOf() + (activity.endTime!.valueOf() - activity.startTime!.valueOf())),
            };
        }

        return activity;
    }
}

function Detail(props: { activity: ActivityDto, reload: () => void }) {
    const location = useLocation();
    const userInfoProvider = useContext(userInfoProviderContext);

    const buttonState = useSignal(ButtonState.Default);

    const activity = props.activity;

    const isOver = activity.startTime!.valueOf() < new Date().valueOf();
    const isLocked = activity.registrationLocked;
    const isFull = (activity.currentNumberOfParticipants ?? 0) >= (activity.maxNumberOfParticipants ?? 100000);

    const recurrencePattern = recurrencePatternToString(activity);

    useEffect(
        () => {
            if (isOver || isLocked || isFull) {
                buttonState.value = ButtonState.Disabled;
            } else if (activity.isRegistered) {
                buttonState.value = ButtonState.Success;
            } else {
                buttonState.value = ButtonState.Default;
            }
        },
        [activity],
    );

    async function handleRegisterOrUnregister() {
        buttonState.value = ButtonState.Loading;

        const result = await getApiResult(
            config => activity.isRegistered
                ? new ActivitiesApi(config).activitiesIdUnregisterPost(activity.id!)
                : new ActivitiesApi(config).activitiesIdRegisterPost(activity.id!),
        );

        props.reload();

        return;
    }

    return (
        <>
            <h1>Veranstaltung: {activity.title}</h1>

            <Fieldset>
                <legend>Die Veranstaltung</legend>

                <table>
                    <tbody>
                        <tr>
                            <Td><i class="fa-solid fa-face-smile"></i></Td>
                            <Td>
                                {activityCategoryToString(activity.category!)}
                            </Td>
                        </tr>
                        <tr>
                            <Td>
                                <i class="fa-solid fa-calendar-days"></i>
                            </Td>
                            <Td>
                                {formatTimeSpan(new Date(activity.startTime!), new Date(activity.endTime!))}
                                {recurrencePattern != null &&
                                    <div>({recurrencePattern})</div>
                                }
                            </Td>
                        </tr>
                        <tr>
                            <Td>
                                <i class="fa-solid fa-location-dot"></i>
                            </Td>
                            <Td>
                                {activity.location}
                            </Td>
                        </tr>
                        <tr>
                            <Td>
                                <i class="fa-solid fa-circle-info"></i>
                            </Td>
                            <Td>
                                <pre style={{ margin: 0, fontSize: "1.1rem" }}>
                                    {activity.description}
                                </pre>
                            </Td>
                        </tr>
                        {apiMetadataProvider.userInteractionEnabled.value &&
                            <tr>
                                <Td>
                                    <i class="fa-solid fa-people-group"></i>
                                </Td>
                                <Td>
                                    <span>Plätze belegt: {activity.currentNumberOfParticipants} von {activity.maxNumberOfParticipants ?? "unbegrenzt vielen"}</span>
                                </Td>
                            </tr>
                        }
                    </tbody>
                </table>

                {/* TODO: Unregistering should still be possible in most cases */}
                {apiMetadataProvider.userInteractionEnabled.value && (
                    userInfoProvider.userInfo.value != null &&
                    <>
                        <Button onClick={handleRegisterOrUnregister} state={buttonState.value}>
                            {activity.isRegistered
                                ? "Abmelden"
                                : "Anmelden"
                            }
                        </Button>
                        {isOver &&
                            <div><small style={{ color: Theme.warning.fg }}>Diese Veranstaltung liegt bereits in der Vergangenheit.</small></div>
                        }
                        {isLocked &&
                            <div><small style={{ color: Theme.warning.fg }}>Diese Veranstaltung ist derzeit gesperrt.</small></div>
                        }
                        {isFull &&
                            <div><small style={{ color: Theme.warning.fg }}>Die maximale Teilnehmeranzahl wurde bereits erreicht.</small></div>
                        }
                        {/* TODO: These conditions have not yet been tested */}
                    </> ||
                    <InfoBox>
                        Um dich für diese Veranstaltung <em>anzumelden</em>, musst du dich <a href={Pages.login().path}>einloggen</a> oder <a href={Pages.registration().path}>registrieren</a>.
                    </InfoBox>
                )}
            </Fieldset >

            <div style={{ height: ".5rem" }} />
            <div>
                <Button onClick={() => location.route(Pages.activityList().path)}>
                    <i class="fa-solid fa-arrow-left" style={{ marginRight: ".5rem" }} />
                    Zurück zur Übersicht
                </Button>
            </div>
        </>

        // TODO: Ensure correct terminology between "einloggen" and "anmelden" - what is the login and what is the registration for an activity?
    );

    function Td(props: { children: ComponentChildren }) {
        return (
            <td
                style={{
                    verticalAlign: "top",
                    padding: ".5rem",
                }}>
                {props.children}
            </td>
        );
    }
}

function usePanel(id: number) {
    const location = useLocation();
    return {
        title: "Veranstaltungs-Menü",
        content: (
            <>
                {/* TODO: Only enable when permitted */}
                <Button onClick={() => location.route(Pages.activityEditor(id).path)}>Bearbeiten</Button>
                <Button onClick={() => deleteActivity(id, location)}>Löschen</Button>
            </>
        ),
    } as QuakePanel;
}

async function deleteActivity(id: number, location: LocationHook) {
    const confirmed = confirm("Sind Sie sich sicher, dass Sie diese Veranstaltung löschen möchten?");
    if (confirmed == false) {
        return;
    }

    const result = await getApiResult(config => new ActivitiesApi(config).activitiesIdDelete(id));

    doRoute(location, Pages.activityList().path);

    // TODO: User feedback
}
