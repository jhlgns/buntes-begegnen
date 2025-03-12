namespace BuntesBegegnen.Api.Email;

public record EmailOptions
{
    public const string Key = "Email";

    public string From { get; init; } = "";
    public string SmtpServer { get; init; } = "";
    public int SmtpPort { get; init; } = 587;
    public string UserName { get; init; } = "";
    public string Password { get; init; } = "";
}
