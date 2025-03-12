using AutoMapper;
using BuntesBegegnen.Api.Data;
using BuntesBegegnen.Api.Data.Entities;
using BuntesBegegnen.Api.Migrations;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Xunit.Abstractions;
using ActivityCategory = BuntesBegegnen.Api.Data.Entities.ActivityCategory;
using ActivityVisibility = BuntesBegegnen.Api.Data.Entities.ActivityVisibility;

namespace BuntesBegegnen.Api.Tests.Data;

internal record TestEnvironment(
    ActivityStore Store,
    BundlorWebContext Context,
    Promoter Promoter,
    User Admin,
    User Alice,
    User Bob,
    User Carl,
    IMapper Mapper);

// NOTE: Using the application factory as a fixture will result in errors when creating the users multipe times
public class ActivityStoreTests  // : IClassFixture<BundlorWebApplicationFactory>
{
    private readonly BundlorWebApplicationFactory _factory = new();
    private readonly ITestOutputHelper _out;

    public ActivityStoreTests(/*BundlorWebApplicationFactory factory, */ ITestOutputHelper @out)
    {
        //_factory = factory;
        _out = @out;
        _factory.OutputHelper = @out;
    }

    [Fact]
    public async Task ActivityRegistration()
    {
        var (store, context, promoter, admin, alice, bob, carl, _) = await CreateEnvironment();
        _out.WriteLine($"Using DB: {context.Database.GetConnectionString()}");

        // Create some activities
        var activities = await Task.WhenAll(
            Enumerable.Range(0, 5)
                .Select(x => CreateActivity(context, promoter, admin, ActivityVisibility.Public))
                .ToArray());

        var activityDtos = await store.List();
        Assert.Equal(activities.Length, activityDtos.Count);

        // Alice register for 0, 1 and 4
        await store.RegisterParticipant(activityDtos[0], alice);
        await store.RegisterParticipant(activityDtos[1], alice);
        await store.RegisterParticipant(activityDtos[4], alice);

        // Bob registers for 2, 3, and 4 as well
        await store.RegisterParticipant(activityDtos[2], bob);
        await store.RegisterParticipant(activityDtos[3], bob);
        await store.RegisterParticipant(activityDtos[4], bob);

        // Reload the DTOs so that we can check the updated fields
        activityDtos = await store.List();
        Assert.Equal(activities.Length, activityDtos.Count);

        // Carl does not register for anything.
        // NOTE: Double registration to regression-test the duplicate activity bug when
        // multiple people registered for an event and an anonymous user loads the list
        // of activities

        Assert.True(await store.IsRegisteredAsParticipant(activityDtos[0], alice));
        Assert.True(await store.IsRegisteredAsParticipant(activityDtos[1], alice));
        Assert.False(await store.IsRegisteredAsParticipant(activityDtos[2], alice));
        Assert.False(await store.IsRegisteredAsParticipant(activityDtos[3], alice));
        Assert.True(await store.IsRegisteredAsParticipant(activityDtos[4], alice));

        Assert.False(await store.IsRegisteredAsParticipant(activityDtos[0], bob));
        Assert.False(await store.IsRegisteredAsParticipant(activityDtos[1], bob));
        Assert.True(await store.IsRegisteredAsParticipant(activityDtos[2], bob));
        Assert.True(await store.IsRegisteredAsParticipant(activityDtos[3], bob));
        Assert.True(await store.IsRegisteredAsParticipant(activityDtos[4], bob));

        Assert.False(await store.IsRegisteredAsParticipant(activityDtos[0], carl));
        Assert.False(await store.IsRegisteredAsParticipant(activityDtos[1], carl));
        Assert.False(await store.IsRegisteredAsParticipant(activityDtos[2], carl));
        Assert.False(await store.IsRegisteredAsParticipant(activityDtos[3], carl));
        Assert.False(await store.IsRegisteredAsParticipant(activityDtos[4], carl));


        // Test loading with the 'onlyRegistered' parameter

        var onlyRegisteredActivitiesAlice = await store.List(userId: alice.Id, onlyRegistered: true);
        Assert.Collection(
            onlyRegisteredActivitiesAlice,
            x => Assert.Equal(activityDtos[0].Id, x.Id),
            x => Assert.Equal(activityDtos[1].Id, x.Id),
            x => Assert.Equal(activityDtos[4].Id, x.Id));

        var onlyRegisteredActivitiesBob = await store.List(userId: bob.Id, onlyRegistered: true);
        Assert.Collection(
            onlyRegisteredActivitiesBob,
            x => Assert.Equal(activityDtos[2].Id, x.Id),
            x => Assert.Equal(activityDtos[3].Id, x.Id),
            x => Assert.Equal(activityDtos[4].Id, x.Id));

        var onlyRegisteredActivitiesCarl = await store.List(userId: carl.Id, onlyRegistered: true);
        Assert.Empty(onlyRegisteredActivitiesCarl);

        // Test that the activity that was registered by alice and bob does only appear once
        var allActivitiesAnonymous = await store.List(onlyId: activityDtos[4].Id);
        var a = Assert.Single(allActivitiesAnonymous);
        Assert.Equal(activityDtos[4].Id, a.Id);
        Assert.Equal(2, activityDtos[4].CurrentNumberOfParticipants);
    }

    [Fact]
    public async Task TestActivityVisibility()
    {
        // We imagine alice and bob to be team members, and carl is a public user.
        var (store, context, promoter, admin, alice, bob, carl, _) = await CreateEnvironment();

        var privateDraftByAlice = await CreateActivity(context, promoter, alice, ActivityVisibility.PrivateDraft);
        var sharedDraftByAlice = await CreateActivity(context, promoter, alice, ActivityVisibility.SharedDraft);
        var publicActivityByAlice = await CreateActivity(context, promoter, alice, ActivityVisibility.Public);

        var privateDraftByBob = await CreateActivity(context, promoter, bob, ActivityVisibility.PrivateDraft);
        var sharedDraftByBob = await CreateActivity(context, promoter, bob, ActivityVisibility.SharedDraft);
        var publicActivityByBob = await CreateActivity(context, promoter, bob, ActivityVisibility.Public);

        // Bob should not be able to see the private draft of alice, but everything else
        var activitiesVisibleToBob = await store.List(userId: bob.Id, isTeamMember: true);
        Assert.True(
            new HashSet<int>() { sharedDraftByAlice.Id, publicActivityByAlice.Id, privateDraftByBob.Id, sharedDraftByBob.Id, publicActivityByBob.Id }
                .SetEquals(activitiesVisibleToBob.Select(x => x.Id).ToHashSet()));

        // Carl should only be able to see the public activities
        var activitiesVisibleToCarl = await store.List(userId: carl.Id);
        Assert.True(
            new HashSet<int>() { publicActivityByAlice.Id, publicActivityByBob.Id }
                .SetEquals(activitiesVisibleToCarl.Select(x => x.Id).ToHashSet()));
    }

#if false  // TODO
    [Fact]
    public async Task LoadRecurrence()
    {
        var (store, context, promoter, admin, alice, bob, carl, mapper) = await CreateEnvironment();
        var activity = await CreateActivity(context, promoter, admin, ActivityVisibility.Public);
        var noise = await CreateActivity(context, promoter, admin, ActivityVisibility.Public);

        var activityUpdate = mapper.Map<UpdateActivityDto>(activity);
        activityUpdate.RecurrenceFrequency = ActivityRecurrenceFrequency.Monthly;
        activityUpdate.RecurrenceByDay =
        [
            new() { Ordinal = 3, DayOfWeek = DayOfWeek.Monday },
            new() { Ordinal = 1, DayOfWeek = DayOfWeek.Tuesday },
        ];
        activityUpdate.RecurrenceByMonthDay = [31, 23, 24];
        // activityUpdate.RecurrenceByMonth = [1, 3, 6];
        await store.Update(mapper.Map<ActivityDto>(activity), activityUpdate);

        var noiseUpdate = mapper.Map<UpdateActivityDto>(activity);
        noiseUpdate.RecurrenceFrequency = ActivityRecurrenceFrequency.Monthly;
        noiseUpdate.RecurrenceByDay =
        [
            new() { Ordinal = 1, DayOfWeek = DayOfWeek.Tuesday },
        ];
        noiseUpdate.RecurrenceByMonthDay = [1, 2];
        // noiseUpdate.RecurrenceByMonth = [12];
        await store.Update(mapper.Map<ActivityDto>(noise), noiseUpdate);

        var dto = (await store.List(onlyId: activity.Id)).Single();
        Assert.Equal(ActivityRecurrenceFrequency.Monthly, dto.RecurrenceFrequency);

        Assert.Empty(dto.RecurrenceByDay ?? []);
        Assert.Empty(dto.RecurrenceByMonthDay ?? []);

        await store.LoadRecurrence(dto);
        Assert.Collection(
            dto.RecurrenceByDay ?? [],
            x => { Assert.Equal(1, x.Ordinal); Assert.Equal(DayOfWeek.Tuesday, x.DayOfWeek); },
            x => { Assert.Equal(3, x.Ordinal); Assert.Equal(DayOfWeek.Monday, x.DayOfWeek); });

        Assert.Collection(
            dto.RecurrenceByMonthDay ?? [],
            x => Assert.Equal(23, x),
            x => Assert.Equal(24, x),
            x => Assert.Equal(31, x));

        // Assert.Collection(
        //     dto.RecurrenceByMonth ?? [],
        //     x => Assert.Equal(1, x),
        //     x => Assert.Equal(3, x),
        //     x => Assert.Equal(6, x));
    }
#endif

    //     [Fact]
    //     public async Task ActivityRecurence()
    //     {
    //         // TODO
    // //         var (store, context, promoter, admin, alice, bob, carl, mapper) = await CreateEnvironment();
    // //
    // //         var activity = await CreateActivity(
    // //             context,
    // //             promoter,
    // //             admin,
    // //             ActivityVisibility.Public,
    // //             x =>
    // //             {
    // //                 // 12 Days, every 2nd day
    // //                 x.RecurrenceFrequency = ActivityRecurrenceFrequency.Daily;
    // //                 x.RecurrenceInterval = 2;
    // //                 x.StartTime = new DateTimeOffset(2024, 1, 1, 0, 0, 0, TimeSpan.Zero);
    // //                 x.EndTime = new DateTimeOffset(2024, 1, 1, 2, 0, 0, TimeSpan.Zero);
    // //                 x.RepeatUntil = new DateTimeOffset(2024, 1, 12, 12, 0, 0, TimeSpan.Zero);
    // //             });
    // //
    // //         var activities = await store.List();
    // //         Assert.Equal(6, activities.Count);
    //     }

    private async Task<TestEnvironment> CreateEnvironment()
    {
        // TODO: Just don't use the WebApplicationFactory?
        /*using*/
        var scope = _factory.Services.CreateScope();

        var services = _factory.Services;
        var context = scope.ServiceProvider.GetRequiredService<BundlorWebContext>();

        // Find admin
        var options = services.GetRequiredService<IOptions<ApiOptions>>().Value;
        var admin = await context.Users.FirstAsync(x => x.Email == options.AdminAccount.Email)!;

        // Create sample promoter
        var promoter = new Promoter
        {
            CreatedById = admin.Id,
            CreatedAt = DateTimeOffset.UtcNow,
            Name = "Test Promoter",
            Website = null,
            StreetName = null,
            HouseNumber = null,
            ZipCode = null,
            City = null,
        };
        context.Promoters.Add(promoter);
        await context.SaveChangesAsync();

        var mapper = services.GetRequiredService<IMapper>();
        var store = new ActivityStore(
            context,
            services.GetRequiredService<ILogger<ActivityStore>>(),
            mapper);

        // Create some users
        var rawUserManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        var alice = new User
        {
            UserName = "alice",
            Email = "alice@ferrari.com",
            FirstName = "Alice",
            LastName = "Alisson",
            CreatedAt = DateTimeOffset.UtcNow,
        };

        var bob = new User
        {
            UserName = "bob",
            Email = "bob@ferrari.com",
            FirstName = "Bob",
            LastName = "Bobbins",
            CreatedAt = DateTimeOffset.UtcNow,
        };

        var carl = new User
        {
            UserName = "carl",
            Email = "carl@giggle.com",
            FirstName = "Carl",
            LastName = "Carlsson",
            CreatedAt = DateTimeOffset.UtcNow,
        };
        var password = "Start123!";
        IdentityResult result;
        if ((result = await rawUserManager.CreateAsync(alice, password)).Succeeded == false) throw new(result.ToString());
        if ((result = await rawUserManager.CreateAsync(bob, password)).Succeeded == false) throw new(result.ToString());
        if ((result = await rawUserManager.CreateAsync(carl, password)).Succeeded == false) throw new(result.ToString());

        return new TestEnvironment(store, context, promoter, admin, alice, bob, carl, mapper);
    }

    private static async Task<Activity> CreateActivity(
        BundlorWebContext context,
        Promoter promoter,  // TODO: Move to setup
        User author,  // TODO: Move to setup
        ActivityVisibility visibility,  // TODO: Move to setup
        Action<Activity>? setup = null)
    {
        var activity = new Activity
        {
            CreatedById = author.Id,
            CreatedAt = DateTimeOffset.UtcNow,
            PromoterId = promoter.Id,
            Visibility = visibility,
            Title = $"Test Activity {visibility}",
            Category = ActivityCategory.Excursion,
            StartTime = DateTime.UtcNow.AddDays(3),
            EndTime = DateTime.UtcNow.AddDays(4),
            IsAllDay = false,
            MaxNumberOfParticipants = 25,
            RegistrationLocked = false,
            Location = "Here and now",
            Description = "Just be here now.",
            RecurrenceFrequency = ActivityRecurrenceFrequency.None,
            RecurrenceInterval = null,
            RepeatUntil = null,
            RepeatCount = null,
        };

        setup?.Invoke(activity);

        context.Activities.Add(activity);
        await context.SaveChangesAsync();
        return activity;
    }

#if false
    [Fact]
    public async Task ActivitiesOfPromoterGetDeletedWhenPromoterGetsDeleted()
    {
        using var scope = _factory.Services.CreateScope();

        var services = _factory.Services;
        var context = scope.ServiceProvider.GetRequiredService<BundlorWebContext>();

        // Find admin
        var options = services.GetRequiredService<IOptions<BundlorWebOptions>>().Value;
        var admin = await context.Users.FirstAsync(x => x.Email == options.AdminAccount.Email)!;

        // Create sample promoter
        var promoter = new Promoter
        {
            CreatedById = admin.Id,
            CreatedAt = DateTimeOffset.UtcNow,
            Name = "Test Promoter",
            Website = null,
            StreetAddress = null,
            ZipCode = null,
            City = null,
        };
        context.Promoters.Add(promoter);
        await context.SaveChangesAsync();

        var userManager = new Mock<IUserManager>();
        var authorizationService = new Mock<IAuthorizationService>();
        var httpContextAccessor = new Mock<IHttpContextAccessor>();

        var store = new ActivityStore(
            context,
            userManager.Object,
            authorizationService.Object,
            httpContextAccessor.Object,
            Mock.Of<IEmailGenerator>(),
            services.GetRequiredService<ILogger<ActivityStore>>());

        // Create some activities
        var activities = Enumerable.Range(0, 5)
            .Select(x => new Activity
            {
                CreatedById = admin.Id,
                CreatedAt = DateTimeOffset.UtcNow,
                PromoterId = promoter.Id,
                Visibility = ActivityVisibility.Public,
                Title = "Test Activity",
                Category = ActivityCategory.Excursion,
                StartTime = DateTime.UtcNow.AddDays(3),
                EndTime = DateTime.UtcNow.AddDays(4),
                Location = "Here and now",
                Description = "Just be here now.",
            })
            .ToArray();
        context.Activities.AddRange(activities);
        await context.SaveChangesAsync();

        Assert.Equal(5, await context.Activities.CountAsync());
        Assert.Equal(
            5,
            (await context.Promoters
                .Include(x => x.Activities)
                .FirstAsync(x => x.Id == promoter.Id))
                .Activities
                .Count);

        context.Activities.Remove(await context.Activities.FirstAsync());
        await context.SaveChangesAsync();
        Assert.Equal(
            4,
            (await context.Promoters
                .Include(x => x.Activities)
                .FirstAsync(x => x.Id == promoter.Id))
                .Activities
                .Count);

        context.Promoters.Remove(promoter);
        await context.SaveChangesAsync();

        Assert.Equal(0, await context.Activities.CountAsync());
    }
#endif
}
