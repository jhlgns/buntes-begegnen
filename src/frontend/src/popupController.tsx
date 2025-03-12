import { Theme } from "@bb/style/theme";
import { flexColumn, flexRow } from "@bb/style/util";
import { signal } from "@preact/signals";
import { createContext } from "preact";
import { useContext } from "preact/hooks";
import { JSX } from "preact/jsx-runtime";

// TODO: Maybe it should prevent scrolling the background of the popup

export interface PopupAction {
    label: string;
    color: string;
    action: () => void;
}

export interface Popup {
    content: JSX.Element | string;
    onClose?: () => void;
    actions?: PopupAction[];
}

export class PopupController {
    public readonly currentPopup = signal<Popup | null>(null);
}

export const popupControllerContext = createContext(new PopupController());

export function PopupRoot() {
    const controller = useContext(popupControllerContext);

    const popup = controller.currentPopup.value;
    if (popup == null) {
        return <></>;
    }

    function handleClose() {
        console.debug("handleClose");

        if (popup!.onClose != null) {
            popup!.onClose();
        }

        controller.currentPopup.value = null;
    }

    const body = (
        <div
            style={{
                ...flexColumn({ gap: "1rem" }),
                padding: "3rem",
                //backgroundColor: Colors.popup.contentBg,
                textAlign: "center",
            }}
            onClick={e => e.stopPropagation()}>
            {popup.content}

            {popup.actions != null &&
                <div style={flexRow({ gap: "1rem", wrap: true })}>
                    {popup.actions.map(x => (
                        <a
                            style={{
                                color: Theme.default.fg,
                                backgroundColor: x.color,
                                padding: "1rem",
                                textDecoration: "none",
                            }}
                            href="#"
                            onClick={(e) => { e.preventDefault(); x.action(); handleClose(); }}>
                            {x.label}
                        </a>
                    ))}
                </div>
            }
        </div>
    );

    return (
        <div
            style={{
                ...flexRow(),
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: Theme.popup.bg,
            }}
            onClick={handleClose}>
            <div
                style={{
                    backgroundColor: Theme.popup.contentBg,
                    position: "relative",
                    zIndex: 100,
                }}>
                <a
                    style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        margin: 0,
                        padding: ".2rem .4rem",
                        zIndex: 101,
                        color: "inherit",
                        fontSize: "1.5rem",
                    }}
                    href="#"
                    onClick={e => { e.preventDefault(); handleClose() }}>
                    <i class="fa-solid fa-circle-xmark" />
                </a>

                {body}
            </div>
        </div>
    );
}