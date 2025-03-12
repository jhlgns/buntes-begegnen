namespace BuntesBegegnen.Api.Email;

public interface IEmailSender
{
    Task Send(string recipient, string subject, HtmlBody htmlBody, string? icalAttachment = null);
}
