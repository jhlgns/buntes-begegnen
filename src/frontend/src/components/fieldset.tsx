import { Theme } from "@bb/style/theme";
import { RenderableProps } from "preact";
import { HTMLAttributes, CSSProperties } from "preact/compat";

export function Fieldset(props: RenderableProps<HTMLAttributes<HTMLElement>>) {
    const { style, ...notStyleProps } = props;

    return (
        <fieldset
            style={{
                color: Theme.fieldset.fg,
                backgroundColor: Theme.fieldset.bg,
                border: `1px solid ${Theme.fieldset.border}`,
                borderRadius: Theme.borderRadius,
                ...(props.style as CSSProperties),
            }}
            {...notStyleProps}>
            {props.children}
        </fieldset>
    );
}
