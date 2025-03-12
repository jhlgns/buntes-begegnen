import { ActivityCategory, ActivityRecurrenceFrequency, ActivityVisibility } from "bundlor-web-api-client";

export function activityVisibilityToString(visibility: ActivityVisibility) {
    switch (visibility) {
        case ActivityVisibility.PrivateDraft: return "Nur ich";
        case ActivityVisibility.SharedDraft: return "Nur Teammitglieder";
        case ActivityVisibility.Public: return "Öffentlich";
        default: console.error("Unknown activity visibility:", visibility); return "(Unbekannte Sichtbarkeit)";
    }
}

export function activityCategoryToString(category: ActivityCategory) {
    switch (category) {
        case ActivityCategory.Excursion: return "Ausflüge";
        case ActivityCategory.Creativity: return "Kreativität"
        case ActivityCategory.Exercise: return "Bewegung";
        default: console.error("Unknown activity category:", category); return "(Unbekannte Kategorie)";
    }
}

export function activityRecurrenceFrequencyToString(frequency: ActivityRecurrenceFrequency) {
    switch (frequency) {
        case ActivityRecurrenceFrequency.None: return "(Keine Wiederholung)";
        case ActivityRecurrenceFrequency.Weekly: return "Wöchentlich";
        case ActivityRecurrenceFrequency.Monthly: return "Monatlich";
        case ActivityRecurrenceFrequency.FixedDates: return "An festgelegten Terminen";
        default: console.error("Unknown activity recurrence type:", frequency); return "(Unbekannter Wiederholungs-Typ)";
    }
}