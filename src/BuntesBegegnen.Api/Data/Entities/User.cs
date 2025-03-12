using Microsoft.AspNetCore.Identity;

namespace BuntesBegegnen.Api.Data.Entities;

public class User : IdentityUser
{
    public required DateTimeOffset CreatedAt { get; set; }

    public required string FirstName { get; set; } = null!;
    public required string LastName { get; set; } = null!;
    public DateOnly? BirthDay { get; set; }

    public string? StreetName { get; set; }
    public string? HouseNumber { get; set; }
    public string? ZipCode { get; set; }
    public string? City { get; set; }

    public int? PromoterId { get; set; }
    public Promoter? Promoter { get; set; }

    // Used for: participants
    public string? Goals { get; set; }
    public string? Hobbies { get; set; }
    public List<UserFavoriteCategory> FavoriteCategories { get; set; } = [];

    // Used for: participants, companions
    public bool ImpairedSight { get; set; }
    public bool ImpairedHearing { get; set; }
    public bool ImpairedSpeech { get; set; }
    public bool ImpairedMobility { get; set; }
    public string? AdditionalHandicaps { get; set; }
}
