import { ActivityList } from "@bb/components/activityList";
import { breadcrumbStrings } from "@bb/components/breadcrumbs";
import { Fieldset } from "@bb/components/fieldset";
import { usePageInfo } from "@bb/components/pageInfo";
import { useIsLargerThanMobile } from "@bb/style/layout";
import { displayFlex, flexColumn, flexRow } from "@bb/style/util";
import { userInfoProviderContext } from "@bb/userInfoProvider";
import { useContext } from "preact/hooks";
import { monthSpan } from "@bb/util/date";
import { InfoBox } from "@bb/components/infoBox";
import { apiMetadataProvider } from "@bb/apiMetadataProvider";

import logo from "@bb/assets/images/buntes-begegnen-no-text.png"
import instagramIconGradient from "@bb/assets/images/Instagram_Glyph_Gradient_smaller.png"
import { Theme } from "@bb/style/theme";

export function HomePage() {
    usePageInfo({ breadcrumbs: breadcrumbStrings.homePage });

    const userInfoProvider = useContext(userInfoProviderContext);
    const isLargerThanMobile = useIsLargerThanMobile();

    return (
        <>
            <div
                style={{
                    ...flexRow({ mainAxisAlignment: "start", gap: "1rem" }),
                    marginBottom: "2rem"
                }}>
                <img src={logo} alt="Buntes Begegnen Logo" width="120" height="120" />
                <h1
                    style={{
                        fontSize: isLargerThanMobile ? "2rem" : "1rem"
                    }}>
                    <strong
                        style={{
                            fontSize: "2.2em",
                        }}>
                        Buntes Begegnen
                    </strong>
                    <br />
                    {/* TODO: Stephanie's Pixelgeschubse, skaliert aber nicht */}
                    <span style={{ marginLeft: "3px", }}>
                        Inklusiv. Nachhaltig. Darmstadt.
                    </span>
                </h1>
            </div>

            <div
                style={displayFlex({
                    direction: isLargerThanMobile ? "row" : "column",
                    crossAxisAlignment: isLargerThanMobile ? "center" : "stretch",
                    gap: "1rem",
                })}>
                <Fieldset style={{ flex: 3 }}>
                    <legend>Das Projekt „Buntes Begegnen“</legend>
                    <div
                        style={flexRow({ gap: "3rem;", mainAxisAlignment: "space-between" })}>
                        <div style={{
                            fontSize: "1.2rem"
                        }}>
                            <p>Menschen brauchen andere Menschen.</p>
                            <p>Für Beziehungen.</p>
                            <p>Für Freundschaften.</p>
                            <p>Für ein soziales Mit·einander.</p>
                        </div>
                    </div>
                    <details>
                        <summary>Mehr lesen...</summary>
                        <p>
                            Menschen brauchen andere Menschen.<br />
                            Für Beziehungen.<br />
                            Für Freund·schaften.<br />
                            Für ein soziales Miteinander.<br />
                            Aber nur wenige Menschen mit Assistenz·bedarf haben das.<br />
                        </p>
                        <p>
                            Deshalb gibt es jetzt das Projekt.<br />
                            Das Projekt heißt „Buntes Begegnen“.<br />
                            Das Projekt möchte nachhaltig sein.<br />
                        </p>
                        <p>
                            Bei einem Projekt arbeiten viele Menschen zusammen.<br />
                            Nach·haltig bedeutet: Es soll lange halten.<br />
                            Und viele verschiedene Träger sollen mitmachen.<br />
                            Die NRD ist ein Träger.<br />
                            Es gibt aber noch viele andere Träger.<br />
                        </p>
                        <p>
                            Das Projekt ist inklusiv.<br />
                            Das heißt: es können alle mitmachen.<br />
                            Wir wollen viele Angebote anbieten und dabei unter·stützen.<br />
                            Und wir wollen Menschen mit Assistenz·bedarf unterstützen,<br />
                            andere Menschen kennenzulernen.<br />
                        </p>
                        <p>
                            Das bedeutet: Freunde finden.<br />
                            Oder einen Partner.<br />
                            Und diese Freundschaften und Beziehungen erhalten.<br />
                        </p>
                    </details>
                </Fieldset>

                <div
                    style={{ 
                        ...flexColumn({
                            mainAxisAlignment: "stretch",
                            gap: "2rem",
                        }),
                        flex: 1, /*backgroundColor: "#00000033", padding: "10px", borderRadius: Theme.borderRadius*/ 
                    }}>
                    <a 
                        style={{
                            backgroundColor: Theme.pink.bg,
                            //borderRadius: Theme.borderRadius,
                            padding: ".75rem",
                            textDecoration: "none",
                            color: "inherit",
                            textAlign: "center",
                            ...Theme.interactive,
                        }}
                        href="/Newsletter_Oktober-Dezember.pdf"
                        target="_blank">
                        <i class="fa-solid fa-download" style={{ marginRight: ".5rem" }}/>
                        Newsletter Oktober bis Dezember
                        <i class="fa-solid fa-file-pdf" style={{ marginLeft: ".5rem" }}/>
                    </a>
                    <a
                        href="https://www.instagram.com/buntes.begegnen/"
                        target="_blank"
                        style={{
                            ...flexColumn({ gap: "1rem" }),
                            textDecoration: "none",
                            //color: "inherit",
                            textAlign: "center",
                        }}>
                        <img
                            src={instagramIconGradient}
                            style={{ width: "5rem", height: "5rem", }} />
                        <span>
                            Wir sind auf Instagram:<br />
                            <em>@buntes.begegnen</em>
                        </span>
                    </a>
                </div>
            </div>

            {apiMetadataProvider.userInteractionEnabled.value && userInfoProvider.userInfo.value == null &&
                <InfoBox>
                    <div>
                        Hast du <em>schon ein Profil</em>? Dann kannst du dich <a href="/anmeldung"><em>anmelden</em></a>.
                    </div>
                    <div>
                        Sonst kannst du dich <a href="/registrierung"><em>registrieren</em></a>.
                    </div>
                </InfoBox>
            }

            <h2>Veranstaltungen</h2>

            <ActivityList params={{ timeSpan: monthSpan(new Date()), limit: 3 }} />
        </>
    );
}
