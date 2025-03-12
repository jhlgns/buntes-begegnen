#if false

using AutoMapper;
using AutoMapper.QueryableExtensions;
using BuntesBegegnen.Api.Data;
using BuntesBegegnen.Api.Data.Entities;
using BuntesBegegnen.Api.UserManagement;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuntesBegegnen.Api.Controllers;

[ApiController]
[Route("promoters")]
public class PromotersController : ControllerBase
{
    private readonly BundlorWebContext _context;
    private readonly IMapper _mapper;

    public PromotersController(BundlorWebContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet]
    [Authorize(PolicyNames.TeamMember)]
    public async Task<ActionResult<PromoterDto>> Get()
    {
        var result = await _context.Promoters
            .ProjectTo<PromoterDto>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return Ok(result);
    }
}

#endif
