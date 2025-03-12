namespace BuntesBegegnen.Api.Data.Entities;

public record ConversationMember
{
    public required int ConversationId { get; init; }
    public Conversation Conversation { get; init; } = null!;

    public required string MemberId { get; init; }
    public User Member { get; init; } = null!;
}

// NOTE: We could add an admin flag...
