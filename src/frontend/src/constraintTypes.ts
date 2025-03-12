export interface ChildObjectConstraint {
    readonly type: string;
}

export interface RequiredConstraint {
    readonly errorMessage?: string;  // TODO: The backend does not know about strings, if at all, this should be an well known error code which gets localized
}

export interface StringLengthConstraint {
    readonly minLength: number;
    readonly maxLength: number;
    readonly errorMessageFormat?: string;
}

export interface RegularExpressionConstraint {
    readonly pattern: string;
    readonly errorMessage: string;
}

export interface PasswordConstraint {
    readonly requiredLength: number;
    readonly requiredUniqueChars: number;
    readonly requireNonAlphanumeric: boolean;
    readonly requireLowercase: boolean;
    readonly requireUppercase: boolean;
    readonly requireDigit: boolean;
}

export interface RangeConstraint {
    readonly minimum: any;
    readonly maximum: any;
}

// TODO: Ensure easy language and use the provided errorMessageFormats

export const validationConstraintErrorMessages = {
    required: "Dieses Feld muss ausgefüllt werden.",
    stringLength: {
        withMinLength: "Dieses Feld muss zwischen {MinLength} und {MaxLength} Zeichen lang sein.",
        withoutMinLength: "Dieses Feld darf höchstens {MaxLength} Zeichen lang sein.",
        format: (constraint: StringLengthConstraint, message: string) => message
            .replace("{MinLength}", constraint.minLength.toString())
            .replace("{MaxLength}", constraint.maxLength.toString())
    },
    password: {
        requiredLengthNotMet: "Das Passwort muss mindestens {RequiredLength} Zeichen lang sein.",
        requiredUniqueCharsNotMet: "Das Passwort muss aus mindestens {RequiredUniqueChars} unterschiedlichen Zeichen bestehen.",
        requiredNonAlphanumericNotMet: "Das Passwort muss mindestens ein Sonderzeichen beinhalten.",
        requiredLowercaseNotMet: "Das Passwort muss mindestens einen Kleinbuchstaben beinhalten.",
        requiredUppercaseNotMet: "Das Passwort muss mindestens einen Großbuchstaben beinhalten.",
        requiredDigitNotMet: "Das Passwort muss mindestens eine Ziffer (0-9) beinhalten.",
        format: (constraint: PasswordConstraint, message: string) => message
            .replace("{RequiredLength}", constraint.requiredLength.toString())
            .replace("{RequiredUniqueChars}", constraint.requiredUniqueChars.toString()),
    },
    range: {
        minimumValueSubceeded: "Dieser Wert muss mindestens {Minimum} betragen.",
        maximumValueExceeded: "Dieser Wert darf höchstens {Maximum} betragen.",
        format: (constraint: RangeConstraint, message: string) => message
            .replace("{Minimum}", constraint.minimum.toString())
            .replace("{Maximum}", constraint.maximum.toString())
    },
}