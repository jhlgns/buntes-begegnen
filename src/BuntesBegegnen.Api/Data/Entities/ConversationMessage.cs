namespace BuntesBegegnen.Api.Data.Entities;

public record ConversationMessage
{
    public int Id { get; init; }

    public int ConversationId { get; init; }
    public Conversation Conversation { get; init; } = null!;

    public required string AuthorId { get; init; }
    public User Author { get; init; } = null!;

    public required DateTimeOffset SentAt { get; init; }

    public required string Content { get; init; }
}
