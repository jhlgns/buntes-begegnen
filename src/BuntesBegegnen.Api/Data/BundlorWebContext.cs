using BuntesBegegnen.Api.Data.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace BuntesBegegnen.Api.Data;

public class BundlorWebContext : IdentityDbContext<User>
{
    public BundlorWebContext(DbContextOptions<BundlorWebContext> options)
        : base(options)
    {
    }

    // NOTE: Remember to set up a query filter for Entity.IsDeleted for each new entity type

    public DbSet<Activity> Activities { get; set; } = null!;
    public DbSet<ActivityRecurrenceByDay> ActivityRecurrenceByDay { get; set; } = null!;
    public DbSet<ActivityRecurrenceByMonthDay> ActivityRecurrenceByMonthDay { get; set; } = null!;
    public DbSet<ActivityRecurrenceDate> ActivityRecurrenceDates { get; set; } = null!;
    public DbSet<ActivityRecurrenceException> ActivityRecurrenceExceptions { get; set; } = null!;
    public DbSet<Conversation> Conversations { get; set; } = null!;
    public DbSet<ConversationMember> ConversationMembers { get; set; } = null!;
    public DbSet<ConversationMessage> ConversationMessages { get; set; } = null!;
    public DbSet<EmailConfirmationCode> EmailConfirmationCodes { get; set; } = null!;
    public DbSet<Inquiry> Inquiries { get; set; } = null!;
    public DbSet<Promoter> Promoters { get; set; } = null!;
    public DbSet<UserActivityRegistration> UserActivityRegistrations { get; set; } = null!;
    public DbSet<UserActivityVote> UserActivityVotes { get; set; } = null!;
    public DbSet<UserFavoriteCategory> UserFavoriteCategories { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder builder)
    {
        // NOTE: Remember to query for IsDeleted in inline SQL queries

        base.OnModelCreating(builder);

        // Activity

        // ActivityRecurrenceByDay
        builder.Entity<ActivityRecurrenceByDay>()
            .HasKey(x => new { x.ActivityId, x.Ordinal, x.DayOfWeek });

        // ActivityRecurrenceByMonthDay
        builder.Entity<ActivityRecurrenceByMonthDay>()
            .HasKey(x => new { x.ActivityId, x.MonthDay });

        // ActivityRecurrenceDate
        builder.Entity<ActivityRecurrenceDate>()
            .HasKey(x => new { x.ActivityId, x.StartTime });

        // ActivityRecurrenceException
        builder.Entity<ActivityRecurrenceException>()
            .HasKey(x => new { x.ActivityId, x.StartTime });

        // Conversations

        // ConversationMember
        builder.Entity<ConversationMember>()
            .HasKey(x => new { x.ConversationId, x.MemberId });

        // ConversationMessage

        // EmailConfirmationCode

        // Inquiry

        // Promoter
        builder.Entity<Promoter>()
            .HasOne(x => x.CreatedBy)
            .WithMany();

        // UserActivityRegistration
        builder.Entity<UserActivityRegistration>()
            .HasKey(x => new { x.UserId, x.ActivityId });

        // UserActivityVote
        builder.Entity<UserActivityVote>()
            .HasKey(x => new { x.UserId, x.ActivityId });
        builder.Entity<UserActivityVote>()
            .HasIndex(x => x.ActivityId);

        // UserFavoriteCategory
        builder.Entity<UserFavoriteCategory>()
            .HasKey(x => new { x.UserId, x.Category });
    }
}
