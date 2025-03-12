import { apiMetadataProviderContext } from "@bb/apiMetadataProvider";
import { Button } from "@bb/components/button";
import { Footer } from "@bb/components/footer";
import { Header } from "@bb/components/header";
import { InfoBox, InfoBoxStyle } from "@bb/components/infoBox";
import { setupPageInfo, BreadcrumbsDisplay, QuakePanelRoot } from "@bb/components/pageInfo";
import { Pages } from "@bb/pages";
import { NotFoundPage } from "@bb/pages/_404Page";
import { AboutPage } from "@bb/pages/aboutPage";
import { ActivityDetailPage } from "@bb/pages/activityDetailPage";
import { ActivityEditorPage } from "@bb/pages/activityEditorPage";
import { ActivityListPage } from "@bb/pages/activityListPage";
import { AdminPage } from "@bb/pages/adminPage";
import { ChangePasswordPage } from "@bb/pages/changePasswordPage";
import { ContactPage } from "@bb/pages/contactPage";
import { DebugPage } from "@bb/pages/debugPage";
import { HomePage } from "@bb/pages/homePage";
import { LoginPage } from "@bb/pages/loginPage";
import { ProfilePage } from "@bb/pages/profilePage";
import { RegistrationPage } from "@bb/pages/registrationPage";
import { PopupRoot } from "@bb/popupController";
import { centeredContent } from "@bb/style/layout";
import { flexColumn } from "@bb/style/util";
import { userInfoProviderContext } from "@bb/userInfoProvider";
import { useSignal, useSignalEffect } from "@preact/signals";
import { render, ContainerNode } from "preact";
import { useContext } from "preact/hooks";
import { Route, Router } from "preact-iso";
import { LocationProvider } from "preact-iso";
import { setupPageBlocker } from "@bb/pageBlocker";

import "@bb/style.css"

// new EventSource('/esbuild').addEventListener('change', () => location.reload())

export function App() {
    const apiMetadataProvider = useContext(apiMetadataProviderContext);
    const userInfoProvider = useContext(userInfoProviderContext);

    const previewModeAckValue = useSignal(localStorage.getItem("previewModeAcknowledged"));
    useSignalEffect(() => {
        const value = previewModeAckValue.value;
        if (value != null) {
            localStorage.setItem("previewModeAcknowledged", value);
        } else {
            localStorage.removeItem("previewModeAcknowledged");
        }
    });

    var previewModeAckDate = previewModeAckValue.value == null ? null : new Date(previewModeAckValue.value);
    const previewModeAcknowledged =
        previewModeAckDate != null &&
        new Date().valueOf() - previewModeAckDate.valueOf() < new Date(1970, 0, 2).valueOf()

    try {
        apiMetadataProvider.ensureMetadata().catch();
        userInfoProvider.ensureUserInfo({ expectAuthenticationError: true }).catch();
    } catch { }

    setupPageInfo();
    setupPageBlocker();

    return (
        <LocationProvider>
            <Header />
            <main
                style={{
                    ...flexColumn({ crossAxisAlignment: "stretch" }),
                    ...centeredContent(),
                    padding: "2rem .3rem 5rem .3rem",
                }}>
                <BreadcrumbsDisplay />

                {apiMetadataProvider.apiReachable.value == false &&
                    <InfoBox style={InfoBoxStyle.Warning}>
                        <em>Der Server ist nicht erreichbar.</em><br />
                        Wahrscheinlich wurde er absichtlich vom Administrator offline geschaltet.<br />
                        Die Seite funktioniert gerade nicht, weil keine Daten abgerufen oder gesendet werden können.<br />
                    </InfoBox>
                }

                {apiMetadataProvider.previewModeEnabled.value && previewModeAcknowledged == false &&
                    <InfoBox style={InfoBoxStyle.Warning}>
                        <div>
                            Die Plattform befindet sich im Vorschau-Modus.
                            Das heißt, dass alle Daten, die eingegeben und gespeichert werden, ohne Vorwarnung in unregelmäßigen Abständen gelöscht werden.
                        </div>
                        <Button onClick={() => previewModeAckValue.value = new Date().toISOString()}>
                            Verstanden
                        </Button>
                    </InfoBox>
                }

                <Router>
                    <Route path={Pages.home().path} component={HomePage} />
                    <Route path={Pages.about().path} component={AboutPage} />
                    <Route path={Pages.contact().path} component={ContactPage} />
                    <Route path={Pages.registration().path} component={RegistrationPage} />
                    <Route path={Pages.login().path} component={LoginPage} />
                    <Route path={Pages.changePassword().path} component={ChangePasswordPage} />
                    <Route path={Pages.profile().path} component={ProfilePage} />
                    <Route path={Pages.activityList().path} component={ActivityListPage} />
                    <Route path={Pages.activityDetail().template} component={ActivityDetailPage} />
                    <Route path={Pages.activityEditor().template} component={ActivityEditorPage} />
                    <Route path={Pages.admin().path} component={AdminPage} />
                    <Route path={Pages.debug().path} component={DebugPage} />
                    <Route default component={NotFoundPage} />
                </Router>
            </main>
            <Footer />
            <PopupRoot />
            <QuakePanelRoot />
        </LocationProvider>
    );
}

render(<App />, document.getElementById('app') as ContainerNode);

