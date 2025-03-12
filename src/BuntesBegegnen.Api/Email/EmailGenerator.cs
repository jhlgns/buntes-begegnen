using BuntesBegegnen.Api.Data.Entities;
using BuntesBegegnen.Api.Localization;
using BuntesBegegnen.Api.Util;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Bundlor.Lib.Hosting;

namespace BuntesBegegnen.Api.Email;

public class EmailGenerator : IEmailGenerator
{
    private readonly IEmailSender _sender;
    private readonly ILogger<EmailGenerator> _logger;
    private readonly ApiOptions _options;

    public EmailGenerator(
        IEmailSender sender,
        ILogger<EmailGenerator> logger,
        IOptions<ApiOptions> options)
    {
        _sender = sender;
        _logger = logger;
        _options = options.Value;
    }

    public Task SendConfirmationEmail(User recipient, string newEmailAddress, string code)
        => _sender.Send(
            newEmailAddress,
            "E-Mail-Adresse bestätigen",
            GenerateDocument($"""
                <p>Hi {recipient.FirstName}!</p>
                <p>Herzlich willkommen beim Projekt Buntes Begegnen.</p>
                <p>Das ist die Geheimzahl, um deine E-Mail-Adresse zu bestätigen:</p>
                <pre>{code}</pre>
                """));

    public Task SendActivityInvitation(User recipient, ActivityDto activity)
        => SendToVerifiedAdress(
            recipient,
            $"Anmeldung zur Veranstaltung: {activity.Title}",
            GenerateDocument(
                $"""
                <p>Hi {recipient.FirstName}!</p>
                <p>Du hast dich gerade für die Veranstaltung "{activity.Title}" angemeldet.</p>

                <table>
                    <tbody>
                        <tr>
                            <td style="text-align: right">Wann:</td>
                            <td>{Strings.ActivityTimeSpan(activity.StartTime, activity.EndTime)}</td>
                        </tr>
                        <tr>
                            <td style="text-align: right">Wo:</td>
                            <td>{activity.Location}</td>
                        </tr>
                        <tr>
                            <td style="text-align: right">Darum geht es:</td>
                            <td>
                                <span style="white-space: pre-wrap">{activity.Description}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <p>Ein Kalendereintrag ist in dieser Nachricht enthalten. Du kannst ihn in Deinen eigenen Kalender einfügen.</p>
                """),
            IcalUtils.GenerateInvitation(activity, contactEmailAddress: _options.ContactEmailAddress, attendeeEmailAddress: recipient.Email!));

    public async Task NotifiyAboutInquiry(IEnumerable<User> recipients, Inquiry inquiry, bool isAnonymous)
    {
        foreach (var user in recipients)
        {
            _logger.LogInformation(
                "Notifying {UserEmail} about inquiry {InquiryId}",
                user.Email,
                inquiry.Id);

            var senderName = (isAnonymous, inquiry.CreatedBy) switch
            {
                (true, _) or (_, null) => "anonym",
                (_, var sender) => $"{sender.FirstName} {sender.LastName} ({sender.Email})"
            };

            var senderEmail = inquiry.EmailAddress is not (null or "")
                ? inquiry.EmailAddress
                : "(keine Angabe)";

            await _sender.Send(
                user.Email!,
                "Kontaktanfrage",
                GenerateDocument(
                    $"""
                    <p>Nachricht erhalten:</p>

                    <table>
                        <tbody>
                            <tr>
                                <td style="text-align: right">Von:</td>
                                <td>{senderName}</td>
                            </tr>
                            <tr>
                                <td style="text-align: right">E-Mail-Adresse<br>(nur für nicht angemeldete Nutzer):</td>
                                <td>{senderEmail}</td>
                            </tr>
                            <tr>
                                <td style="text-align: right">Betreff:</td>
                                <td>
                                    <span style="white-space: pre-wrap">{Strings.InquiryType(inquiry.Type)}</span>
                                </td>
                            </tr>
                            <tr>
                                <td style="text-align: right">Nachricht:</td>
                                <td>
                                    <span style="white-space: pre-wrap">{inquiry.Message}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    """));
        }
    }

    public async Task NotifyAdminAboutAuthenticationEvent(User? subject, bool isRegistration, IdentityResult result)
    {
        try
        {
            var action = isRegistration ? "registriert" : "angemeldet";
            var success = result.Succeeded ? "erfolgreich" : "ohne Erfolg";

            _logger.LogInformation("Notifying admin about authentication event");

            var telegramMessage = $"""
                Buntes Begegnen Authentifizierungs-Ereignis:
                Benutzer '{subject?.Email ?? "(anonym)"}' hat sich gerade {success} {action}.
                Ergebnis: {result}
                """;
            _logger.LogInformation(LoggingCategories.Security, telegramMessage);

            await _sender.Send(
                _options.AdminAccount.Email,
                $"Benutzer '{subject?.Email ?? "(anonym)"}' hat sich gerade {success} {action}",
                GenerateDocument(
                    $"""
                    Benutzer '{subject?.Email ?? "(anonym)"}' hat sich gerade {success} {action}.
                    Ergebnis: {result}
                    """));
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Could notify admin about authentication event");
        }
    }

    private Task SendToVerifiedAdress(User recipient, string subject, HtmlBody htmlBody, string? icalAttachment = null)
    {
        // TODO
        if (false && recipient.EmailConfirmed == false)
        {
            throw new InvalidOperationException("Email address is not confirmed");
        }

        return _sender.Send(recipient.Email!, subject, htmlBody, icalAttachment);
    }

    private HtmlBody GenerateDocument(HtmlInterpolatedStringBuilder value)
        => new($$"""
        <!DOCTYPE html>
        <html lang="de">
        <head>
            <meta charset="utf-8" />
        </head>

        <body>
            <style>
                * {
                    font-family: 'Trebutchet MS', 'sans serif';
                    font-size: 1.05rem;
                }

                table, td {
                    border: none;
                }

                td {
                    vertical-align: top;
                    padding: .5em;
                }

                footer {
                    border-top: 1px solid grey;
                    margin-top: 3em;
                    font-size: .95rem;
                }
            </style>

            <main>
                {{new HtmlBody(value)}}
            </main>

            <footer>
                <p>Liebe Grüße,</p>
                <p>Projekt Buntes Begegnen (<a href="https://buntes-begegnen.de">buntes-begegnen.de</a>)</p>
                <a href="mailto:{{_options.ContactEmailAddress}}">{{_options.ContactEmailAddress}}</a>
            </footer>
        </body>
        </html>
        """);
}
