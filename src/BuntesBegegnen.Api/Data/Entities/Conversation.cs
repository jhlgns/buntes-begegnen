namespace BuntesBegegnen.Api.Data.Entities;

public record Conversation : Entity
{
    public required string? Name { get; init; }  // NOTE: Currently unused, reserved and only valid for group chats

    public List<ConversationMember> Members { get; init; } = [];
    public List<ConversationMessage> Messages { get; init; } = [];
}
