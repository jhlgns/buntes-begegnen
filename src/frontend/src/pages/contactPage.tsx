import { breadcrumbStrings } from "@bb/components/breadcrumbs";
import { ContactForm } from "@bb/components/contactForm";
import { usePageInfo } from "@bb/components/pageInfo";

export function ContactPage() {
    usePageInfo({ breadcrumbs: breadcrumbStrings.contact });

    return (
        <>
            <h1>Nimm Kontakt zu uns auf!</h1>
            <ContactForm />
        </>
    );
}
