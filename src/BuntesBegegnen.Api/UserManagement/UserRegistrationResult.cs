using BuntesBegegnen.Api.Data.Entities;
using Microsoft.AspNetCore.Identity;

namespace BuntesBegegnen.Api.UserManagement;

public abstract record UserRegistrationResult;
public record UserRegistrationSucceeded(User User) : UserRegistrationResult;
public record UserRegistrationFailed(IdentityResult Result) : UserRegistrationResult;
