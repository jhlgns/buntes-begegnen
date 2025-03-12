namespace BuntesBegegnen.Api.UserManagement;

public class ConfirmationEmailException : Exception
{
    public ConfirmationEmailException(Exception innerException)
        : base("Failed to send confirmation email", innerException)
    {
    }
}
