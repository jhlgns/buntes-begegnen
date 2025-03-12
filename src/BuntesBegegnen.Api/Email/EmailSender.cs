using System.Text;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace BuntesBegegnen.Api.Email;

public class EmailSender : IEmailSender
{
    private readonly EmailOptions _options;
    private readonly ILogger<EmailSender> _logger;

    public EmailSender(IOptions<EmailOptions> options, ILogger<EmailSender> logger)
    {
        _options = options.Value;
        _logger = logger;

        if (_options.From is null or "")
        {
            throw new ArgumentException("EmailOptions.From may not be null or empty");
        }
    }

    // NOTE: Make sure the email address is verified accordingly
    public async Task Send(string recipient, string subject, HtmlBody htmlBody, string? icalAttachment)
    {
        // @ProductionReadiness @DataPrivacy
        _logger.LogInformation(
            "Sending email: From='{From}'; Recipient='{Recipient}'; Subject='{Subject}'; Body='{Body}'",
            _options.From,
            recipient,
            subject,
            htmlBody);

        var builder = new BodyBuilder  // Gotta confuse the body!
        {
            HtmlBody = htmlBody.SanitizedValue
        };

        if (icalAttachment != null)
        {
            var content = Encoding.UTF8.GetBytes(icalAttachment);
            builder.Attachments.Add("Einladung.ics", content);
        }

        using var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse(_options.From));
        email.To.Add(MailboxAddress.Parse(recipient));
        email.Subject = subject;
        email.Body = builder.ToMessageBody();

        using var smtp = new SmtpClient();
        await smtp.ConnectAsync(_options.SmtpServer, _options.SmtpPort, SecureSocketOptions.StartTls);
        await smtp.AuthenticateAsync(_options.UserName, _options.Password);
        await smtp.SendAsync(email);
        await smtp.DisconnectAsync(true);  // NOTE: We could use a singleton SmtpClient
    }
}
