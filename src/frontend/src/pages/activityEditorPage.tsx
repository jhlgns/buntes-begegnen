import { useApiResult, transformResult, getApiResult, ResultStatus } from "@bb/api";
import { breadcrumbStrings } from "@bb/components/breadcrumbs";
import { ButtonState, Button } from "@bb/components/button";
import { ValidationSummary } from "@bb/components/errorList";
import { Fieldset } from "@bb/components/fieldset";
import { Form } from "@bb/components/form";
import { InfoBox, InfoBoxStyle } from "@bb/components/infoBox";
import { TextInput, Select, Checkbox, TextArea, SelectOption } from "@bb/components/input";
import { LoadingSpinner } from "@bb/components/loadingSpinner";
import { usePageInfo } from "@bb/components/pageInfo";
import { RequiredConstraint } from "@bb/constraintTypes";
import { fieldConfigs } from "@bb/field";
import { useFormScope, FormScopeProvider, FormScope } from "@bb/formScope";
import { dateToDateOnly, dayNames } from "@bb/l10n/date";
import { activityCategoryToString, activityRecurrenceFrequencyToString, activityVisibilityToString } from "@bb/l10n/enumTranslations";
import { doRoute, usePageBlocker } from "@bb/pageBlocker";
import { Pages } from "@bb/pages";
import { flexRow } from "@bb/style/util";
import { userInfoProviderContext } from "@bb/userInfoProvider";
import { readValue, Signalish } from "@bb/util/signal";
import { AllDefined } from "@bb/util/types";
import { useSignal, useComputed, Signal, effect } from "@preact/signals";
import { ActivitiesApi, ActivityDto, ActivityCategory, ActivityVisibility, UpdateActivityDto, ProfileApi, DayOfWeek, ActivityRecurrenceFrequency, ActivityRecurrenceByDayDto, ValidationConstraintType } from "bundlor-web-api-client";
import { useLocation } from "preact-iso";
import { useContext } from "preact/hooks";

// TODO: Show warning when there are already more participants than the new maximum number of participants
// TODO: Show list of registered people with the possibility
//     * To unregister them
//     * To notify them
//     * ...?

enum RecurrenceEndCondition {
    Count = "Count",
    DateReached = "DateReached",
}

interface InfoBoxState {
    ok: boolean;
    message: string;
}

export function ActivityEditorPage(props: { id: Signalish<number> }) {
    const id = readValue(props.id);
    const rebuildHook = useSignal(0);

    const activityResult = useApiResult(
        config => new ActivitiesApi(config).activitiesIdGet(id),
        [rebuildHook],
        { skipResetWhenReloading: true }
    );

    usePageInfo({
        breadcrumbs: useComputed(() => breadcrumbStrings.activityEditor(readValue(props.id), activityResult.value?.response?.title ?? "Lade...")),
    });

    return transformResult(
        activityResult,
        {
            loading: () => <LoadingSpinner message="Lade Veranstaltung..." />,
            done: (response) => <Editor activity={response} rebuild={() => rebuildHook.value++} />,
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
}

function Editor(props: { activity: ActivityDto, rebuild: () => void }) {
    const userInfoProvider = useContext(userInfoProviderContext);
    const [formScope, fields] = useFormScope(
        "UpdateActivityDto",
        (scope) => setFields(scope, props.activity, userInfoProvider.userInfo.value?.account.id!),
        [props.activity, userInfoProvider.userInfo.value?.account.id!],
    );

    const location = useLocation();
    const formTitle = useComputed(() => `Veranstaltung: ${fields.title.value.value}`);
    const buttonState = useSignal(ButtonState.Default);
    const infoBoxState = useSignal<InfoBoxState | null>(null);

    const authorResult = useApiResult(
        config => new ProfileApi(config).profileIdGet(props.activity.createdById!),
    );

    usePageBlocker(() =>
        formScope.anyFieldWasChanged()
            ? "Sie haben Änderungen vorgenommen - möchten Sie wirklich die Seite verlassen?"
            : null
    );

    return (
        <FormScopeProvider scope={formScope}>
            <h1>Veranstaltung bearbeiten</h1>

            <Form title={formTitle}>
                {transformResult(
                    authorResult,
                    {
                        loading: () => <LoadingSpinner message="Lade Autor..." />,
                        done: (result) => <div>Erstellt von: {result.firstName} {result.lastName}</div>
                    }
                )}

                <TextInput
                    label="Titel"
                    field={fields.title} />

                <Select
                    label="Kategorie"
                    field={fields.category}
                    options={
                        [ActivityCategory.Excursion, ActivityCategory.Creativity, ActivityCategory.Exercise]
                            .map(category => ({ value: category, label: activityCategoryToString(category) }))
                    } />

                <Select
                    label="Sichtbarkeit"
                    field={fields.visibility}
                    options={
                        [ActivityVisibility.PrivateDraft, ActivityVisibility.SharedDraft, ActivityVisibility.Public]
                            .map(visibility => ({ value: visibility, label: activityVisibilityToString(visibility) }))
                    } />

                <TextInput
                    type="datetime-local"
                    label="Beginn"
                    field={fields.startTime} />

                <TextInput
                    type="datetime-local"
                    label="Ende"
                    field={fields.endTime} />

                <RecurrenceEditor fields={fields} />

                {/* TODO: Wrap on mobile to keep it visible */}
                <div style={flexRow({ crossAxisAlignment: "end", gap: "1rem", wrap: true })}>
                    <TextInput
                        type="number"
                        label="Freie Plätze"
                        field={fields.maxNumberOfParticipants}
                        style={{ flex: 1 }} />

                    <Checkbox
                        label={<span><i class="fa-solid fa-lock" style={{ marginRight: ".5rem" }} />Anmeldung sperren</span>}
                        field={fields.registrationLocked}
                        style={{ flex: 3 }} />
                </div>

                <TextInput
                    label="Ort"
                    field={fields.location} />

                <TextArea
                    label="Beschreibung"
                    field={fields.description}
                    rows={12} />

                {/* <details>
                    <summary>Zusammenfassung der Änderungen...</summary>
                    <FormChangeSummary />
                </details> */}

                <Button
                    state={buttonState}
                    onClick={() => handleSubmit(formScope, fields, props.activity, buttonState, infoBoxState, props.rebuild)}>
                    Speichern
                </Button>

                {infoBoxState.value &&
                    <InfoBox style={infoBoxState.value.ok ? InfoBoxStyle.Success : InfoBoxStyle.Error}>
                        {infoBoxState.value.message}
                    </InfoBox>
                }

                <div>
                    <Button
                        style={{ marginTop: "1rem" }}
                        onClick={() => doRoute(location, Pages.activityDetail(props.activity.id!).path)}>
                        <i class="fa-solid fa-arrow-left" style={{ marginRight: ".5rem" }} />
                        Zurück zur Veranstaltung
                    </Button>
                </div>
            </Form>

            <ValidationSummary />
        </FormScopeProvider>
    );
}

function RecurrenceEditor(props: { fields: ReturnType<typeof setFields> }) {
    const fields = props.fields;

    return (
        <Fieldset>
            <legend>Wiederholung</legend>

            <Select
                label="Wiederholungs-Typ"
                field={fields.recurrenceFrequency}
                options={
                    [
                        ActivityRecurrenceFrequency.None,
                        ActivityRecurrenceFrequency.Weekly,
                        ActivityRecurrenceFrequency.Monthly,
                        ActivityRecurrenceFrequency.FixedDates,
                    ].map(recurrenceType => ({ value: recurrenceType, label: activityRecurrenceFrequencyToString(recurrenceType) }))
                }
                placeholder="Keine Wiederholung" />

            {fields.recurrenceFrequency.value.value != ActivityRecurrenceFrequency.None &&
                <>
                    {(fields.recurrenceFrequency.value.value == ActivityRecurrenceFrequency.Weekly) &&
                        <div style={flexRow()}>
                            <Select
                                label="Intervall"
                                field={fields.recurrenceInterval}
                                options={
                                    [
                                        { label: "Jede Woche", value: "1" },
                                        { label: "Jede zweite Woche", value: "2" },
                                        { label: "Jede dritte Woche", value: "3" },
                                        { label: "Jede vierte Woche", value: "4" },
                                    ]
                                }
                                style={{ flex: 1 }} />

                            <Select
                                label="Wochentag"
                                field={fields.raw.byDayDayOfWeek}
                                options={
                                    dayNames.map((name, dayIndex) => ({ label: name, value: Object.keys(DayOfWeek)[(dayIndex + 1) % 7]! }))
                                }
                                style={{ flex: 1 }} />
                        </div>
                    }

                    {(fields.recurrenceFrequency.value.value == ActivityRecurrenceFrequency.Monthly) &&
                        <div style={flexRow({ crossAxisAlignment: "end" })}>
                            <Select
                                label="Intervall"
                                field={fields.recurrenceInterval}
                                options={
                                    [
                                        { label: "Jeden Monat", value: "1" },
                                        { label: "Jeden zweiten Monat", value: "2" },
                                        { label: "Jeden dritten Monat", value: "3" },
                                        { label: "Jeden vierten Monat", value: "4" },
                                    ]
                                }
                                style={{ flex: 1 }} />

                            <span style={{ margin: "0 .5rem" }}>am</span>

                            <Select
                                label="Wievielten?"
                                field={fields.raw.byDayOrdinal}
                                options={
                                    [
                                        ["Ersten", 1],
                                        ["Zweiten", 2],
                                        ["Dritten", 3],
                                        ["Vierten", 4],
                                        ["Letzten", -1],
                                    ].map(x => ({ label: x[0], value: x[1] } as SelectOption))
                                }
                                style={{ flex: 1 }} />

                            <Select
                                label="Wochentag"
                                field={fields.raw.byDayDayOfWeek}
                                options={
                                    dayNames.map((dayName, dayIndex) => ({ label: dayName, value: Object.keys(DayOfWeek)[(dayIndex + 1) % 7]! }))
                                }
                                style={{ flex: 1 }} />

                        </div>
                    }

                    {(fields.recurrenceFrequency.value.value == ActivityRecurrenceFrequency.FixedDates) &&
                        <InfoBox style={InfoBoxStyle.Warning}>
                            Wiederholung an festgelegten Terminen ist noch nicht verfügbar.
                        </InfoBox>
                    }

                    <Select
                        label="Wiederholen bis"
                        field={fields.raw.recurrenceEndCondition}
                        options={[
                            { label: "Anzahl an Wiederholungen erreicht ist", value: RecurrenceEndCondition.Count },
                            { label: "Datum erreicht ist", value: RecurrenceEndCondition.DateReached },
                        ]} />

                    {fields.raw.recurrenceEndCondition.value.value == RecurrenceEndCondition.Count &&
                        <TextInput
                            type="number"
                            label="Anzahl an Wiederholungen"
                            field={fields.repeatCount} /> ||
                        <TextInput
                            type="date"
                            label="Wiederholen bis"
                            field={fields.repeatUntil} />
                    }
                </>
            }
        </Fieldset>
    );
}

async function handleSubmit(
    formScope: FormScope,
    fields: ReturnType<typeof setFields>,
    activity: ActivityDto,
    buttonState: Signal<ButtonState>,
    infoBoxState: Signal<InfoBoxState | null>,
    rebuild: () => void
) {
    // infoBoxState.value = null;

    if (await formScope.validate() == false) {
        return;
    }

    buttonState.value = ButtonState.Loading;

    const isRecurring =
        fields.recurrenceFrequency.value.peek() == ActivityRecurrenceFrequency.Weekly ||
        fields.recurrenceFrequency.value.peek() == ActivityRecurrenceFrequency.Monthly;
    const recurrenceByDay = isRecurring
        ? [{
            ordinal: fields.raw.byDayOrdinal.value.peek(),
            dayOfWeek: fields.raw.byDayDayOfWeek.value.peek(),
        } as ActivityRecurrenceByDayDto]
        : [];

    const body = {
        promoterId: activity.promoterId,
        title: fields.title.value.peek(),
        visibility: fields.visibility.value.peek(),
        category: fields.category.value.peek(),
        startTime: fields.startTime.value.peek(),
        endTime: fields.endTime.value.peek(),
        isAllDay: fields.isAllDay.value.peek(),
        maxNumberOfParticipants: fields.maxNumberOfParticipants.value.peek(),
        registrationLocked: fields.registrationLocked.value.peek(),
        location: fields.location.value.peek(),
        description: fields.description.value.peek(),

        recurrenceFrequency: fields.recurrenceFrequency.value.peek(),
        recurrenceInterval: fields.recurrenceInterval.value.peek(),
        repeatUntil: fields.repeatUntil.value.peek(),
        repeatCount: fields.repeatCount.value.peek(),

        recurrenceByDay: recurrenceByDay,
        recurrenceByMonthDay: [/* TODO */],
        recurrenceDates: [/* TODO */],
        recurrenceExceptions: [/* TODO */],
    } as AllDefined<UpdateActivityDto>;

    //infoBoxState.value = { ok: true, message: "Die Veranstaltung wurde gespeichert." }; console.debug(body); buttonState.value = ButtonState.Default; return;

    const result = await getApiResult(config => new ActivitiesApi(config).activitiesIdPut(activity.id!, body));

    switch (result.status) {
        case ResultStatus.Done:
            infoBoxState.value = { ok: true, message: "Die Veranstaltung wurde gespeichert." };
            rebuild();
            break;

        case ResultStatus.Failed:
            infoBoxState.value = { ok: false, message: "Es gab einen Fehler beim Speichern der Veranstaltung.", };
            break;
    }

    buttonState.value = ButtonState.Default;
}

function setFields(scope: FormScope, activity: ActivityDto, currentUserId: string) {
    // TODO: Handle optionality more consistently
    // TODO: It would be kind of cool if the end time was automatically copied from the start time plus some amount of time if the end time has not been set previously
    const fc = fieldConfigs;
    const fields = {
        title: scope.set(
            fc.string,
            activity.title!,
            "title",
            "Titel"
        ),
        visibility: scope.set(
            fc.makeEnum(Object.values(ActivityVisibility)),
            activity.visibility!,
            "visibility",
            "Sichtbarkeit"
        ),
        category: scope.set(
            fc.makeEnum(Object.values(ActivityCategory)),
            activity.category!,
            "category",
            "Kategorie"
        ),
        startTime: scope.set(
            fc.date,
            activity.startTime!,
            "startTime",
            "Startzeit"
        ),
        endTime: scope.set(
            fc.date,
            activity.endTime!,
            "endTime",
            "Endzeit"
        ),
        isAllDay: scope.set(
            fc.boolean,
            activity.isAllDay!,
            "isAllDay",
            "Ganztägig"
        ),
        maxNumberOfParticipants: scope.set(
            fc.optionalInt,
            activity.maxNumberOfParticipants ?? 1,
            "maxNumberOfParticipants",
            "Anzahl freie Plätze"
        ),
        registrationLocked: scope.set(
            fc.boolean,
            activity.registrationLocked!,
            "registrationLocked",
            "Anmeldung sperren"
        ),
        location: scope.set(
            fc.string,
            activity.location!,
            "location",
            "Ort"
        ),
        description: scope.set(
            fc.string,
            activity.description!,
            "description",
            "Beschreibung"
        ),

        recurrenceFrequency: scope.set(
            fc.string,
            activity.recurrenceFrequency!,
            "recurrenceFrequency",
            "Wiederholungs-Frequenz"
        ),
        recurrenceInterval: scope.set(
            fc.optionalInt,
            activity.recurrenceInterval ?? null,
            "recurrenceInterval",
            "Wiederholungs-Intervall"
        ),
        repeatUntil: scope.set(
            fc.optionalDateOnly,
            activity.repeatUntil ?? null,
            "repeatUntil",
            "Ende der Wiederholung"
        ),
        repeatCount: scope.set(
            fc.optionalInt,
            activity.repeatCount ?? null,
            "repeatCount",
            "Anzahl der Widerholungen"
        ),

        // TODO: Make it possible to validate array members, like by setting the path to "some.path.array[].member" or create a new FormScope with the DTO
        raw: {
            byDayOrdinal: scope.set(
                fc.int,
                (activity.recurrenceByDay ?? [])[0]?.ordinal ?? 0,
                "$byDayOrdinal",
                "Ordinal"
            ),
            byDayDayOfWeek: scope.set(
                fc.makeEnum(Object.values(DayOfWeek)),
                (activity.recurrenceByDay ?? [])[0]?.dayOfWeek ?? DayOfWeek.Monday,
                "$byDayDayOfWeek",
                "Wochentag"
            ),
            recurrenceEndCondition: scope.set(
                fc.makeEnum(Object.values(RecurrenceEndCondition)),
                activity.repeatCount != null ? RecurrenceEndCondition.Count : RecurrenceEndCondition.DateReached,
                "$recurrenceEndMode",
                "Bedingung für Wiederholungs-Ende"
            ),
        },
    }

    fields.visibility.validators = [
        field => {
            if (activity.createdById != currentUserId && field.value.peek() == ActivityVisibility.PrivateDraft) {
                return ["Nur der Autor der Veranstaltung darf die Sichtbarkeit auf diesen Wert ändern."];
            }

            return [];
        }
    ];

    // TODO: The error does not go away when the end date is fixed. We should introduce some way to tell the form scope
    // that the validator of one field depends on the value of another field.
    fields.startTime.validators = [
        field => {
            if (field.value.peek().valueOf() > fields.endTime.value.peek().valueOf()) {
                return ["Der Startzeitpunkt muss vor dem Endzeitpunkt liegen."];
            }

            return [];
        }
    ];

    // Reset the recurrence fields to sensible defaults when the frequency is modified
    fields.recurrenceFrequency.value.subscribe(frequency => {
        console.debug("Recurrence interval is", fields.recurrenceInterval.value.peek());

        if (frequency != ActivityRecurrenceFrequency.Weekly && frequency != ActivityRecurrenceFrequency.Monthly) {
            fields.recurrenceInterval.setValue(null);
            fields.repeatUntil.setValue(null);
            fields.repeatCount.setValue(null);

            fields.raw.byDayOrdinal.setValue(1);
            fields.raw.byDayDayOfWeek.setValue(DayOfWeek.Monday);

            fields.raw.byDayOrdinal.customConstraints.value = [];
            fields.raw.byDayDayOfWeek.customConstraints.value = [];
            return;
        }

        // Reset recurrenceInterval
        if (fields.recurrenceInterval.value.peek() == null) {
            fields.recurrenceInterval.setValue(1);
        }

        // Reset repeatCount and repeatUntil
        if (fields.raw.recurrenceEndCondition.value.peek() == RecurrenceEndCondition.Count) {
            fields.repeatUntil.setValue(null);
            if (fields.repeatCount.value.peek() == null) {
                fields.repeatCount.setValue(10);
            }
        } else {
            fields.repeatCount.setValue(null);
            if (fields.repeatUntil.value.peek() == null) {
                fields.repeatUntil.setValue(dateToDateOnly(new Date(new Date().valueOf() + new Date(1971, 0, 1).valueOf())));
            }
        }

        // Reset by day ordinal and day of week
        if (frequency == ActivityRecurrenceFrequency.Monthly) {
            if ([null, 0].includes(fields.raw.byDayOrdinal.value.peek())) {
                fields.raw.byDayOrdinal.setValue(1);
            }

            if (fields.raw.byDayDayOfWeek.value.peek() == null) {
                fields.raw.byDayDayOfWeek.setValue(DayOfWeek.Monday);  // TODO: Use the day of week of the start time
            }
        } else if (frequency == ActivityRecurrenceFrequency.Weekly) {
            fields.raw.byDayOrdinal.setValue(0);

            if (fields.raw.byDayDayOfWeek.value.peek() == null) {
                fields.raw.byDayDayOfWeek.setValue(DayOfWeek.Monday);  // TODO: Use the day of week of the start time
            }
        }

        // Validation constraints of by day fields
        fields.raw.byDayOrdinal.customConstraints.value = [
            { type: ValidationConstraintType.Required, constraint: {} as RequiredConstraint }
        ];
        fields.raw.byDayDayOfWeek.customConstraints.value = [
            { type: ValidationConstraintType.Required, constraint: {} as RequiredConstraint }
        ];
    });

    // Keep the validation constraints up to date
    effect(() => {
        const frequency = fields.recurrenceFrequency.value.value;
        const endCondition = fields.raw.recurrenceEndCondition.value.value;

        if (frequency != ActivityRecurrenceFrequency.Weekly && frequency != ActivityRecurrenceFrequency.Monthly) {
            fields.repeatCount.customConstraints.value = [];
            fields.repeatUntil.customConstraints.value = [];
            return;
        }

        switch (endCondition) {
            case RecurrenceEndCondition.Count: {
                fields.repeatCount.customConstraints.value = [{ type: ValidationConstraintType.Required, constraint: {} }];
                fields.repeatUntil.customConstraints.value = [];
            } break;

            case RecurrenceEndCondition.DateReached: {
                fields.repeatUntil.customConstraints.value = [{ type: ValidationConstraintType.Required, constraint: {} }];
                fields.repeatCount.customConstraints.value = [];
            } break;
        }
    });

    return fields;
}
