using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using AutoMapper;

namespace BuntesBegegnen.Api.Data.Entities;

public record ActivityRecurrenceByDayDto
{
    public int Ordinal { get; init; }
    public DayOfWeek DayOfWeek { get; init; }
}

// TODO:
// * Tags - accessibility, category, ...?

public record ActivityDto : EntityDto
{
    public int PromoterId { get; init; }
    public string Title { get; init; } = null!;
    public ActivityVisibility Visibility { get; init; }
    public ActivityCategory Category { get; init; }
    public DateTimeOffset StartTime { get; init; }
    public DateTimeOffset EndTime { get; init; }
    public bool IsAllDay { get; init; }
    public int? MaxNumberOfParticipants { get; init; }
    public bool RegistrationLocked { get; init; }
    public string Location { get; init; } = null!;
    public string Description { get; init; } = null!;

    //
    // Recurrence
    //

    public ActivityRecurrenceFrequency RecurrenceFrequency { get; init; }
    public int? RecurrenceInterval { get; init; }
    public DateOnly? RepeatUntil { get; init; }
    public int? RepeatCount { get; init; }

    [NotMapped] public bool IsInstance { get; init; }

    [NotMapped] public HashSet<DateTimeOffset> RecurrenceDates { get; init; } = [];
    [NotMapped] public HashSet<ActivityRecurrenceByDayDto> RecurrenceByDay { get; init; } = [];
    [NotMapped] public HashSet<int> RecurrenceByMonthDay { get; init; } = [];
    [NotMapped] public HashSet<DateTimeOffset> RecurrenceExceptions { get; init; } = [];

    //
    // Calculated
    //

    public bool IsRegistered { get; init; }
    public int CurrentNumberOfParticipants { get; init; }
}

public record UpdateActivityDto
{
    public int PromoterId { get; init; }

    [StringLength(100)]
    public string Title { get; init; } = null!;

    public ActivityVisibility Visibility { get; init; }
    public ActivityCategory Category { get; init; }
    public DateTimeOffset StartTime { get; init; }
    public DateTimeOffset EndTime { get; init; }
    public bool IsAllDay { get; init; }

    [Range(0, 10_000)]
    public int? MaxNumberOfParticipants { get; init; }

    public bool RegistrationLocked { get; init; }

    [StringLength(200, MinimumLength = 3)]
    public string Location { get; init; } = null!;

    [StringLength(10000, MinimumLength = 10)]
    public string Description { get; init; } = null!;

    public ActivityRecurrenceFrequency RecurrenceFrequency { get; init; }
    public int? RecurrenceInterval { get; init; }
    public DateOnly? RepeatUntil { get; init; }

    [Range(1, 1000)]
    public int? RepeatCount { get; init; }

    public HashSet<DateTimeOffset> RecurrenceDates { get; set; } = [];
    public HashSet<ActivityRecurrenceByDayDto> RecurrenceByDay { get; init; } = [];
    public HashSet<int> RecurrenceByMonthDay { get; init; } = [];
    public HashSet<DateTimeOffset> RecurrenceExceptions { get; init; } = [];
}

public class ActivityMapperProfile : Profile
{
    public ActivityMapperProfile()
    {
        CreateMap<Activity, ActivityDto>();
        CreateMap<UpdateActivityDto, Activity>()
            .ForMember(x => x.RecurrenceByDay, opt => opt.Ignore())
            .ForMember(x => x.RecurrenceByMonthDay, opt => opt.Ignore())
            .ForMember(x => x.RecurrenceDates, opt => opt.Ignore())
            .ForMember(x => x.RecurrenceExceptions, opt => opt.Ignore());
    }
}
