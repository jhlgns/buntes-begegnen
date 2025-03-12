import { adminPasswordLocalStorageKey, useApiResult, ApiResult, throwOnError, getApiResult, transformResult, ResultStatus } from "@bb/api";
import { apiMetadataProviderContext } from "@bb/apiMetadataProvider";
import { breadcrumbStrings } from "@bb/components/breadcrumbs";
import { Button } from "@bb/components/button";
import { ErrorList } from "@bb/components/errorList";
import { Fieldset } from "@bb/components/fieldset";
import { InfoBox, InfoBoxStyle } from "@bb/components/infoBox";
import { Checkbox, TextInput } from "@bb/components/input";
import { LoadingSpinner } from "@bb/components/loadingSpinner";
import { usePageInfo } from "@bb/components/pageInfo";
import { Field, fieldConfigs } from "@bb/field";
import { recurrencePatternToString } from "@bb/l10n/activity";
import { joinUnd as joinEnumerationByUnd } from "@bb/l10n/misc";
import { usePageBlocker } from "@bb/pageBlocker";
import { Pages } from "@bb/pages";
import { popupControllerContext } from "@bb/popupController";
import { Theme } from "@bb/style/theme";
import { useContentWidth } from "@bb/style/layout";
import { flexColumn } from "@bb/style/util";
import { userInfoProviderContext } from "@bb/userInfoProvider";
import { useSignal } from "@preact/signals";
import { ActivityDto, ActivityRecurrenceByDayDto, ActivityRecurrenceFrequency, DayOfWeek, DebugApi } from "bundlor-web-api-client";
import { ComponentChildren } from "preact";
import { useLocation } from "preact-iso";
import { CSSProperties } from "preact/compat";
import { useContext, useMemo, useRef } from "preact/hooks";

// TODO: Test for FormScope with each validation constraint using a bogus DTO that has all constraints that are available

export function DebugPage() {
    usePageInfo({ breadcrumbs: breadcrumbStrings.veryLongDebug });
    useContentWidth("100%");

    const userInfoProvider = useContext(userInfoProviderContext);
    const apiMetadataProvider = useContext(apiMetadataProviderContext);
    const popupController = useContext(popupControllerContext);
    const popupsShown = useSignal(0);
    const rebuildCounter = useSignal(0);
    const adminPassword = useMemo(() => new Field(fieldConfigs.string, localStorage.getItem(adminPasswordLocalStorageKey) ?? ""), []);

    const myClaimsResult = useApiResult(config => new DebugApi(config).debugMyClaimsGet(), [rebuildCounter]);;
    const rateLimitTestResult = useSignal<ApiResult<void> | null>(null);
    const rateLimitCounter = useSignal(0);

    const currentUserId = userInfoProvider.userInfo.value?.account.id;

    const isBlocked = useMemo(() => new Field(fieldConfigs.boolean, false), []);
    usePageBlocker(() =>
        isBlocked.value.peek()
            ? "Nein Mann, ich will noch nicht gehen... Oder doch?"
            : null
    );

    const location = useLocation();

    async function handleAssumeUser(id: string) {
        console.log("Assuming user", id);

        const result = throwOnError(
            await getApiResult(config => new DebugApi(config).debugAssumePost(id))
        );

        await userInfoProvider.ensureUserInfo();
        ++rebuildCounter.value;
    }

    async function invokeRateLimitingTestEndpoint() {
        const result = await getApiResult(config => new DebugApi(config).debugRateLimitingTestGet());
        rateLimitTestResult.value = result;
        ++rateLimitCounter.value;
    }

    async function showTestPopup() {
        await new Promise((resolve, reject) => {
            popupController.currentPopup.value = {
                content: "Das hier ist ein Test-Popup",
                onClose: () => { console.debug("Closing popup"); resolve(undefined); },
                actions: [
                    {
                        label: "Action 1",
                        color: Theme.success.bg,
                        action: () => {
                            console.log("Action 1");
                        },
                    },
                    {
                        label: "Action 2",
                        color: Theme.info.bg,
                        action: () => {
                            console.log("Action 2");
                        },
                    },
                    {
                        label: "Action 3",
                        color: Theme.warning.bg,
                        action: () => {
                            console.log("Action 3");
                        },
                    },
                    {
                        label: "Action 4",
                        color: Theme.error.bg,
                        action: () => {
                            console.log("Action 4");
                        },
                    },
                ],
            };
        });

        console.debug("Popup closed");
        ++popupsShown.value;
    }

    function saveAdminPassword() {
        if (adminPassword.value.value.length == 0) {
            localStorage.removeItem(adminPasswordLocalStorageKey)
        } else {
            localStorage.setItem(adminPasswordLocalStorageKey, adminPassword.value.value);
        }

        ++rebuildCounter.value;
    }

    return (
        <div style={{
            ...flexColumn({ crossAxisAlignment: "stretch", gap: "2rem" }),
            padding: "1rem",
        }}>
            <h1>DEBUG</h1>

            <Fieldset>
                <legend>Admin password</legend>
                <TextInput
                    type="password"
                    field={adminPassword}
                    label="Admin-Passwort:" />
                <Button onClick={saveAdminPassword}>Save</Button>
            </Fieldset>

            <Fieldset>
                <legend>My claims</legend>

                {
                    transformResult(
                        myClaimsResult,
                        {
                            loading: () => <span>Lade...</span>,
                            failed: (e) => <ErrorList errors={[JSON.stringify(e, undefined, "    ")]} />,
                            done: (response) => (
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <td>Typ</td>
                                            <td>Wert</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {response.map(x => (
                                            <tr>
                                                <td>{x.type}</td>
                                                <td>{x.value}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ),
                        })
                }
            </Fieldset>

            <Fieldset>
                <legend>User info</legend>
                <h3>Account</h3>
                <pre>
                    {JSON.stringify(userInfoProvider.userInfo.value?.account, undefined, "    ")}
                </pre>
                <h3>Roles</h3>
                <ul>
                    {userInfoProvider.userInfo.value?.roles.map(role => (
                        <li>{role}</li>
                    ))}
                </ul>
            </Fieldset>

            <Fieldset>
                <legend>Rate limiting test</legend>
                <Button onClick={invokeRateLimitingTestEndpoint}>
                    Invoke test endpoint
                </Button>

                <div>Invocations: {rateLimitCounter}</div>
                <div>
                    <span>Status: </span>
                    {rateLimitTestResult.value?.status == null
                        ? "null"
                        : <>
                            {ResultStatus[rateLimitTestResult.value?.status!]}
                            <pre>
                                {JSON.stringify(rateLimitTestResult.value.error, undefined, "  ")}
                            </pre>
                        </>
                    }
                </div>
            </Fieldset>

            <details>
                <summary>API Metadata</summary>

                <Fieldset>
                    <legend>API Metadata</legend>

                    <div>
                        previewModeEnabled: {apiMetadataProvider.previewModeEnabled.value.toString()}
                    </div>
                    <div>
                        registrationPasswordRequired: {apiMetadataProvider.registrationPasswordRequired.value.toString()}
                    </div>

                    {Array.from(apiMetadataProvider.constraintsByType.value?.entries() ?? []).map(typeConstraintEntry => (
                        <>
                            <h3>{typeConstraintEntry[0]}</h3>
                            <table class="table">
                                <colgroup>
                                    <col style="width: 30%" />
                                </colgroup>
                                <thead>
                                    <tr>
                                        <Td style={{ maxWidth: "10rem" }}>Field</Td>
                                        <Td>Constraint</Td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {toArray(typeConstraintEntry[1].fields ?? {}).map(fieldConstraintEntry => (
                                        <tr>
                                            <td style={{ maxWidth: "10rem" }}>{fieldConstraintEntry[0]}</td>
                                            <Td>
                                                {fieldConstraintEntry[1].map(fieldConstraint => (
                                                    <div><u>{fieldConstraint.type}</u> - {JSON.stringify(fieldConstraint.constraint, undefined, " ")}</div>
                                                ))}
                                            </Td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    ))}
                </Fieldset>
            </details>

            <Fieldset>
                <legend>Popup</legend>
                <Button onClick={showTestPopup}>Show test popup</Button>
                <div>Popups shown: {popupsShown}</div>
            </Fieldset>

            <details>
                <summary>InfoBoxes</summary>

                <InfoBox style={InfoBoxStyle.Information}>Information</InfoBox>
                <InfoBox style={InfoBoxStyle.Success}>Success</InfoBox>
                <InfoBox style={InfoBoxStyle.Warning}>Warning</InfoBox>
                <InfoBox style={InfoBoxStyle.Error}>Error</InfoBox>
            </details>

            <Fieldset title="useRouteBlocker">
                <Checkbox
                    label="Use route blocker"
                    field={isBlocked} />
                <div><a href="https://hahlganss.de">hahlganss.de</a></div>
                <div><a href={Pages.profile().path}>Profil</a></div>
                <div><Button onClick={() => location.route(Pages.login().path)}>Manual route to login</Button></div>
            </Fieldset>

            <LoadingSpinner message="LoadingSpinner" />

            <Fieldset title="recurrencePatternToString">
                <div>{joinEnumerationByUnd(["Eins"])}</div>
                <div>{joinEnumerationByUnd(["Eins", "Zwei"])}</div>
                <div>{joinEnumerationByUnd(["Eins", "Zwei", "Drei"])}</div>
                <div>
                    {(() => {
                        const activities: ActivityDto[] = [
                            {
                                id: null!,
                                createdAt: null!,
                                createdById: null!,
                                startTime: new Date(),
                                recurrenceFrequency: ActivityRecurrenceFrequency.None,
                            },
                            {
                                id: null!,
                                createdAt: null!,
                                createdById: null!,
                                startTime: new Date(),
                                recurrenceFrequency: ActivityRecurrenceFrequency.Weekly,
                            },
                            {
                                id: null!,
                                createdAt: null!,
                                createdById: null!,
                                startTime: new Date(),
                                recurrenceFrequency: ActivityRecurrenceFrequency.Weekly,
                                recurrenceByDay: [
                                    { ordinal: 0, dayOfWeek: DayOfWeek.Monday } as ActivityRecurrenceByDayDto,
                                    { ordinal: 0, dayOfWeek: DayOfWeek.Saturday } as ActivityRecurrenceByDayDto,
                                ] as ActivityRecurrenceByDayDto[],
                            },
                            {
                                id: null!,
                                createdAt: null!,
                                createdById: null!,
                                startTime: new Date(),
                                recurrenceFrequency: ActivityRecurrenceFrequency.Weekly,
                                recurrenceInterval: 3,
                            },
                            {
                                id: null!,
                                createdAt: null!,
                                createdById: null!,
                                startTime: new Date(),
                                recurrenceFrequency: ActivityRecurrenceFrequency.Monthly,
                                recurrenceInterval: 1,
                            },
                            {
                                id: null!,
                                createdAt: null!,
                                createdById: null!,
                                startTime: new Date(),
                                recurrenceFrequency: ActivityRecurrenceFrequency.Monthly,
                                recurrenceInterval: 2,
                                recurrenceByDay: [
                                    { ordinal: 1, dayOfWeek: DayOfWeek.Monday },
                                    { ordinal: 2, dayOfWeek: DayOfWeek.Tuesday },
                                    { ordinal: 3, dayOfWeek: DayOfWeek.Wednesday },
                                ] as ActivityRecurrenceByDayDto[],
                            },
                        ];

                        return activities.map(activity => (
                            <>
                                <div>{JSON.stringify(activity)}</div>
                                <div>&rarr;</div>
                                <div>{recurrencePatternToString(activity)}</div>
                                <hr />
                            </>
                        ));
                    })()}
                </div>
            </Fieldset>
        </div>
    );

    function Td(props: { children: ComponentChildren, style?: CSSProperties }) {
        return (
            <td
                style={{ wordWrap: "break-word", wordBreak: "break-all", ...props.style }}>
                {props.children}
            </td>
        );
    }

    function toArray<T>(value: { [key: string]: T }): [string, T][] {
        const result: [string, T][] = [];
        for (const key in value) {
            result.push([key, value[key]!]);
        }

        return result;
    }
}