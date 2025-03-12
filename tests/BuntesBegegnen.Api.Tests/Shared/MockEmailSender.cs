using BuntesBegegnen.Api.Email;
using Microsoft.Extensions.Logging;

namespace BuntesBegegnen.Api.Tests.Shared;

public class MockEmailSender : IEmailSender
{
    private readonly ILogger<MockEmailSender> _logger;

    public MockEmailSender(ILogger<MockEmailSender> logger)
    {
        _logger = logger;
    }

    public Task Send(string recipient, string subject, HtmlBody htmlBody, string? icalAttachment = null)
    {
        _logger.LogInformation(
            "Sending email to {Recipient}:\nSubject: {Subject}\n{HtmlBody}\n---\nAttachments: {Attachment}",
            recipient, subject, htmlBody, icalAttachment);

        return Task.CompletedTask;
    }
}
