using AutoMapper;
using AutoMapper.QueryableExtensions;
using BuntesBegegnen.Api.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BuntesBegegnen.Api.Data;

public class ConversationStore : IConversationStore
{
    private readonly BundlorWebContext _context;
    private readonly ApiOptions _options;
    private readonly ILogger<ConversationStore> _logger;
    private readonly IMapper _mapper;

    public ConversationStore(
        BundlorWebContext context,
        IOptions<ApiOptions> options,
        ILogger<ConversationStore> logger,
        IMapper mapper)
    {
        _context = context;
        _options = options.Value;
        _logger = logger;
        _mapper = mapper;
    }

    public async Task<Conversation?> FindConversation(int id)
    {
        var result = await _context.Conversations.FindAsync(id);
        return result;
    }

    public async Task<Conversation> CreateConversation(string adminId, HashSet<string> memberIds)
    {
        memberIds.Add(adminId);

        _logger.LogInformation(
            "Creating conversation, admin ID: {AdminId}, member IDs: {MemberIds}",
            adminId,
            string.Join(", ", memberIds));

        var conversation = new Conversation
        {
            Name = null,
            CreatedAt = DateTimeOffset.UtcNow,
            CreatedById = adminId,
            Members = memberIds.Select(x => new ConversationMember
            {
                ConversationId = 0,
                MemberId = x,
            }).ToList(),
        };

        _context.Conversations.Add(conversation);
        await _context.SaveChangesAsync();

        return conversation;
    }

    public async Task<int> SendMessage(Conversation conversation, string authorId, string content)
    {
        // @ProductionReadiness @DataPrivacy
        _logger.LogInformation(
            "Sending message to conversation {Id}, Content={Content}",
            conversation.Id,
            content);

        var message = new ConversationMessage
        {
            ConversationId = conversation.Id,
            AuthorId = authorId,
            SentAt = DateTimeOffset.UtcNow,
            Content = content,
        };

        _context.ConversationMessages.Add(message);
        await _context.SaveChangesAsync();

        return message.Id;
    }

    public async Task<ConversationDto[]> LoadConversations(string userId)
    {
        var conversations = await _context.ConversationMembers
            .Where(x => x.MemberId == userId)
            .Select(x => new ConversationDto(
                x.Conversation.Id,
                x.Conversation.Name,
                x.Conversation.Members
                    .Select(x => x.Member.FirstName + " " + x.Member.LastName)
                    .ToArray(),
                x.Conversation.Messages
                    .OrderBy(x => x.Id)
                    .Select(x => new ConversationMessageDto(
                        x.Id,
                        x.SentAt,
                        x.Author.Id,
                        x.Author.FirstName + " " + x.Author.LastName,
                        x.Content))
                    .LastOrDefault()))
            .ToArrayAsync();

        // TODO: Look at the generated SQL

        return conversations;
    }

    public async Task<ConversationMessageDto[]> LoadMessages(Conversation conversation, DateTime? earliest)
    {
        var messages = await _context.ConversationMessages
            .Where(x => x.ConversationId == conversation.Id)
            .ProjectTo<ConversationMessageDto>(_mapper.ConfigurationProvider)
            .ToArrayAsync();

        return messages;
    }
}
