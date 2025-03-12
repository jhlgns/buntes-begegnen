using BuntesBegegnen.Api.UserManagement;
using BuntesBegegnen.Api.Email;
using BuntesBegegnen.Api.Data.Entities;
using AutoMapper;

namespace BuntesBegegnen.Api.Data;

public class InquiryHandler
{
    private readonly BundlorWebContext _context;
    private readonly IEmailGenerator _emailGenerator;
    private readonly IUserManager _userManager;
    private readonly ILogger<InquiryHandler> _logger;
    private readonly IMapper _mapper;

    public InquiryHandler(
        BundlorWebContext context,
        IEmailGenerator emailGenerator,
        IUserManager userManager,
        ILogger<InquiryHandler> logger,
        IMapper mapper)
    {
        _context = context;
        _emailGenerator = emailGenerator;
        _userManager = userManager;
        _logger = logger;
        _mapper = mapper;
    }

    public async Task HandleInquiry(CreateInquiryDto dto)
    {
        _logger.LogInformation("Storing inquiry");

        var inquiry = _mapper.Map<Inquiry>(dto);

        _context.Inquiries.Add(inquiry);
        await _context.SaveChangesAsync();

        var usersToNotify = await _userManager.ListUsersInRole(RoleNames.InquiryRecipient);

        _logger.LogInformation(
            "Notifying users about inquiry: {UserList}",
            string.Join(", ", usersToNotify.Select(x => x.Email)));

        await _emailGenerator.NotifiyAboutInquiry(usersToNotify, inquiry, dto.IsAnonymous);
    }
}
