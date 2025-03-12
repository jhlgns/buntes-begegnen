import { breadcrumbStrings } from "@bb/components/breadcrumbs";
import { ContactForm } from "@bb/components/contactForm";
import { usePageInfo } from "@bb/components/pageInfo";

import teamImage from "@bb/assets/images/team.jpg";
import { Theme } from "@bb/style/theme";

export function AboutPage() {
    usePageInfo({ breadcrumbs: breadcrumbStrings.about });

    return (
        <>
            TODO: Das sind wir, unser Ansatz und die Teilhabeziele aus der Praesentation
            TODO: Imagevideo hier einbetten
            TODO: Groessere Schrift (uerberall)
            <h1>Das Projekt <q>Buntes Begegnen</q></h1>

            <img
                src={teamImage}
                style={{ borderRadius: Theme.borderRadius }} />

            <p>
                Menschen brauchen andere Menschen.<br />
                Für Beziehungen.<br />
                Für Freund∙schaften.<br />
                Für ein soziales Miteinander.<br />
                Aber nur wenige Menschen mit Assistenz∙bedarf haben das.<br />
            </p>

            <p>
                Deshalb gibt es jetzt das Projekt.<br />
                Das Projekt heißt „Buntes Begegnen“.<br />
                Das Projekt möchte Nachhaltig sein.<br />
            </p>

            <p>
                Bei einem Projekt arbeiten viele Menschen zusammen.<br />
                Nach∙haltig bedeutet: Es soll lange halten.<br />
                Und viele verschiedene Träger sollen mitmachen.<br />
                Die NRD ist ein Träger.<br />
                Es gibt aber noch viele andere Träger.<br />
            </p>

            <p>
                Das Projekt ist inklusiv.<br />
                Das heißt: es können alle mitmachen.<br />
                Wir wollen viele Angebote anbieten und dabei unter∙stützen.<br />
                Und wir wollen Menschen mit Assistenz∙bedarf unterstützen,<br />
                andere Menschen kennenzulernen.<br />
            </p>

            <p>
                Das bedeutet: Freunde finden.<br />
                Oder einen Partner.<br />
                Und diese Freundschaften und Beziehungen erhalten.<br />
            </p>

            <p>
                <em>Du kannst auch mitmachen!</em>
            </p>

            <p>
                Melde dich bei uns als Teilnehmer*In, Teammitglied oder anderweitiger Unterstützer!
            </p>

            <ContactForm />
        </>
    );
}
