import { dateToLocalString, pad2 } from "@bb/l10n/date";
import { computed, effect, ReadonlySignal, signal, Signal } from "@preact/signals";
import { FieldValidationConstraintDto } from "bundlor-web-api-client";

export interface ValidationAttributes {
    required?: boolean;
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
};

export interface IField {
    readonly path?: string,
    readonly displayName?: string,
    inputId?: string;
    originalValue: string;
    inputValue: Signal<string>;
    valueWasCaptured: boolean;
    customConstraints: Signal<FieldValidationConstraintDto[]>;
    formScopeEventsSubscribed: boolean;
    readonly validationErrors: Signal<string[]>;
    readonly validationAttributes: Signal<ValidationAttributes>;

    getValidators(): ((field: IField) => string[])[];
}

export interface IFieldConfig<T> {
    deserialize(serializedValue: string): T;
    serialize(value: T): string;
}

export class Field<T> implements IField {
    public constructor(
        public readonly config: IFieldConfig<T>,
        initialValue: T,
        public readonly path?: string,
        public readonly displayName?: string,
    ) {
        const initial = this.config.serialize(initialValue);
        this.originalValue = initial;
        this.inputValue = signal(initial);

        this.value = computed(() => this.config.deserialize(this.inputValue.value));
    }

    public inputId?: string | undefined;
    public originalValue: string;
    public readonly inputValue: Signal<string>;
    public readonly value: ReadonlySignal<T>;
    public valueWasCaptured = false;
    public validators: ((field: Field<T>) => string[])[] = [];
    public readonly customConstraints = signal<FieldValidationConstraintDto[]>([]);
    public formScopeEventsSubscribed = false;
    public validationErrors = signal<string[]>([]);
    public validationAttributes = signal<ValidationAttributes>({});

    public getValidators(): ((field: IField) => string[])[] {
        return this.validators.map(validator =>
            (field: IField) => { return validator(field as Field<T>) }
        );
    }

    public setValue(value: T): void {
        const serializedValue = this.config.serialize(value);
        this.inputValue.value = serializedValue;
    }

    public reset(): void {
        console.log("Reset field", this.path);
        this.inputValue.value = this.originalValue;
    }

    public readValue(): T {
        const serializedValue = this.inputValue.value;
        return this.config.deserialize(serializedValue);
    }

    public peekValue(): T {
        const serializedValue = this.inputValue.peek();
        return this.config.deserialize(serializedValue);
    }
}

//
// StringField
//

class StringFieldConfig implements IFieldConfig<string> {
    public deserialize(serializedValue: string): string {
        return serializedValue;
    }

    public serialize(value: string): string {
        return value;
    }
}

//
// IntField
//

class IntFieldConfig implements IFieldConfig<number> {
    public deserialize(serializedValue: string): number {
        var result = Number.parseInt(serializedValue);
        if (Number.isNaN(result)) {
            throw Error("Value could not be parsed to integer");
        }

        return result;
    }

    public serialize(value: number): string {
        return value.toString();
    }
}

class OptionalIntFieldConfig implements IFieldConfig<number | null> {
    public deserialize(serializedValue: string): number | null {
        var result = Number.parseInt(serializedValue);
        if (Number.isNaN(result)) {
            return null;
        }

        return result;
    }

    public serialize(value: number | null): string {
        if (value == null || Number.isNaN(value)) {
            return "";
        }

        return value.toString();
    }
}

//
// FloatField
//

class FloatFieldConfig implements IFieldConfig<number> {
    public deserialize(serializedValue: string): number {
        var result = Number.parseFloat(serializedValue);
        if (Number.isNaN(result)) {
            throw Error("Value could not be parsed to float");
        }

        return result;
    }

    public serialize(value: number): string {
        return value.toString();
    }
}

class OptionalFloatFieldConfig implements IFieldConfig<number | null> {
    public deserialize(serializedValue: string): number | null {
        var result = Number.parseFloat(serializedValue);
        if (Number.isNaN(result)) {
            return null;
        }

        return result;
    }

    public serialize(value: number | null): string {
        return value?.toString() ?? "";
    }
}

//
// BooleanField
//

class BooleanFieldConfig implements IFieldConfig<boolean> {
    public deserialize(serializedValue: string): boolean {
        return serializedValue == "true";
    }

    public serialize(value: boolean): string {
        return value ? "true" : "false";
    }
}

class OptionalBooleanFieldConfig implements IFieldConfig<boolean | null> {
    public deserialize(serializedValue: string): boolean | null {
        if (serializedValue == "") {
            return null;
        }

        return serializedValue == "true";
    }

    public serialize(value: boolean | null): string {
        return value?.toString() ?? "";
    }
}

//
// DateField
//

class DateFieldConfig implements IFieldConfig<Date> {
    public deserialize(serializedValue: string): Date {
        if (serializedValue == "") {
            throw Error("Invalid date value");
        }

        return new Date(serializedValue);
    }

    public serialize(value: Date): string {
        return dateToLocalString(value);
    }
}

class OptionalDateFieldConfig implements IFieldConfig<Date | null> {
    public deserialize(serializedValue: string): Date | null {
        if (serializedValue == "") {
            return null;
        }

        return new Date(serializedValue);
    }

    public serialize(value: Date | null): string {
        if (value == null) {
            return "";
        }

        return dateToLocalString(value);
    }
}

//
// DateOnlyField
//

class OptionalDateOnlyField implements IFieldConfig<string | null> {
    public deserialize(serializedValue: string): string | null {
        if (serializedValue == "") {
            return null;
        }

        return serializedValue;
    }

    public serialize(value: string | null): string {
        if (value == null) {
            return "";
        }

        const [year, month, day] = value.split("-").map(x => Number.parseInt(x ?? ""));
        if ([year, month, day].some(Number.isNaN)) {
            return "";
        }

        return `${year}-${pad2(month!)}-${pad2(day!)}`;
    }
}

//
// EnumField
//

class EnumField implements IFieldConfig<string> {
    public constructor(
        public readonly allowedValues: string[],
    ) {
    }

    public deserialize(serializedValue: string): string {
        if (this.allowedValues.includes(serializedValue) == false) {
            throw new Error("Allowed values does not contain value " + serializedValue);
        }

        return serializedValue;
    }

    public serialize(value: string): string {
        return value;
    }
}

export const fieldConfigs = {
    string: new StringFieldConfig(),
    float: new FloatFieldConfig(),
    optionalFloat: new OptionalFloatFieldConfig(),
    int: new IntFieldConfig(),
    optionalInt: new OptionalIntFieldConfig(),
    boolean: new BooleanFieldConfig(),
    optionalboolean: new OptionalBooleanFieldConfig(),
    date: new DateFieldConfig(),
    optionalDate: new OptionalDateFieldConfig(),
    optionalDateOnly: new OptionalDateOnlyField(),
    makeEnum(allowedValues: string[]) {
        return new EnumField(allowedValues);
    },
};
