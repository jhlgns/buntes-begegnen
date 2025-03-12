import { Fieldset } from "@bb/components/fieldset";
import { flexColumn } from "@bb/style/util";
import { Signalish } from "@bb/util/signal";
import { ComponentChildren } from "preact";

export function Form(props: {
    title: Signalish<string>,
    children: ComponentChildren,
    onSubmit?: () => void
}) {
    return (
        <Fieldset>
            <legend>{props.title}</legend>

            <form
                onSubmit={(e) => { e.preventDefault(); if (props.onSubmit != null) props.onSubmit(); }}
                style={{
                    ...flexColumn({ crossAxisAlignment: "stretch", gap: ".75rem" }),
                    maxWidth: "50ch",
                    marginLeft: "auto",
                    marginRight: "auto",
                }}>
                {props.children}
            </form>
        </Fieldset>
    );
}
