import { Theme } from "@bb/style/theme";
import { ComponentChildren } from "preact";

export enum InfoBoxStyle {
    Information,
    Success,
    Warning,
    Error,
}

export function InfoBox(props: { title?: string, children: ComponentChildren, style?: InfoBoxStyle }) {
    const [title, fg, bg, iconClass] = new Map([
        [InfoBoxStyle.Information, ["Info", Theme.info.fg, Theme.info.bg, "fa-circle-info"]],
        [InfoBoxStyle.Success, ["Erfolg", Theme.success.fg, Theme.success.bg, "fa-circle-check"]],
        [InfoBoxStyle.Warning, ["Warnung", Theme.warning.fg, Theme.warning.bg, "fa-circle-exclamation"]],
        [InfoBoxStyle.Error, ["Fehler", Theme.error.fg, Theme.error.bg, "fa-circle-exclamation"]],
    ]).get(props.style ?? InfoBoxStyle.Information)!;

    return (
        <fieldset
            style={{
                color: fg,
                backgroundColor: bg,
                padding: "1rem",
                margin: "1rem 0rem",
                border: `1px solid ${fg}`,
                borderRadius: Theme.borderRadius,
            }}>
            <legend>
                <i
                    class={`fa-solid ${iconClass}`}
                    style={{ paddingRight: ".5rem", }} />
                {props.title ?? title}
            </legend>
            {props.children}
        </fieldset>
    );
}