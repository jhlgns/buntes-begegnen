import { getApiResult } from "@bb/api";
import { breadcrumbStrings } from "@bb/components/breadcrumbs";
import { Button } from "@bb/components/button";
import { InfoBox } from "@bb/components/infoBox";
import { usePageInfo } from "@bb/components/pageInfo";
import { Pages } from "@bb/pages";
import { popupControllerContext } from "@bb/popupController";
import { Theme } from "@bb/style/theme";
import { userInfoProviderContext } from "@bb/userInfoProvider";
import { AccountApi } from "bundlor-web-api-client";
import { useLocation } from "preact-iso";
import { useContext } from "preact/hooks";

// TODO

export function ProfilePage() {
    usePageInfo({ breadcrumbs: breadcrumbStrings.profile });

    const userInfoProvider = useContext(userInfoProviderContext);
    const popupController = useContext(popupControllerContext);
    const location = useLocation();

    async function logout() {
        await getApiResult(
            config => new AccountApi(config).accountLogoutPost(),
        );

        await userInfoProvider.ensureUserInfo({ force: true, expectAuthenticationError: true });

        popupController.currentPopup.value = {
            content: <GoodbyePopup />,
            actions: [
                {
                    label: "Zur Startseite",
                    color: Theme.success.bg,
                    action: () => location.route(Pages.home().path),
                },
                {
                    label: "Erneut anmelden",
                    color: Theme.success.bg,
                    action: () => location.route(Pages.login().path),
                },
            ],
        };
    }

    return (
        <>
            <h1>Mein Profil</h1>

            <InfoBox>
                <p>
                    Diese Seite ist in Bearbeitung. Im Vorschaumodus gibt es hier noch nicht viel zu sehen.
                </p>
                <p>
                    In Zukunft kann man hier die Profilinformationen bearbeiten, die man bei der Registrierung eingegeben hat und mehr.
                </p>
            </InfoBox>

            <Button onClick={logout}>Abmelden</Button>
        </>
    );
}

// function PersonalData() {
//     return (
//         <Section label="Persönliche Daten">
//             <TextInput
//                 label="Vorname"
//                 path="account.firstName" />
//
//             <TextInput
//                 label="Nachname"
//                 path="account.lastName" />
//
//             <TextInput
//                 type="date"
//                 label="Geburtstag"
//                 path="account.birthDay" />
//         </Section>
//     );
// }
//
// function ContactData() {
//     return (
//         <Section label="Kontaktdaten">
//             <TextInput
//                 label="E-Mail-Adresse"
//                 type="email"
//                 path="account.email" />
//
//             <TextInput
//                 label="Telefonnummer"
//                 type="tel"
//                 path="account.phoneNumber" />
//
//             <div
//                 style={{
//                     ...displayInlineFlex({
//                         direction: "row",
//                         crossAxisAlignment: "start",
//                         gap: ".75rem",
//                     }),
//                 }}>
//                 <TextInput
//                     label="Straße"
//                     style={{ flex: "3", }}
//                     path="account.streetName" />
//
//                 <TextInput
//                     label="Hausnummer"
//                     style={{ flex: "1", }}
//                     path="account.houseNumber" />
//             </div>
//
//             <div
//                 style={{
//                     ...displayInlineFlex({
//                         direction: "row",
//                         crossAxisAlignment: "start",
//                         gap: ".75rem",
//                     }),
//                 }}>
//                 <TextInput
//                     label="PLZ"
//                     style={{ flex: "1", }}
//                     path="account.zipCode" />
//
//                 <TextInput
//                     label="Stadt"
//                     style={{ flex: "2", }}
//                     path="account.city" />
//             </div>
//         </Section>
//     );
// }

function GoodbyePopup() {
    return (
        <>
            <h1>Auf Wiedersehen!</h1>
            <p>Du wurdest erfolgreich abgemeldet.</p>
        </>
    );
}