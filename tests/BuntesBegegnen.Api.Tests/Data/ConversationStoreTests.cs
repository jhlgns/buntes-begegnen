using AutoMapper;
using BuntesBegegnen.Api.Data.Entities;
using BuntesBegegnen.Api.Tests;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using Xunit.Abstractions;

namespace BuntesBegegnen.Api.Data;

public class ConversationStoreTests : IClassFixture<BundlorWebApplicationFactory>
{
    private readonly BundlorWebApplicationFactory _factory;
    private readonly ITestOutputHelper _out;

    public ConversationStoreTests(BundlorWebApplicationFactory factory, ITestOutputHelper @out)
    {
        _factory = factory;
        _factory.OutputHelper = @out;
        _out = @out;
    }

    [Fact]
    public async Task SendMessage()
    {
        using var scope = _factory.Services.CreateScope();

        var services = _factory.Services;
        var context = scope.ServiceProvider.GetRequiredService<BundlorWebContext>();

        // Find admin
        var options = services.GetRequiredService<IOptions<ApiOptions>>();
        //var admin = await context.Users.FirstAsync(x => x.Email == options.AdminAccount.Email)!;

        var store = new ConversationStore(
            context,
            options,
            new TestLogger<ConversationStore>(_out),
            scope.ServiceProvider.GetRequiredService<IMapper>());

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

        var password = "Start123!";
        if ((await rawUserManager.CreateAsync(alice, password)) is { Succeeded: false } aliceResult) throw new();
        if ((await rawUserManager.CreateAsync(bob, password)) is { Succeeded: false } bobResult) throw new();

        // No conversations initially
        Assert.Empty(await store.LoadConversations(alice.Id));

        // Create conversation
        var conversation = await store.CreateConversation(alice.Id, [alice.Id, bob.Id]);

        // Assert conversation exists
        var dto = Assert.Single(await store.LoadConversations(alice.Id));
        Assert.Equal(new HashSet<string>(["Alice Alisson", "Bob Bobbins"]), new HashSet<string>(dto.MemberDisplayNames));
        Assert.Null(dto.LatestMessage);

        // Send message
        await store.SendMessage(conversation, alice.Id, "I want a ferrari");

        // Check the message is there
        dto = Assert.Single(await store.LoadConversations(alice.Id));
        Assert.NotNull(dto.LatestMessage);
        Assert.Equal("I want a ferrari", dto.LatestMessage.Content);
        Assert.Equal("Alice Alisson", dto.LatestMessage.AuthorDisplayName);
    }
}
