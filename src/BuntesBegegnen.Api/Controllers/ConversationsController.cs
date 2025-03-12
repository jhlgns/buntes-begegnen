#if false

using BuntesBegegnen.Api.Data;
using BuntesBegegnen.Api.UserManagement;
using Microsoft.AspNetCore.Mvc;

namespace BuntesBegegnen.Api.Controllers;

[ApiController]
[Route("conversations")]
public class ConversationsController : ControllerBase
{
    private readonly IConversationStore _store;

    public ConversationsController(IConversationStore store)
    {
        _store = store;
    }

    [HttpPost("{conversationId}")]
    public async Task<ActionResult> PostMessage(int conversationId, string content)
    {
        var userId = User.RequireUserId();

        var conversation = await _store.FindConversation(conversationId);
        if (conversation == null)
        {
            return NotFound();
        }

        await _store.SendMessage(conversation, userId, content);

        return Ok();
    }

    [HttpGet]
    public async Task<ActionResult<ConversationDto[]>> LoadConversations()
    {
        var userId = User.RequireUserId();
        var conversations = await _store.LoadConversations(userId);

        return Ok(conversations);
    }

    [HttpGet("{conversationId}")]
    public async Task<ActionResult<ConversationMessageDto[]>> LoadConversation(int conversationId)
    {
        await Task.CompletedTask;
        return Ok();
    }
}

#endif
