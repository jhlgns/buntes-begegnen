using BuntesBegegnen.Api.Data.Entities;

namespace BuntesBegegnen.Api.Data;

// TODO: AddMember, RemoveMember, Rename...

public record ConversationMessageDto(
    int Id,
    DateTimeOffset SentAt,
    string AuthorId,
    string AuthorDisplayName,
    string Content);

public record ConversationDto(
    int Id,
    string? Name,
    string[] MemberDisplayNames,
    ConversationMessageDto? LatestMessage);

public interface IConversationStore
{
    Task<Conversation?> FindConversation(int id);

    Task<Conversation> CreateConversation(string adminId, HashSet<string> memberIds);

    Task<int> SendMessage(Conversation conversation, string authorId, string content);

    Task<ConversationDto[]> LoadConversations(string userId);

    Task<ConversationMessageDto[]> LoadMessages(Conversation conversation, DateTime? earliest);
}
