using BuntesBegegnen.Api.Data.Entities;
using BuntesBegegnen.Api.UserManagement;

namespace BuntesBegegnen.Api.Localization;

// TODO: Remove all strings that are no longer needed due to the new custom validation attributes

public static class Strings
{
    public static string ActivityCategory(ActivityCategory category)
        => category switch
        {
            Data.Entities.ActivityCategory.Excursion => "Ausflüge",
            Data.Entities.ActivityCategory.Creativity => "Kreativität",
            Data.Entities.ActivityCategory.Exercise => "Bewegung",
            _ => throw new ArgumentOutOfRangeException(nameof(category)),
        };

    public static string ActivityVisibility(ActivityVisibility visibility)
        => visibility switch
        {
            //Data.Entities.ActivityVisibility.AdminOnly => "Nur Administrator",
            Data.Entities.ActivityVisibility.PrivateDraft => "Privater Entwurf",
            Data.Entities.ActivityVisibility.SharedDraft => "Geteilter Entwurf",
            Data.Entities.ActivityVisibility.Public => "Öffentlich",
            _ => throw new ArgumentOutOfRangeException(nameof(visibility)),
        };

    public static string InquiryType(InquiryType type)
        => type switch
        {
            Data.Entities.InquiryType.General => "Generelle Nachricht oder Frage",
            Data.Entities.InquiryType.ActivitySuggestion => "Idee für eine Veranstaltung",
            Data.Entities.InquiryType.PlatformSuggestion => "Idee für die Online-Plattform",
            _ => throw new ArgumentOutOfRangeException(nameof(type)),
        };

    public static string Role(string roleName)
        => roleName switch
        {
            /*
            RoleNames.Participant => "Teilnehmer",
            RoleNames.Caregiver => "Betreuer",
            RoleNames.Promoter => "Veranstalter",
            RoleNames.Companion => "Begleiter",
            */
            RoleNames.PublicUser => "Mitglied",
            RoleNames.TeamMember => "Team-Mitglied",
            RoleNames.Admin => "Administrator",
            _ => throw new ArgumentOutOfRangeException(nameof(roleName)),
        };

    public static string ActivityTimeSpan(DateTimeOffset start, DateTimeOffset end)
    {
        const string DateTimeFormat = "ddd, dd. MMM yyyy";
        const string TimeOnlyFormat = "HH:mm";

        var isSameDay =
            start.Year == end.Year &&
            start.Month == end.Month &&
            start.Day == end.Day;

        if (isSameDay)
        {
            return $"{start.ToString(DateTimeFormat)} von {start.ToString(TimeOnlyFormat)} bis {end.ToString(TimeOnlyFormat)}";
        }

        return $"{start.ToString(DateTimeFormat)} von {start.ToString(TimeOnlyFormat)} bis {end.ToString(DateTimeFormat)} {end.ToString(TimeOnlyFormat)}";
    }

    public static string Duration(TimeSpan duration)
    {
        var units = ((Func<TimeSpan, int> getAmount, string singular, string plural)[])
        [
            (x => x.Days, "Tag", "Tage"),
            (x => x.Hours, "Stunde", "Stunden"),
            (x => x.Minutes, "Minute", "Minuten"),
            (x => x.Seconds, "Sekunde", "Sekunden"),
        ];

        var parts = units
            .Select(x => x.getAmount(duration) switch
            {
                > 1 and var amount => $"{amount} {x.plural}",
                1 => $"1 {x.singular}",
                _ => null
            })
            .Where(x => x != null)
            .Take(3);

        return string.Join(", ", parts);
    }

    public static class Registration
    {
        public const string IntentionIsRequired =
            "Bitte wähle aus, wofür du dich registrieren möchtest.";

        public const string FirstNameInvalid =
            "Bitte gib für deinen Vornamen nur Buchstaben ein.";

        public const string LastNameInvalid =
            "Bitte gib für deinen Nachnamen nur Buchstaben ein.";

        public const string PasswordIsRequired =
            "Bitte gib ein Passwort ein.";

        public const string WrongPreviewModePassword =
            """
            Das Vorschau-Modus Passwort ist nicht richtig.
            Im Vorschau-Modus ist ein internes Passwort für die Registrierung erforderlich.
            Der Administrator wird dir hierbei weiterhelfen.
            """;

        public const string DataPrivacyPolicyMustBeAccepted =
            "Bitte akzeptiere die Datenschutzbestimmungen.";

        public const string PasswordsMustMatch =
            "Die Passwörter müssen gleich sein.";

        public const string PasswordIsInvalid =
            "Bitte wähle ein stärkeres Passwort (min. 6 Zeichen lang, min. 1 Sonderzeichen)";

        public const string FailedToSendConfirmationEmail =
            "Die Bestätigungs-E-Mail konnte nicht an die angegebene Adresse gesendet werden. Bitte überprüfe sie und kontaktiere den Administrator über das Kontaktformular, wenn der Fehler weiter auftritt.";

        public const string RegistrationSucceeded =
            "Du hast dich erfolgreich registriert!";

        public static string TooManyRegistrationRequestsReceived(TimeSpan retryAfter) =>
            $"Zu viele Registrierungs-Anfragen erhalten. Bitte warte {Duration(retryAfter)}.";
    }

    public static class EmailConfirmation
    {
        public const string ConfirmationEmailSent =
            "Eine Bestätigungs-E-Mail wurde an dich gesendet.";

        public const string ConfirmationCodeMustBe6Chars =
            "Bitte gib den E-Mail-Code ein. Der E-Mail-Code besteht aus 6 Ziffern. Beispiel: 123456";

        public const string WrongConfirmationCode =
            "Der Code ist falsch oder abgelaufen. Bitte versuche es erneut.";

        public const string EmailConfirmationSucceeded =
            "E-Mail-Adresse wurde bestätigt!";

        public static string TooManyConfirmationEmails(TimeSpan retryAfter) =>
            $"Bitte warte {Duration(retryAfter)}, bevor du er nochmal versuchst.";
    }

    public static class ChangeEmail
    {
        public const string EmailChanged = "Die E-Mail-Addresse wurde geändert.";
    }

    public static class Login
    {
        public const string EmailAddressIsRequired =
            "Bitte gib deine E-Mail-Adresse ein.";

        public const string PasswordIsRequired =
            "Bitte gib dein Passwort ein.";

        public const string UserNotFoundByEmail =
            "Diese E-Mail-Adresse kennen wir nicht. Hast du dich schon registriert?";

        public const string WrongPassword =
            "Das Passwort stimmt nicht.";

        public static string TooManyLoginRequestsReceived(TimeSpan retryAfter) =>
            $"Zu viele Anmelde-Anfragen erhalten. Bitte warte {Duration(retryAfter)}.";
    }

    public static class Activity
    {
        public const string RegisteredForActivity =
            "Du hast dich für diese Veranstaltung angemeldet.";

        public const string UnregisteredFromActivity =
            "Du hast dich von dieser Veranstaltung abgemeldet.";

        public const string ActivityWasDeleted =
            "Die Veranstaltung wurde gelöscht.";

        public static string TooManyActivityRegistrationsReceived(TimeSpan retryAfter) =>
            $"Schön, dass dir so viele Veranstaltungen gefallen! Mach ruhig langsam. Du kannst es in {Duration(retryAfter)} nochmal versuchen.";

        public static class Edit
        {
            public const string NotRegisteredForPromoter =
                "Du bist derzeit keinem Akteur zugeordnet. Deshalb kannst du keine Veranstaltungen erstellen oder bearbeiten. Bitte wende dich an den Administrator, um einem Akteur zugeordnet zu werden. In Zukunft wird das einfacher werden.";

            public const string TitleIsRequired =
                "Bitte gib einen Titel ein.";
            public const string TitleLength =
                "Bitte gib einen Titel ein.";

            public const string VisibilityIsRequired =
                "Bitte gib eine Sichtbarkeit an.";

            public const string CategoryIsRequired =
                "Bitte gib eine Kategorie an.";

            public const string StartIsRequired =
                "Bitte gib einen Start-Zeitpunkt an.";

            public const string EndIsRequired =
                "Bitte gib einen End-Zeitpunkt an.";

            public const string LocationIsRequired =
                "Bitte gib einen Ort an.";

            public const string DescriptionIsRequired =
                "Bitte beschreibe die Veranstaltung.";

            public const string NewActivityTitle =
                "Neue Veranstaltung";

            public const string StartMustBeBeforeEnd =
                "Der Start-Zeitpunkt muss vor dem End-Zeitpunkt liegen.";

            public const string ActivityWasCreated =
                "Veranstaltung wurde erstellt!";

            public const string ActivityWasUpdated =
                "Die Veranstaltung wurde gespeichert!";
        }
    }

    public static class Account
    {
        public const string FirstNameIsRequired =
            "Bitte gib deinen Vornamen ein.";

        public const string FirstNameLength2To25Chars =
            "Der Vorname muss zwischen 2 und 25 Zeichen lang sein.";

        public const string LastNameIsRequired =
            "Bitte gib deinen Nachnamen ein.";

        public const string LastNameLength2To25Chars =
            "Der Nachname muss zwischen 2 und 25 Zeichen lang sein.";

        public const string StreetAddressMax100Chars =
            "Straße und Hausnummer dürfen höchstens 100 Zeichen lang sein.";

        public const string ZipCode5Digits =
            "Die PLZ muss aus 5 Ziffern bestehen. Beispiel: 64295";

        public const string CityNameMax100Chars =
            "Der Ortsname darf höchstens 100 Zeichen lang sein.";

        public const string EmailAddressIsRequired =
            "Bitte gib deine E-Mail-Adresse ein.";

        public const string GoalsLengthMaximum10000Chars =
            "Deine Ziele sollten nicht mehr als 10000 Zeichen lang sein.";

        public const string HobbiesLengthMaximum10000Chars =
            "Deine Hobbies sollten nicht mehr als 10000 Zeichen lang sein.";

        public const string AccountWasSaved =
            "Dein Profil wurde gespeichert.";
    }

    public static class Contact
    {
        public const string MessageIsRequired =
            "Bitte vor dem Absenden eine Nachricht ein.";

        public const string MessageLength5To10000Chars =
            "Die Nachricht muss mindestens 5 Zeichen lang sein und darf höchstens 10000 Zeichen lang sein.";

        public const string DataPrivacyPolicyNotAccepted =
            "Bitte lies die Datenschutzbestimmungen und akzeptiere sie.";

        public const string InquiryWasSent =
            "Danke für die Nachricht!";

        public static string TooManyInquiriesReceived(TimeSpan retryAfter) =>
            $"Zu viele Kontaktanfragen erhalten. Bitte warte {Duration(retryAfter)}.";
    }

    public static string HttpStatusCode(int statusCode)
        => statusCode switch
        {
            400 => "400: Fehlerhafte Anfrage",
            401 => "401: Nicht authentifiziert",
            402 => "402: Bezahlung erforderlich",
            403 => "403: Fehlende Berechtigung",
            404 => "404: Nicht gefunden",
            410 => "410: Nicht mehr vorhanden",
            423 => "423: Gesperrt",
            429 => "429: Zu viele Anfragen",
            _ => statusCode.ToString(),
        };
}
