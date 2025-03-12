import { Theme } from "@bb/style/theme";
import { flexRow, flexColumn } from "@bb/style/util";
import { userInfoProviderContext } from "@bb/userInfoProvider";
import { readValue, Signalish } from "@bb/util/signal";
import { ReadonlySignal, signal, useSignalEffect } from "@preact/signals";
import { CSSProperties } from "preact/compat";
import { useEffect, useContext } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

export interface QuakePanel {
    title: string;
    content: JSX.Element;
}

export interface Breadcrumb {
    title: string;
    path: string;
}

export interface PageInfo {
    breadcrumbs?: Signalish<Breadcrumb[]>;  // NOTE: The title of the last breadcrumb will be in the page title  // TODO: Refactor this to not take a Signallike but Breadcrumb | (() => Breadcrumb), so that the caller can spare the useComputed()
    quakePanel?: QuakePanel;

}

class PageController {
    public constructor() {
        this.pageInfo.subscribe(() => this.quakePanelIsOpen.value = false);
    }

    public pageInfo = signal<PageInfo | null>(null);
    public readonly quakePanelIsOpen = signal(false);
}

const controller = new PageController();

export function setupPageInfo() {
    useSignalEffect(() => {
        let title: string | null = null;

        if (controller.pageInfo.value != null) {
            const breadcrumbs = readValue(controller.pageInfo.value.breadcrumbs) ?? [];

            if (breadcrumbs.length != 0) {
                title = breadcrumbs[breadcrumbs.length - 1]!.title;
            }
        }

        if (title == null) {
            document.querySelector("title")!.innerText = "Buntes Begegnen"
        } else {
            document.querySelector("title")!.innerText = `${title} - Buntes Begegnen`;
        }
    });
}

export function usePageInfo(info: PageInfo) {
    useSignalEffect(() => {
        controller.pageInfo.value = info;
        return () => controller.pageInfo.value = null;
    });
}

export function BreadcrumbsDisplay() {
    // TODO: The breadcrumbs jiggle the page a bit when switching because it apparently doesn't have them in the first frame

    if (controller.pageInfo.value == null) {
        return <></>;
    }

    const breadcrumbs = readValue(controller.pageInfo.value.breadcrumbs) ?? [];
    if (breadcrumbs.length <= 1) {
        return <></>;
    }

    return (
        <div style={flexRow({ mainAxisAlignment: "start", wrap: true })}>
            {breadcrumbs.map((breadcrumb, i) => (
                <>
                    <a
                        style={{ color: Theme.breadcrumb.fg }}
                        href={breadcrumb.path}>
                        {breadcrumb.title}
                    </a>
                    {i < breadcrumbs.length - 1 &&
                        <span
                            style={{
                                color: Theme.breadcrumb.fg,
                                margin: "0 .25rem",
                            }} >
                            &gt;
                        </span>
                    }
                </>
            ))}
        </div>
    );
}

export function QuakePanelRoot() {
    const userInfoProvider = useContext(userInfoProviderContext);

    const userInfo = userInfoProvider.userInfo.value;
    const handleIsVisible = userInfo != null &&
        userInfo.roles.includes("TeamMember");  // TODO @Hardcode
    if (handleIsVisible == false) {
        return <></>;
    }

    const panel = controller.pageInfo.value?.quakePanel;
    if (panel == null) {
        return <></>;
    }

    const baseStyle = {
        boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.266)",
        backdropFilter: "blur(1.5rem)",
        backgroundColor: "#00000099",  // TODO
    } as CSSProperties;

    return (
        <>
            {/* The handle */}
            <div
                style={{
                    ...flexRow(),
                    ...baseStyle,
                    position: "fixed",
                    right: 0,
                    top: "20%",
                    width: "2rem",
                    height: "2rem",
                    zIndex: 80,
                    padding: ".3rem",
                    cursor: "pointer",
                    //color: Colors.pink.fg,
                    //backgroundColor: Colors.pink.bg,
                    color: "white",
                    fontWeight: "bold",
                }}
                onClick={() => controller.quakePanelIsOpen.value = controller.quakePanelIsOpen.value == false}>
                {controller.quakePanelIsOpen.value
                    ? "⨯"
                    : "<<<"}
            </div>

            {controller.quakePanelIsOpen.value &&
                <div
                    style={{
                        ...flexColumn({ crossAxisAlignment: "stretch" }),
                        ...baseStyle,
                        position: "fixed",
                        right: 0,
                        top: "20%",
                        minWidth: "30vw",
                        maxHeight: "60vh",
                        padding: "1rem 1rem 3rem 1rem",
                        overflowY: "scroll",
                        //color: Colors.pink.fg,
                        //backgroundColor: Colors.pink.bg,
                    }}>
                    <h2>{panel.title}</h2>
                    {panel.content}
                </div>
            }
        </>
    );
}