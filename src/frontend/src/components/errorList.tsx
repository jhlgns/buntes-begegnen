import { IField } from "@bb/field";
import { formScopeContext } from "@bb/formScope";
import { Theme } from "@bb/style/theme";
import { ReadonlySignal } from "@preact/signals";
import { useContext } from "preact/hooks";

// Simple error list with <ul> style
export function ErrorList(props: { title?: string, errors: string[] }) {
    if (props.errors.length == 0) {
        return <></>;
    }

    return (
        <div style={{
            color: Theme.error.fg,
            backgroundColor: Theme.error.bg,
            border: `1px solid ${Theme.error.border}`,
            padding: ".75rem",
        }}>
            <span>{props.title ?? "Fehler"}:</span>
            <ul>
                {props.errors.map(x => (
                    <li>{x}</li>
                ))}
            </ul>
        </div>
    );
}

// Simple list with <small> entries
export function FieldValidationErrorList(props: { errors: ReadonlySignal<string[]> }) {
    if (props.errors.value.length == 0) {
        return <></>;
    }

    return (
        <div style={{ color: Theme.error.fg }}>
            <div>
                {props.errors.value.map(x => (
                    <div><small>{x}</small></div>
                ))}
            </div>
        </div>
    );
}

// Sophisticated list that allows jumping to each field with an error, also displaying the displayName of the field if it is set
export function ValidationSummary(props: { title?: string }) {
    const formScope = useContext(formScopeContext);
    if (formScope == null) {
        throw new Error("ValidationSummary requires a FormScope parent context");
    }

    const fieldsWithErrors = Array.from(formScope.fieldsByPath.values()).filter(x => x.validationErrors.value.length > 0);
    if (fieldsWithErrors.length == 0) {
        return <></>;
    }

    function handleClick(field: IField) {
        if (field.inputId != null) {
            document.getElementById(field.inputId)!.scrollIntoView({ behavior: "smooth" });
        }
    }

    return (
        <div style={{
            color: Theme.error.fg,
            backgroundColor: Theme.error.bg,
            border: `1px solid ${Theme.error.border}`,
            padding: ".75rem",
            marginTop: "1rem",
        }}>
            <span>{props.title ?? "Fehler"}:</span>
            <ul>
                {fieldsWithErrors.map(field => (
                    field.validationErrors.value.map(error => (
                        <li onClick={() => handleClick(field)}>
                            {field.displayName != null && <>{field.displayName}: </>}
                            {error}
                        </li>
                    ))
                ))}
            </ul>
        </div>
    );
}