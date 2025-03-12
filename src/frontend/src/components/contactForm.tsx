import { getApiResult, ResultStatus } from "@bb/api";
import { ButtonState, Button } from "@bb/components/button";
import { ValidationSummary } from "@bb/components/errorList";
import { Fieldset } from "@bb/components/fieldset";
import { Form } from "@bb/components/form";
import { InfoBox, InfoBoxStyle } from "@bb/components/infoBox";
import { TextInput, Select, TextArea } from "@bb/components/input";
import { RequiredConstraint } from "@bb/constraintTypes";
import { fieldConfigs } from "@bb/field";
import { useFormScope, FormScopeProvider } from "@bb/formScope";
import { Theme } from "@bb/style/theme";
import { flexColumn } from "@bb/style/util";
import { useSignal } from "@preact/signals";
import { InquiryType, ValidationConstraintType, CreateInquiryDto, InquiryApi } from "bundlor-web-api-client";

export function ContactForm() {
    const [formScope, fields] = useFormScope(
        "CreateInquiryDto",
        (scope) => {
            const fields = {
                emailAddress: scope.set(fieldConfigs.string, "", "emailAddress", "Deine E-Mail Adresse"),
                type: scope.set(fieldConfigs.string, InquiryType.ActivitySuggestion, "type", "Betreff"),
                message: scope.set(fieldConfigs.string, "", "message", "Inhalt der Nachricht"),
                isAnonymous: scope.set(fieldConfigs.boolean, false, "isAnonymous", "Nachricht anonym senden"),  // TODO
            };

            // TODO: Only if user is not logged in
            fields.emailAddress.customConstraints.value = [
                {
                    type: ValidationConstraintType.Required,
                    constraint: {} as RequiredConstraint,
                }
            ];

            return fields;
        },
        [],
    );

    const infoBoxState = useSignal<{ ok: boolean, message: string } | null>(null);
    const buttonState = useSignal<ButtonState>(ButtonState.Default);

    async function handleSubmit() {
        if (await formScope.validate() == false) {
            return;
        }

        const inquiry = {
            emailAddress: fields.emailAddress.value.peek(),
            type: fields.type.value.peek(),
            message: fields.message.value.peek(),
            isAnonymous: fields.isAnonymous.value.peek(),
        } as CreateInquiryDto;

        infoBoxState.value = null;
        buttonState.value = ButtonState.Loading;
        const result = await getApiResult(config => new InquiryApi(config).inquiryPost(inquiry));
        buttonState.value = ButtonState.Default;

        switch (result.status) {
            case ResultStatus.Done:
                infoBoxState.value = {
                    ok: true,
                    message: "Vielen Dank für die Nachricht! Wir werden uns bald bei Dir melden."
                };
                formScope.resetFieldsToOriginalValues();
                break;

            case ResultStatus.Failed:
                infoBoxState.value = {
                    ok: false,
                    message: "Ups, da ist ein Fehler passiert. Melde dich bitte über die oben angegebenen Kontaktinformationen."
                };
                break;
        }
    }

    return (
        <FormScopeProvider scope={formScope}>
            <div style={flexColumn({ crossAxisAlignment: "stretch", gap: "1rem" })}>
                <Fieldset style={{ color: Theme.pink.fg, backgroundColor: Theme.pink.bg }}>
                    <legend>Initiator:</legend>
                    <p>Buntes Begegnen - Stephanie Wilkens</p>
                    <p>Erbacher Str. 17, 64287 Darmstadt</p>
                    <p>Telefon: <a href="tel:+49 (0)171 3148387">+49 (0)171 3148387</a></p>
                    <p>E-Mail: <a href="mailto:Projekt.BuntesBegegnen@nrd.de">Projekt.BuntesBegegnen@nrd.de</a></p>  {/* TODO: Dafuer gibt es eigentlich API Metadaten, die wir hier einfuegen koennten */}
                </Fieldset>

                <Form title="Kontakt">
                    {/* TODO: Only if user is not logged in */}
                    <TextInput
                        type="email"
                        label="Deine E-Mail-Adresse"
                        field={fields.emailAddress} />

                    <Select
                        label="Betreff"
                        field={fields.type}
                        options={[
                            { value: InquiryType.ActivitySuggestion, label: "Eine Idee für eine Veranstaltung" },
                            { value: InquiryType.PlatformSuggestion, label: "Eine Idee für die Internet-Plattform" },
                            { value: InquiryType.General, label: "Etwas anderes" },
                        ]} />

                    <TextArea
                        label="Deine Nachricht"
                        field={fields.message}
                        rows={5} />

                    <Button onClick={handleSubmit} state={buttonState.value}>Absenden</Button>

                    <ValidationSummary />

                    {infoBoxState.value != null &&
                        <InfoBox style={infoBoxState.value.ok ? InfoBoxStyle.Success : InfoBoxStyle.Error}>
                            {infoBoxState.value.message}
                        </InfoBox>
                    }
                </Form>
            </div>
        </FormScopeProvider>
    );
}
