using System.ComponentModel.DataAnnotations;
using AutoMapper;

namespace BuntesBegegnen.Api.Data.Entities;

public class CreateInquiryDto
{
    [StringLength(500)]
    public string? EmailAddress { get; init; }

    public InquiryType Type { get; init; }

    [StringLength(100000, MinimumLength = 3)]
    public string Message { get; init; } = null!;

    public bool IsAnonymous { get; init; }
}

public record InquiryDto : EntityDto
{
    public string? EmailAddress { get; init; }
    public InquiryType Type { get; init; }
    public string Message { get; init; } = null!;
    public bool IsAnonymous { get; init; }
    public string? IpAddress { get; init; }
}

public class InquiryMapperProfile : Profile
{
    public InquiryMapperProfile()
    {
        CreateMap<CreateInquiryDto, Inquiry>();
        CreateMap<Inquiry, InquiryDto>();
    }
}
