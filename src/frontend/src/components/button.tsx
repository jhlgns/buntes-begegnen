import { buttonStyle } from "@bb/style/button";
import { Theme } from "@bb/style/theme";
import { readValue, Signalish } from "@bb/util/signal";
import { ComponentChildren } from "preact";
import { CSSProperties } from "preact/compat";

export enum ButtonState {
    Default,
    Loading,
    Success,
    Disabled,
}

export function Button(props: {
    onClick: () => void,
    state?: Signalish<ButtonState>,
    children: ComponentChildren,
    style?: CSSProperties,
}) {
    const state = readValue(props.state ?? ButtonState.Default);

    return (
        <button
            onClick={(e) => { e.preventDefault(); props.onClick(); }}
            style={{
                ...buttonStyle,
                ...(state == ButtonState.Success) && {  // TODO: Comparing signal and enum?
                    color: Theme.success.fg,
                    backgroundColor: Theme.success.bg,
                },
                ...props.style,
            }}
            disabled={state == ButtonState.Loading || state == ButtonState.Disabled}>
            {state == ButtonState.Loading &&
                <i class="fa-solid fa-circle-notch fa-spin" style={{ marginRight: ".5rem" }}></i>
            }
            {state == ButtonState.Success &&
                <i class="fa-solid fa-check" style={{ marginRight: ".5rem" }}></i>
            }
            {props.children}
        </button>
    );
}
