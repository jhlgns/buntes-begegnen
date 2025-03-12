import { getApiResult, ResultStatus } from "@bb/api";
import { apiMetadataProviderContext } from "@bb/apiMetadataProvider";
import { breadcrumbStrings } from "@bb/components/breadcrumbs";
import { Button } from "@bb/components/button";
import { ValidationSummary, FieldValidationErrorList } from "@bb/components/errorList";
import { Form } from "@bb/components/form";
import { Checkbox, TextInput } from "@bb/components/input";
import { usePageInfo } from "@bb/components/pageInfo";
import { RequiredConstraint } from "@bb/constraintTypes";
import { fieldConfigs } from "@bb/field";
import { useFormScope, FormScopeProvider, FormScope } from "@bb/formScope";
import { Pages } from "@bb/pages";
import { popupControllerContext, PopupController } from "@bb/popupController";
import { Theme } from "@bb/style/theme";
import { flexColumn, displayInlineFlex } from "@bb/style/util";
import { userInfoProviderContext, UserInfoProvider } from "@bb/userInfoProvider";
import { AllDefined } from "@bb/util/types";
import { ValidationConstraintType, CreateUserDto, RegistrationRequestDto, AccountApi, ApiException, RegistrationErrorDto } from "bundlor-web-api-client";
import { LocationHook, useLocation } from "preact-iso";
import { useContext } from "preact/hooks";

// TODO: Ensure easy language
// TODO: Custom validation to check if E-Mail is taken or free

export function RegistrationPage() {
    usePageInfo({ breadcrumbs: breadcrumbStrings.registration });

    const location = useLocation();
    const userInfoProvider = useContext(userInfoProviderContext);
    const popupController = useContext(popupControllerContext);
    const apiMetadataProvider = useContext(apiMetadataProviderContext);

    const [formScope, fields] = useFormScope(
        "RegistrationRequestDto",
        (scope) => createFields(scope, apiMetadataProvider.registrationPasswordRequired.value),
        [apiMetadataProvider.registrationPasswordRequired.value],
    );

    return (
        <FormScopeProvider scope={formScope}>
            <div style={flexColumn({ crossAxisAlignment: "stretch", gap: "2rem" })}>
                <h1>Registrierung</h1>
                <DataPrivacy />
                <Intentions />
                <PersonalData />
                <ContactData />
                <Password />
                <PreviewModePassword />
                <Finalize onSubmit={() => handleSubmit(formScope, fields, userInfoProvider, popupController, location)} />
                <ValidationSummary title="Da stimmt etwas noch nicht:" />
            </div>
        </FormScopeProvider>
    );

    function DataPrivacy() {
        return (
            <Form title="Datenschutzbestimmungen">
                <span>
                    Du musst zuerst die <em>Daten·schutz·bestimmungen</em> lesen und ihnen zustimmen.<br />
                    Hier kannst du sie lesen: <a href={Pages.privacy().path} target="_blank">Daten·schutz·bestimmungen</a>.
                    Wir teilen Deine Daten mit niemandem.
                </span>
                <Checkbox
                    label="Datenschutzbestimmungen annehmen"
                    field={fields.dataPrivacyPolicyAccepted} />
            </Form>
        );
    }

    function Intentions() {
        return (
            <Form title="Deine Ziele">
                <b>Ich möchte...</b>
                <Checkbox
                    label={<>...Bei Veranstaltungen <em>teilnehmen</em></>}
                    field={fields.wantsToParticipate} />
                <Checkbox
                    label={<>...Veranstaltungen <em>anbieten</em></>}
                    field={fields.wantsToPromote} />
                <Checkbox
                    label={<>...Veranstaltungen <em>begleiten</em></>}
                    field={fields.wantsToAccompany} />
                <Checkbox
                    label={<>...Klienten vertreten</>}
                    field={fields.wantsToDelegate} />

                <FieldValidationErrorList errors={fields.intentions.validationErrors} />
            </Form>
        );
    }

    function PersonalData() {
        return (
            <Form title="Persönliche Daten">
                <TextInput
                    label="Vorname"
                    field={fields.firstName} />

                <TextInput
                    label="Nachname"
                    field={fields.lastName} />

                <TextInput
                    type="date"
                    label="Geburtstag"
                    field={fields.birthDay} />
            </Form>
        );
    }

    function ContactData() {
        return (
            <Form title="Kontaktdaten">
                <TextInput
                    label="E-Mail-Adresse"
                    type="email"
                    field={fields.email} />

                <TextInput
                    label="Telefonnummer"
                    type="tel"
                    field={fields.phoneNumber} />

                <div
                    style={{
                        ...displayInlineFlex({
                            direction: "row",
                            crossAxisAlignment: "start",
                            gap: ".75rem",
                        }),
                    }}>
                    <TextInput
                        label="Straße"
                        style={{ flex: "3", }}
                        field={fields.streetName} />

                    <TextInput
                        label="Hausnummer"
                        style={{ flex: "1", }}
                        field={fields.houseNumber} />
                </div>

                <div
                    style={{
                        ...displayInlineFlex({
                            direction: "row",
                            crossAxisAlignment: "start",
                            gap: ".75rem",
                        }),
                    }}>
                    <TextInput
                        label="PLZ"
                        style={{ flex: "1", }}
                        field={fields.zipCode} />

                    <TextInput
                        label="Stadt"
                        style={{ flex: "2", }}
                        field={fields.city} />
                </div>
            </Form>
        );
    }

    function Password() {
        return (
            <Form title="Passwort">
                Bitte lege nun ein sicheres Passwort fest.
                {/* TODO: Hier auch die Option, sich nur per E-Mail einzuloggen? */}

                <TextInput
                    type="password"
                    label="Passwort"
                    field={fields.password} />
                <TextInput
                    type="password"
                    label="Passwort wiederholen"
                    field={fields.passwordConfirmation} />
            </Form>
        );
    }

    function PreviewModePassword() {
        const requiresPassword =
            // apiMetadataProvider.previewModeEnabled.value &&
            apiMetadataProvider.registrationPasswordRequired.value;
        if (requiresPassword == false) {
            return <></>;
        }

        return (
            <Form title="Vorschaumodus-Passwort">
                Der Vorschaumodus ist aktiviert. Bitte gibt hier das Passwort ein, welches du vom Administrator erhalten hast, um dich zu registrieren.
                <TextInput
                    type="password"
                    label="Vorschaumodus-Passwort"
                    field={fields.previewModePassword} />
            </Form>
        );
    }

    function Finalize(props: { onSubmit: () => void, }) {
        return (
            <Form title="Fertig?">
                <p>
                    Die Felder, die mit <q>*</q> markiert sind, musst du ausfüllen, um dich zu registrieren.
                </p>
                <p>
                    <em>Fertig?</em> Dann kannst du jetzt absenden und dein Profil erstellen.
                </p>

                {/* TODO: Set ButtonState */}
                <Button onClick={props.onSubmit}>
                    Absenden
                </Button>
            </Form>
        );
    }
}

function createFields(formScope: FormScope, previewModePasswordRequired: boolean) {
    const fc = fieldConfigs;
    const fields = {
        dataPrivacyPolicyAccepted: formScope.set(fc.boolean, false, "$dataPrivacyPolicyAccepted", "Datenschutzvereinbarung"),
        wantsToParticipate: formScope.set(fc.boolean, false, "$wantsToParticipate"),  // TODO: Not used yet
        wantsToPromote: formScope.set(fc.boolean, false, "$wantsToPromote"),  // TODO: Not used yet
        wantsToAccompany: formScope.set(fc.boolean, false, "$wantsToAccompany"),  // TODO: Not used yet
        wantsToDelegate: formScope.set(fc.boolean, false, "$wantsToDelegate"),  // TODO: Not used yet
        intentions: formScope.set(fc.boolean, false, "$intentions"),

        firstName: formScope.set(fc.string, "", "account.firstName", "Vorname"),
        lastName: formScope.set(fc.string, "", "account.lastName", "Nachname"),
        birthDay: formScope.set(fc.optionalDateOnly, "", "account.birthDay", "Geburtstag"),
        streetName: formScope.set(fc.string, "", "account.streetName", "Straße"),
        houseNumber: formScope.set(fc.string, "", "account.houseNumber", "Hausnummer"),
        zipCode: formScope.set(fc.string, "", "account.zipCode", "Postleitzahl"),
        city: formScope.set(fc.string, "", "account.city", "Stadt"),
        email: formScope.set(fc.string, "", "account.email", "E-Mail-Adresse"),
        phoneNumber: formScope.set(fc.string, "", "account.phoneNumber", "Telefonnummer"),
        password: formScope.set(fc.string, "", "password", "Passwort"),
        passwordConfirmation: formScope.set(fc.string, "", "$passwordConfirmation", "Passwortbestätigung"),
        previewModePassword: formScope.set(fc.string, "", "previewModePassword", "Passwort für den Vorschau-Modus"),
    };

    fields.dataPrivacyPolicyAccepted.validators = [
        field => {
            if (field.value.peek() !== true) {
                return ["Bitte ließ und akzeptiere die Datenschutzbestimmungen."];
            }

            return [];
        }
    ];

    fields.intentions.validators = [
        field => {
            const intentionChosen = [
                fields.wantsToParticipate,
                fields.wantsToPromote,
                fields.wantsToAccompany,
                fields.wantsToDelegate,
            ].some(x => x.value.peek() === true);

            if (intentionChosen === false) {
                return ["Bitte wähle aus, wofür du dich registrieren möchtest."];
            }

            return [];
        }];

    fields.passwordConfirmation.validators = [
        field => {
            if (field.value.peek() !== fields.password.value.peek()) {
                return ["Die Passwörter müssen gleich sein."];
            }

            return [];
        }
    ];

    if (previewModePasswordRequired) {
        fields.previewModePassword.customConstraints.value = [
            {
                type: ValidationConstraintType.Required,
                constraint: {} as RequiredConstraint,
            }
        ];
    }

    return fields;
}

// TODO: UserInfoProvider and PopupController should not be passed to this method, should it?
async function handleSubmit(formScope: FormScope, fields: ReturnType<typeof createFields>, userInfoProvider: UserInfoProvider, popupController: PopupController, location: LocationHook): Promise<void> {
    if (await formScope.validate() == false) {
        return;
    }

    const request = {
        account: {
            firstName: fields.firstName.value.peek(),
            lastName: fields.lastName.value.peek(),
            birthDay: fields.birthDay.value.peek(),
            streetName: fields.streetName.value.peek(),
            houseNumber: fields.houseNumber.value.peek(),
            zipCode: fields.zipCode.value.peek(),
            city: fields.city.value.peek(),
            email: fields.email.value.peek(),
            phoneNumber: fields.phoneNumber.value.peek(),
        } as CreateUserDto,
        password: fields.password.value.peek(),
        previewModePassword: fields.previewModePassword.value.peek(),
    } as AllDefined<RegistrationRequestDto>;

    console.log("Submitting registration request:", { formScope, request });

    const result = await getApiResult(
        config => new AccountApi(config).accountRegisterPost(request),
    );

    if (result.status == ResultStatus.Failed) {
        const exception = result.error as ApiException<RegistrationErrorDto>;
        if (exception.body.errors?.some(x => x == "DuplicateEmail")) {
            fields.email.validationErrors.value = [
                "Diese E-Mail ist bereits registriert. Bitte verwende eine andere."
            ];

            return;
        }

        await new Promise<void>(resolve => {
            popupController.currentPopup.value = {
                content: (
                    <>
                        <p>Es gab einen Fehler beim Registrieren.</p>
                        <p>Bitte schreib uns eine Nachricht mit dem Fehler.</p>
                        {/* TODO: Prefill the contact form with a useful message */}
                    </>
                ),
                onClose: resolve,
                actions: [
                    {
                        label: "Zum Kontaktformular",
                        color: Theme.info.bg,
                        action: () => location.route(Pages.contact().path),
                    },
                ]
            };
        });

        return;
    }

    await userInfoProvider.ensureUserInfo({ force: true });

    popupController.currentPopup.value = {
        content: (
            <em>Herzlich willkommen bei Buntes Begegnen, {userInfoProvider.userInfo.value?.account.firstName ?? "???"}!</em>
            // TODO: Here we could defintiely do more than this
        ),
        actions: [
            {
                label: "Zur Startseite",
                color: Theme.success.bg,
                action: () => location.route(Pages.home().path),
            }
        ],
    };
}
