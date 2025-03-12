using AutoMapper;

namespace BuntesBegegnen.Api.Data.Entities;

public record PromoterDto : EntityDto
{
    public required string Name { get; init; } = null!;
    public required string? Website { get; init; } = null!;
    public required string? StreetName { get; init; }
    public required string? HouseNumber { get; init; }
    public required string? ZipCode { get; init; }
    public required string? City { get; init; }
}

public class PromoterProfile : Profile
{
    public PromoterProfile()
    {
        CreateMap<Promoter, PromoterDto>();
    }
}
