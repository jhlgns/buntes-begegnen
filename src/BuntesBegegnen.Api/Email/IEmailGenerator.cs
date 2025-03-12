using BuntesBegegnen.Api.Data.Entities;
using Microsoft.AspNetCore.Identity;

namespace BuntesBegegnen.Api.Email;

public interface IEmailGenerator
{
    Task SendConfirmationEmail(User recipient, string newEmailAddress, string code);

    Task SendActivityInvitation(User recipient, ActivityDto activity);

    Task NotifiyAboutInquiry(IEnumerable<User> recipients, Inquiry inquiry, bool isAnonymous);

    // TODO: Remove when Graylog is up
    Task NotifyAdminAboutAuthenticationEvent(User? subject, bool isRegistration, IdentityResult result);
}
