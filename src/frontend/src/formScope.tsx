import { ApiMetadataProvider, apiMetadataProviderContext } from "@bb/apiMetadataProvider";
import { StringLengthConstraint, RangeConstraint, ChildObjectConstraint, RequiredConstraint, validationConstraintErrorMessages, RegularExpressionConstraint, PasswordConstraint } from "@bb/constraintTypes";
import { Field, IField, IFieldConfig, ValidationAttributes } from "@bb/field";
import { FieldValidationConstraintDto, TypeConstraintsDto, ValidationConstraintType } from "bundlor-web-api-client";
import { createContext, ComponentChildren } from "preact";
import { Inputs, useContext, useState, useMemo } from "preact/hooks";

// TODO: Think about how DateOnly etc. can be validated
// TODO: Warn about fields of the type constraint map (or rather full type metadata?) that are not present
// TODO: If a field has a string length constraint with minLength > 0 and is also required, a validation error should not be shown twice.

// TODO: Handle nullability consistently

export class FormScope {
    public constructor(
        private readonly _apiMetadataProvider: ApiMetadataProvider,
        private readonly _type: string,
    ) {
        _apiMetadataProvider.constraintsByType.subscribe(constraintsByType => {
            for (const field of this._fieldsByPath.values()) {
                this.updateValidationAttributes(field, constraintsByType);
            }
        });
    }

    private readonly _fieldsByPath = new Map<string, IField>();
    public get fieldsByPath() { return this._fieldsByPath as ReadonlyMap<string, IField>; }

    public readonly fieldChangedListeners: ((field: IField) => void)[] = [];

    // TODO: Run the signal updates as batch()?
    // TODO: Do we need to peek() or does this even make a difference here? -> batch()?
    // TODO: Also set the attributes on the fields

    // If the field does not exist, it is created. This method is idempotent.
    public set<T>(
        config: IFieldConfig<T>,
        initialValue: T,
        path: string,
        displayName?: string,
    ): Field<T> {

        let field = this._fieldsByPath.get(path) as Field<T> | undefined;
        if (field == null) {
            field = new Field<T>(config, initialValue, path, displayName);
            this._fieldsByPath.set(path, field);
        } else {
            field.setValue(initialValue);
        }

        field.originalValue = field.inputValue.peek();

        const updateFieldAttributes = () => {
            this._apiMetadataProvider.ensureMetadata().then(() => {
                const constraintsByType = this._apiMetadataProvider.constraintsByType.peek();
                if (constraintsByType != null) {
                    this.updateValidationAttributes(field, constraintsByType);
                }
            });
        }

        updateFieldAttributes();

        if (field.formScopeEventsSubscribed == false) {
            field.customConstraints.subscribe(updateFieldAttributes);

            field.inputValue.subscribe(value => {
                for (const listener of this.fieldChangedListeners) {
                    listener(field);
                }
            });

            field.formScopeEventsSubscribed = true;
        }

        return field;
    }

    public anyFieldWasChanged(): boolean {
        for (const field of this._fieldsByPath.values()) {
            if (field.inputValue.peek() !== field.originalValue) {
                return true;
            }
        }

        return false;
    }

    public resetFieldsToOriginalValues(): void {
        for (const field of this.fieldsByPath.values()) {
            field.inputValue.value = field.originalValue;
        }
    }

    public async validate(paths?: Set<string>): Promise<boolean> {
        // TODO: Run the signal updates as batch()?
        // TODO: Do we need to peek() or does this even make a difference here?

        await this._apiMetadataProvider.ensureMetadata();
        const constraintsByType = this._apiMetadataProvider.constraintsByType.peek();
        if (constraintsByType == null) {
            return true;
        }

        let hasError = false;

        for (const [path, field] of this._fieldsByPath.entries()) {
            if (paths != null && paths.has(path) == false) {
                continue;
            }

            field.valueWasCaptured = true;  // Field should be validated immediately next time
            field.validationErrors.value = [];

            // First check against the constraints of the type and the custom constraints
            const constraints = [
                ...getConstraintsByPath(path, this._type, constraintsByType),
                ...field.customConstraints.peek(),
            ];

            if (constraints.length == 0 && path.startsWith("$") == false) {
                console.warn("Field", field, "has no metadata constraints");
            }

            for (const constraint of constraints) {
                const handler = validationHandlersByConstraintType.get(constraint.type!);
                if (handler == null) {
                    console.warn("Unrecognized validation constraint type", constraint.type);
                    continue;
                }

                const errors = handler(field, constraint.constraint);
                if (errors.length == 0) {
                    continue;
                }

                hasError = true;
                field.validationErrors.value = [
                    ...field.validationErrors.peek(),
                    ...errors,
                ];
            }

            // Then check the extra validators of the field
            for (const validator of field.getValidators()) {
                const errors = validator(field);  // NOTE: Cannot have extra validators for child object fields
                if (errors.length == 0) {
                    continue;
                }

                hasError = true;
                field.validationErrors.value = [
                    ...field.validationErrors.peek(),
                    ...errors,
                ];
            }
        }

        console.debug("Validation succeeded:", hasError == false);

        return hasError == false;
    }

    private updateValidationAttributes(field: IField, constraintsByType: Map<string, TypeConstraintsDto> | null): void {
        field.validationAttributes.value = {};
        if (field.path == null || constraintsByType == null) {
            return;
        }

        const constraints = [
            ...getConstraintsByPath(field.path, this._type, constraintsByType),
            ...field.customConstraints.peek(),
        ];

        const attributes = {} as ValidationAttributes;

        for (const constraint of constraints) {
            if (constraint.type == ValidationConstraintType.StringLength) {
                const c = constraint.constraint as StringLengthConstraint;
                attributes.minLength = c.minLength;
                attributes.maxLength = c.maxLength;

                if (c.minLength != 0) {
                    attributes.required = true;
                }

                continue;
            }

            if (constraint.type == ValidationConstraintType.Required) {
                attributes.required = true;
            }

            if (constraint.type == ValidationConstraintType.Range) {
                const c = constraint.constraint as RangeConstraint;
                attributes.min = c.minimum;
                attributes.max = c.maximum;
            }
        }

        field.validationAttributes.value = attributes;
    }
}

export const formScopeContext = createContext<FormScope | null>(null);

export function useFormScope<TFields>(type: string, setFields: (scope: FormScope) => TFields, fieldInputs: Inputs): [FormScope, TFields] {
    const apiMetadataProvider = useContext(apiMetadataProviderContext);
    apiMetadataProvider.ensureMetadata();

    const [scope, _] = useState(new FormScope(apiMetadataProvider, type));
    const fields = useMemo(() => setFields(scope), fieldInputs);

    return [scope, fields];
}

export function FormScopeProvider(props: { scope: FormScope, children: ComponentChildren }) {
    return (
        <formScopeContext.Provider value={props.scope}>
            {props.children}
        </formScopeContext.Provider>
    );
}

//
// Internal
//

function getConstraintsByPath(path: string, type: string, constraints: ReadonlyMap<string, TypeConstraintsDto>): FieldValidationConstraintDto[] {
    const segments = path.split(".");
    const fieldName = segments[0]!;

    const typeConstraints = constraints.get(type);
    if (typeConstraints == null) {
        throw Error("Could not find the constraints for type " + type);
    }

    const fieldConstraints = typeConstraints.fields![fieldName];
    if (fieldConstraints == null) {
        return [];
    }

    if (segments.length > 1) {
        console.assert(fieldConstraints.length == 1);
        console.assert(fieldConstraints[0]!.type == ValidationConstraintType.ChildObject);

        const childObjectConstraint = fieldConstraints[0]!.constraint as ChildObjectConstraint;
        return getConstraintsByPath(segments.splice(1).join("."), childObjectConstraint.type, constraints);
    }

    return fieldConstraints;
}

//
// Constraint validation callbacks
//

function validateRequired(field: IField, constraint: any): string[] {
    const value = field.inputValue.peek();
    const c = constraint as RequiredConstraint;

    if (value == null || (typeof value === "string" && (value as string).length == 0)) {  // TODO Trim whitespace?
        return [c.errorMessage ?? validationConstraintErrorMessages.required];
    }

    return []
}

function validateStringLength(field: IField, constraint: any): string[] {
    const value = field.inputValue.peek();
    if (typeof value !== "string") {
        console.warn("validateStringLength: The value is not a string but", typeof value);
        return [];
    }

    const c = constraint as StringLengthConstraint;

    const lengthIsValid = value.length >= c.minLength && value.length <= c.maxLength;
    if (lengthIsValid) {
        return [];
    }

    const defaultMessage = c.minLength > 0
        ? validationConstraintErrorMessages.stringLength.withMinLength
        : validationConstraintErrorMessages.stringLength.withoutMinLength;
    const message = c.errorMessageFormat ?? defaultMessage;

    const formatted = validationConstraintErrorMessages.stringLength.format(c, message);

    return [formatted];
}

function validateRegularExpression(field: IField, constraint: any): string[] {
    const value = field.inputValue.peek();
    if (typeof value !== "string") {
        console.warn("validateRegularExpression: The value is not a string but", typeof value);
        return [];
    }

    // NOTE: Allow empty strings because this is not the [Required] attribute
    if (value === "") {
        return [];
    }

    const c = constraint as RegularExpressionConstraint;

    const matches = value.match(c.pattern);
    if (matches?.length != 1 || matches[0].length != value.length) {
        return [c.errorMessage];
    }

    return [];
}

function validatePassword(field: IField, constraint: any): string[] {
    const value = field.inputValue.peek();
    if (typeof value !== "string") {
        throw Error("validatePassword: The value is not a string but " + typeof value);
    }

    const c = constraint as PasswordConstraint;

    const errors = [] as string[];

    if (value.length < c.requiredLength) {
        const error = validationConstraintErrorMessages.password.format(c, validationConstraintErrorMessages.password.requiredLengthNotMet);
        errors.push(error);
    }

    const uniqueChars = new Set(value).size;
    if (uniqueChars < c.requiredUniqueChars) {
        const error = validationConstraintErrorMessages.password.format(c, validationConstraintErrorMessages.password.requiredUniqueCharsNotMet);
        errors.push(error);
    }

    if (c.requireNonAlphanumeric && (value.match(/(?!\w)./g)?.length ?? 0) < 1) {
        const error = validationConstraintErrorMessages.password.format(c, (validationConstraintErrorMessages.password.requiredNonAlphanumericNotMet));
        errors.push(error);
    }

    const hasLowerCase = (value.match(/[a-z]/g)?.length ?? 0) >= 1;
    if (c.requireLowercase && hasLowerCase == false) {
        const error = validationConstraintErrorMessages.password.format(c, (validationConstraintErrorMessages.password.requiredLowercaseNotMet));
        errors.push(error);
    }

    const hasUpperCase = (value.match(/[A-Z]/)?.length ?? 0) >= 1;
    if (c.requireUppercase && hasUpperCase == false) {
        const error = validationConstraintErrorMessages.password.format(c, (validationConstraintErrorMessages.password.requiredUppercaseNotMet));
        errors.push(error);
    }

    const hasDigit = (value.match(/[0-9]/)?.length ?? 0) >= 1;
    if (c.requireDigit && hasDigit == false) {
        const error = validationConstraintErrorMessages.password.format(c, validationConstraintErrorMessages.password.requiredDigitNotMet);
        errors.push(error);
    }

    return errors;
}

function validateRange(field: IField, constraint: any): string[] {
    const value = field.inputValue.peek();
    // TODO: Somehow this should also support Dates and so on

    if (value == null) {
        return [];
    }

    if (typeof value !== "string") {
        console.debug("value:", value);
        throw Error("validateRange: expected a string, got " + typeof value);
    }

    const numberValue = parseFloat(value);
    if (Number.isNaN(numberValue)) {
        console.warn("validateRange: could not parse the value", value, "to float");
        return [];
    }

    const errors = [] as string[];

    const c = constraint as RangeConstraint;
    if (value < c.minimum) {
        errors.push(validationConstraintErrorMessages.range.format(c, validationConstraintErrorMessages.range.minimumValueSubceeded));
    }

    if (value > c.maximum) {
        errors.push(validationConstraintErrorMessages.range.format(c, validationConstraintErrorMessages.range.maximumValueExceeded));
    }

    return errors;
}

const validationHandlersByConstraintType = new Map<ValidationConstraintType, (field: IField, constraint: any) => string[]>([
    [ValidationConstraintType.Required, validateRequired],
    [ValidationConstraintType.StringLength, validateStringLength],
    [ValidationConstraintType.RegularExpression, validateRegularExpression],
    [ValidationConstraintType.Password, validatePassword],
    [ValidationConstraintType.Range, validateRange],
])
