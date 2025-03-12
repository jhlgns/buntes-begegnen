import { getApiResult, ResultStatus } from "@bb/api";
import { breadcrumbStrings } from "@bb/components/breadcrumbs";
import { ErrorList } from "@bb/components/errorList";
import { Form } from "@bb/components/form";
import { TextInput } from "@bb/components/input";
import { usePageInfo } from "@bb/components/pageInfo";
import { fieldConfigs } from "@bb/field";
import { useFormScope, FormScopeProvider } from "@bb/formScope";
import { Pages } from "@bb/pages";
import { popupControllerContext } from "@bb/popupController";
import { buttonStyle } from "@bb/style/button";
import { Theme } from "@bb/style/theme";
import { flexColumn } from "@bb/style/util";
import { userInfoProviderContext } from "@bb/userInfoProvider";
import { useSignal } from "@preact/signals";
import { LoginRequestDto, AccountApi } from "bundlor-web-api-client";
import { useLocation } from "preact-iso";
import { useContext } from "preact/hooks";

export function LoginPage() {
    usePageInfo({ breadcrumbs: breadcrumbStrings.registration });

    const [formScope, fields] = useFormScope(
        "LoginRequestDto",
        (scope) => ({
            email: scope.set(fieldConfigs.string, "", "email", "E-Mail-Adresse"),
            password: scope.set(fieldConfigs.string, "", "password", "Passwort"),
        }),
        [],
    );

    const location = useLocation();
    const userInfoProvider = useContext(userInfoProviderContext);
    const popupController = useContext(popupControllerContext);
    const errors = useSignal<string[]>([]);

    async function handleSubmit() {
        if (await formScope.validate() == false) {
            return;
        }

        var request = {
            email: fields.email.value.peek(),
            password: fields.password.value.peek(),
        } as LoginRequestDto;

        const result = await getApiResult(
            config => new AccountApi(config).accountLoginPost(request),
        );

        console.debug("Login result:", result);

        if (result.status == ResultStatus.Failed) {
            errors.value = [
                "Anmeldung fehlgeschlagen. Bitte probiere es erneut oder setze dein Passwort zurück, wenn du es nicht mehr weißt."
            ];

            return;
        }

        console.log("Login request succeeded:", result);

        await userInfoProvider.ensureUserInfo({ force: true });

        popupController.currentPopup.value = {
            content: (
                <em>Willkommen zurück, {userInfoProvider.userInfo.value.account.firstName}!</em>
            ),
            actions: [
                {
                    label: "Zur Startseite",
                    color: Theme.success.bg,
                    action: () => location.route(Pages.home().path),
                },
            ],
        };
    }

    return (
        <FormScopeProvider scope={formScope}>
            <h1>Willkommen zurück!</h1>
            <p>
                Wenn du dich bereits registriert hast, kannst du dich hier wieder anmelden.
            </p>

            <Form
                title="Anmelden"
                onSubmit={handleSubmit}>
                <ErrorList errors={errors.value} />

                <TextInput
                    type="email"
                    label="E-Mail"
                    field={fields.email} />
                <TextInput
                    type="password"
                    label="Passwort"
                    field={fields.password} />
                <div style={flexColumn({ crossAxisAlignment: "end", gap: "1rem" })}>
                    <input
                        type="submit"
                        value="Absenden"
                        style={buttonStyle} />

                    <a href={Pages.registration().path}>
                        Du hast noch kein Konto? Hier kannst du dich <em>registrieren</em>
                    </a>
                    <a href={Pages.changePassword().path}>
                        Möchtest du das Passwort ändern oder <em>zurücksetzen</em>?
                    </a>
                </div>
            </Form>
        </FormScopeProvider>
    );
}
