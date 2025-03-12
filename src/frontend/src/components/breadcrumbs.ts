import { Breadcrumb } from "@bb/components/pageInfo";
import { Pages } from "@bb/pages";

export const breadcrumbs = {
    homePage: {
        title: "Startseite",
        path: Pages.home().path,
    } as Breadcrumb,
    activityList: {
        title: "Veranstaltungen",
        path: Pages.activityList().path,
    } as Breadcrumb,
    activityDetail: (id: number, title: string) => ({
        title: title,
        path: Pages.activityDetail(id).path,
    } as Breadcrumb),
    activityEditor: (id: number) => ({
        title: "Bearbeiten",
        path: Pages.activityEditor(id).path,
    }) as Breadcrumb,
    contact: {
        title: "Kontakt",
        path: Pages.contact().path,
    } as Breadcrumb,
    about: {
        title: "Über das Projekt",
        path: Pages.contact().path,
    } as Breadcrumb,
    profile: {
        title: "Mein Profil",
        path: Pages.profile().path,
    } as Breadcrumb,
    login: {
        title: "Anmeldung",
        path: Pages.login().path,
    } as Breadcrumb,
    registration: {
        title: "Registrierung",
        path: Pages.registration().path,
    } as Breadcrumb,
    admin: {
        title: "ADMINISTRATION",
        path: Pages.admin().path,
    } as Breadcrumb,
    debug: {
        title: "DEBUG",
        path: Pages.debug().path,
    } as Breadcrumb,
    notFound: {
        title: "Seite nicht gefunden",
        path: Pages.notFound().path,
    } as Breadcrumb,
};

export const breadcrumbStrings = {
    homePage: [
        breadcrumbs.homePage,
    ],
    activityList: [
        breadcrumbs.homePage,
        breadcrumbs.activityList,
    ],
    activityDetail: (id: number, title: string) => [
        breadcrumbs.homePage,
        breadcrumbs.activityList,
        breadcrumbs.activityDetail(id, title),
    ],
    activityEditor: (id: number, title: string) => [
        breadcrumbs.homePage,
        breadcrumbs.activityList,
        breadcrumbs.activityDetail(id, title),
        breadcrumbs.activityEditor(id),
    ],
    contact: [
        breadcrumbs.homePage,
        breadcrumbs.contact,
    ],
    about: [
        breadcrumbs.homePage,
        breadcrumbs.about,
    ],
    profile: [
        breadcrumbs.homePage,
        breadcrumbs.profile,
    ],
    login: [
        breadcrumbs.homePage,
        breadcrumbs.login,
    ],
    registration: [
        breadcrumbs.homePage,
        breadcrumbs.registration,
    ],
    admin: [
        breadcrumbs.homePage,
        breadcrumbs.admin,
    ],
    debug: [
        breadcrumbs.homePage,
        breadcrumbs.debug,
    ],
    notFound: [
        breadcrumbs.homePage,
        breadcrumbs.notFound,
    ],
    veryLongDebug: [
        breadcrumbs.debug,
        breadcrumbs.debug,
        breadcrumbs.debug,
        breadcrumbs.debug,
        breadcrumbs.debug,
        breadcrumbs.debug,
        breadcrumbs.debug,
        breadcrumbs.debug,
        breadcrumbs.debug,
        breadcrumbs.debug,
        breadcrumbs.debug,
        breadcrumbs.debug,
    ],
}
