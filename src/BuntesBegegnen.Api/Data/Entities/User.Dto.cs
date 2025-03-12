using System.ComponentModel.DataAnnotations;
using AutoMapper;
using BuntesBegegnen.Api.Localization;

namespace BuntesBegegnen.Api.Data.Entities;

public record CreateUserDto
{
    //
    // Personal data
    //

    [StringLength(25, MinimumLength = 2)]
    public string FirstName { get; init; } = null!;

    [StringLength(25, MinimumLength = 2)]
    public string LastName { get; init; } = null!;

    public DateOnly? BirthDay { get; init; }

    //
    // Contact data
    //

    [Required]
    [StringLength(500)]
    public string Email { get; init; } = null!;

    [StringLength(100)]
    public string? PhoneNumber { get; init; } = null!;

    [StringLength(100)]
    public string? StreetName { get; init; } = null!;

    [StringLength(10)]
    public string? HouseNumber { get; init; } = null!;

    [RegularExpression(@"\d{5}", ErrorMessage = Strings.Account.ZipCode5Digits)]  // TODO
    [StringLength(5)]
    public string? ZipCode { get; init; } = null!;

    [StringLength(100)]
    public string? City { get; init; } = null!;

    //
    // Goals, hobbies, categories
    //

    [StringLength(10000)]
    public string? Goals { get; init; }

    [StringLength(10000)]
    public string? Hobbies { get; init; }

    //
    // Impairments
    //

    public bool ImpairedSight { get; init; }
    public bool ImpairedHearing { get; init; }
    public bool ImpairedSpeech { get; init; }
    public bool ImpairedMobility { get; init; }

    [StringLength(5000)]
    public string? AdditionalHandicaps { get; init; }
}

public record UserDto
{
    public string Id { get; init; } = null!;

    //
    // Personal data
    //

    public string FirstName { get; init; } = null!;
    public string LastName { get; init; } = null!;
    public DateOnly? BirthDay { get; init; }

    //
    // Contact data
    //

    public string Email { get; init; } = null!;
    public string? PhoneNumber { get; init; } = null!;
    public string? StreetName { get; init; } = null!;
    public string? HouseNumber { get; init; } = null!;
    public string? ZipCode { get; init; } = null!;
    public string? City { get; init; } = null!;

    //
    // Goals, hobbies, categories
    //

    public string? Goals { get; init; }
    public string? Hobbies { get; init; }

    //
    // Impairments
    //

    public bool ImpairedSight { get; init; }
    public bool ImpairedHearing { get; init; }
    public bool ImpairedSpeech { get; init; }
    public bool ImpairedMobility { get; init; }

    public string? AdditionalHandicaps { get; init; }
}

public class UserMapperProfile : Profile
{
    public UserMapperProfile()
    {
        CreateMap<CreateUserDto, User>();
        CreateMap<User, UserDto>();
    }
}
