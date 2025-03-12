namespace BuntesBegegnen.Api.Email;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class IgnoreEmailConfirmationAttribute : Attribute;
