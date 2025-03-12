// NOTE: Role claims are generated dynamically based on the flags in the user account
namespace BuntesBegegnen.Api.UserManagement;

public static class RoleNames
{
    public const string PublicUser = "PublicUser";
    public const string TeamMember = "TeamMember";
    public const string InquiryRecipient = "InquiryRecipient";
    public const string Admin = "Admin";

    public static readonly IReadOnlyCollection<string> All =
    [
        PublicUser,
        TeamMember,
        InquiryRecipient,
        Admin,
    ];
}
