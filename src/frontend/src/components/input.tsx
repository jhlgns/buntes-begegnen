import { FieldValidationErrorList } from "@bb/components/errorList";
import { IField } from "@bb/field";
import { formScopeContext } from "@bb/formScope";
import { buttonStyle } from "@bb/style/button";
import { flexColumn, flexRow } from "@bb/style/util";
import { useComputed } from "@preact/signals";
import { ComponentChildren } from "preact";
import { CSSProperties, TargetedEvent } from "preact/compat";
import { useId, useContext } from "preact/hooks";

export function Checkbox(
    props: {
        label?: ComponentChildren | string,
        field: IField,
        style?: CSSProperties,
    }
) {
    props.field.inputId = useId();

    function handleChange(e: TargetedEvent<HTMLInputElement>) {
        props.field.inputValue.value = (e.target as HTMLInputElement).checked ? "true" : "false";
    }

    const checked = useComputed(() => props.field.inputValue.value == "true");

    return (
        <div
            style={{
                ...flexColumn({ crossAxisAlignment: "start" }),
                ...props.style,
            }}>
            <div
                style={{
                    ...flexRow({ mainAxisAlignment: "start", gap: ".5rem" }),
                    paddingBottom: "0.25rem",  // NOTE: This aligns more nicely with text inputs in rows
                }}>
                <input
                    id={props.field.inputId}
                    type="checkbox"
                    checked={checked}
                    onChange={handleChange}
                    style={{
                        padding: ".25rem",
                    }} />
                <label for={props.field.inputId}>
                    {props.label}
                </label>
            </div>

            <FieldValidationErrorList errors={props.field.validationErrors} />
        </div >
    );
}

export function TextInput(
    props: {
        type?: string,  // TODO: Make specialized components instead of letting the user pass the type manually
        label?: string | ComponentChildren,
        field: IField,
        placeholder?: string,
        style?: CSSProperties,
    }
) {
    props.field.inputId = useId();
    const formScope = useContext(formScopeContext);

    function handleChange(value: string, capture: boolean) {
        props.field.inputValue.value = value;

        const shouldValidate = capture || props.field.valueWasCaptured;
        if (formScope != null && props.field.path != null && shouldValidate) {
            formScope.validate(new Set<string>([props.field.path]));
            props.field.valueWasCaptured = true;
        }
    }

    return (
        <div
            style={{
                ...flexColumn({ crossAxisAlignment: "stretch" }),
                ...props.style,
            }}>
            <label for={props.field.inputId}>
                <small>{props.label}</small>
                {props.field.validationAttributes.value.required &&
                    <RequiredAsterisk />
                }
            </label>
            <input
                id={props.field.inputId}
                type={props.type ?? "text"}
                value={props.field.inputValue}
                placeholder={props.placeholder}
                onChange={e => handleChange(e.currentTarget.value, false)}
                onChangeCapture={e => handleChange(e.currentTarget.value, true)}
                style={{
                    padding: ".25rem",
                    width: "100%",
                    minWidth: 0,
                    ...(props.type == "submit") && { ...buttonStyle },
                }}
                {...props.field.validationAttributes.value} />

            <FieldValidationErrorList errors={props.field.validationErrors} />
        </div>
    );
}

export function TextArea(
    props: {
        label?: string | ComponentChildren,
        field: IField,
        rows?: number,
        style?: CSSProperties,
    }
) {
    props.field.inputId = useId();
    const formScope = useContext(formScopeContext);

    function handleChange(value: string, capture: boolean) {
        props.field.inputValue.value = value;

        const shouldValidate = capture || props.field.valueWasCaptured;
        if (formScope != null && props.field.path != null && shouldValidate) {
            formScope.validate(new Set<string>([props.field.path]));
            props.field.valueWasCaptured = true;
        }
    }

    return (
        <div
            style={{
                ...flexColumn({ crossAxisAlignment: "stretch" }),
                ...props.style,
            }}>
            <label for={props.field.inputId}>
                <small>{props.label}</small>
                {props.field.validationAttributes.value.required &&
                    <RequiredAsterisk />
                }
            </label>
            <textarea
                id={props.field.inputId}
                value={props.field.inputValue}
                onChange={e => handleChange(e.currentTarget.value, false)}
                onChangeCapture={e => handleChange(e.currentTarget.value, true)}
                style={{
                    padding: ".25rem",
                    width: "100%",
                    minWidth: 0,
                }}
                rows={props.rows}
                {...props.field.validationAttributes.value} />

            <FieldValidationErrorList errors={props.field.validationErrors} />
        </div>
    );
}

export type SelectOption = {
    value: string;
    label: string;
};

export function Select(
    props: {
        label?: string | ComponentChildren,
        field: IField,
        options: SelectOption[],
        placeholder?: string,
        style?: CSSProperties,
    }
) {
    props.field.inputId = useId();
    const formScope = useContext(formScopeContext);

    function handleChange(value: string) {
        props.field.inputValue.value = value;

        if (formScope != null && props.field.path != null) {
            formScope.validate(new Set<string>([props.field.path]));
            props.field.valueWasCaptured = true;
        }
    }

    return (
        <div
            style={{
                ...flexColumn({ crossAxisAlignment: "stretch" }),
                ...props.style,
            }}>
            <label for={props.field.inputId}>
                <small>{props.label}</small>
                {props.field.validationAttributes.value.required &&
                    <RequiredAsterisk />
                }
            </label>
            <select
                id={props.field.inputId}
                value={props.field.inputValue}
                placeholder={props.placeholder}
                onChange={e => handleChange(e.currentTarget.value)}
                style={{
                    padding: ".25rem",
                    width: "100%",
                    minWidth: 0,
                }}
                {...props.field.validationAttributes.value}>
                {props.options.map(option => (
                    <option value={option.value}>{option.label}</option>
                ))}
            </select>

            <FieldValidationErrorList errors={props.field.validationErrors} />
        </div>
    );
}

function RequiredAsterisk() {
    return (
        <span style={{
            //color: Colors.invalid.fg,
            //fontWeight: "bold",
            marginLeft: ".2rem",
        }}>
            *
        </span>
    );
}