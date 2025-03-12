import { Pages } from "@bb/pages";
import { Theme } from "@bb/style/theme";
import { useIsLargerThanMobile } from "@bb/style/layout";
import { flexRow, flexColumn } from "@bb/style/util";
import { userInfoProviderContext } from "@bb/userInfoProvider";
import { signal } from "@preact/signals";
import { useContext } from "preact/hooks";
import { useLocation } from "preact-iso";
import { apiMetadataProvider } from "@bb/apiMetadataProvider";

import logo from "@bb/assets/images/buntes-begegnen-no-text.png"

const headerHeight = "4rem";

const menuIsOpen = signal(false);

export function Header() {
    const isLargerThanMobile = useIsLargerThanMobile();

    return (
        <header
            style={{
                height: headerHeight,
                color: Theme.header.fg,
                backgroundColor: Theme.header.bg,
            }}>
            {isLargerThanMobile &&
                <DesktopNav /> ||
                <MobileNav />
            }
        </header>
    );
}

function DesktopNav() {
    const userInfoProvider = useContext(userInfoProviderContext);

    return (
        <nav
            style={{
                ...flexRow({ crossAxisAlignment: "stretch", mainAxisAlignment: "space-between" }),
                height: "100%",
                color: Theme.blue.fgAlt,
                backgroundColor: Theme.blue.bg,
                margin: "0 2rem",
            }}>
            <div
                style={{
                    ...flexRow()
                }}>
                <a
                    href={Pages.home().path}
                    style={{
                        ...flexRow(),
                        marginLeft: "1rem"
                    }}>
                    <img src={logo} alt="Buntes Begegnen Logo" width="35" height="35" />
                </a>
                <ActivitiesLink />
                <AboutLink />
                <ContactLink />
            </div>
            <div
                style={{
                    ...flexRow(),
                    alignSelf: "flex-end",
                }}>
                {apiMetadataProvider.userInteractionEnabled.value && (
                    userInfoProvider.userInfo.value == null &&
                    <>
                        <NavLink route={Pages.login().path} title="Anmelden" />
                        <NavLink route={Pages.registration().path} title="Registrieren" />
                    </> ||
                    <>
                        <ProfileLink />
                    </>
                )}
            </div>
        </nav>
    );
}

function MobileNav() {
    return (
        <nav
            style={{
                height: "100%",
                ...flexRow({ crossAxisAlignment: "stretch", mainAxisAlignment: "space-between" })
            }}>
            <StartPageLinkWithLogo />
            <BurgerButton />
            <BurgerMenu />
        </nav>
    );

    function StartPageLinkWithLogo() {
        return (
            <a
                href={Pages.home().path}
                style={{
                    ...flexRow({ crossAxisAlignment: "stretch", mainAxisAlignment: "stretch" }),
                    padding: ".5rem",
                }}>
                <img
                    src={logo}
                    alt="Buntes Begegnen Logo" />
            </a>
        );
    }

    function BurgerButton() {
        return (
            <div
                style={{
                    padding: ".6em",
                    width: headerHeight,
                    backgroundColor: Theme.pink.bg,
                    cursor: "pointer",
                }}
                onClick={() => menuIsOpen.value = !menuIsOpen.peek()}>
                {/* TODO: Put into separate file */}
                <svg fill="#e12874" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M2,4A1,1,0,0,1,3,3H21a1,1,0,0,1,0,2H3A1,1,0,0,1,2,4Zm1,9H21a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Zm0,8H21a1,1,0,0,0,0-2H3a1,1,0,0,0,0,2Z"></path></g></svg>
            </div>
        );
    }

    function BurgerMenu() {
        const userInfoProvider = useContext(userInfoProviderContext);

        return (
            <div
                style={{
                    ...flexColumn({ mainAxisAlignment: "stretch", crossAxisAlignment: "stretch" }),
                    position: "absolute",
                    top: headerHeight,
                    width: "100%",
                    backgroundColor: Theme.pink.bg,
                    color: Theme.pink.fg,
                    zIndex: 100,
                    transform: menuIsOpen.value ? "scaleY(1)" : "scaleY(0)",
                    transformOrigin: "top",
                    //transition: "transform .2s ease-in-out",
                }}>
                <ActivitiesLink />
                <AboutLink />
                <ContactLink />

                {apiMetadataProvider.userInteractionEnabled.value && (
                    userInfoProvider.userInfo.value == null &&
                    <>
                        <NavLink route={Pages.login().path} title="Anmelden" />
                        <NavLink route={Pages.registration().path} title="Registrieren" />
                    </> ||
                    <>
                        <ProfileLink />
                    </>
                )}
            </div>
        );
    }
}

// TODO: Ugly wrap when window is small
function NavLink(props: { route: string, title: string, iconClass?: string }) {
    const location = useLocation();

    const isActive = location.path == new URL(props.route, document.baseURI).pathname;

    return (
        <a
            href={props.route}
            style={{
                padding: "1.2rem",
                color: Theme.header.fg,
                fontWeight: 500,
                textDecoration: isActive ? "underline" : "none",
            }}
            onClick={() => menuIsOpen.value = false}>
            {props.iconClass != null &&
                <i class={`fa-solid ${props.iconClass}`} style={{ marginRight: ".5rem" }} />
            }
            {props.title}
        </a>
    );
}

function ActivitiesLink() {
    return <NavLink route={Pages.activityList().path} title="Veranstaltungen" iconClass="fa-calendar-days" />;
}

function AboutLink() {
    return <NavLink route={Pages.about().path} title="Über Buntes Begegnen" iconClass="fa-info-circle" />;
}

function ContactLink() {
    return <NavLink route={Pages.contact().path} title="Kontakt" iconClass="fa-address-card" />;
}

function ProfileLink() {
    return <NavLink route={Pages.profile().path} title="Mein Profil" iconClass="fa-user" />;
}
