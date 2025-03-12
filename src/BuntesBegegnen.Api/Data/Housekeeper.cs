#if false

using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BuntesBegegnen.Api.Data;

public class Housekeeper : BackgroundService
{
    private readonly IServiceScope _scope;
    private readonly BundlorWebContext _context;
    private readonly ILogger<Housekeeper> _logger;
    private readonly BundlorWebOptions _options;

    public Housekeeper(IServiceProvider serviceProvider)
    {
        _scope = serviceProvider.CreateScope();

        _context = _scope.ServiceProvider.GetRequiredService<BundlorWebContext>();
        _logger = _scope.ServiceProvider.GetRequiredService<ILogger<Housekeeper>>();
        _options = _scope.ServiceProvider.GetRequiredService<IOptions<BundlorWebOptions>>().Value;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Starting house keeper service");

        while (stoppingToken.IsCancellationRequested == false)
        {
            _logger.LogInformation("Doing the housekeeping");

            //await DeleteExpiredEmailConfirmationCodes();

            _logger.LogInformation("Waiting for {Duration}", _options.HousekeepingInterval);
            await Task.Delay(_options.HousekeepingInterval, stoppingToken);
        }

        _logger.LogInformation("Stopping the housekeeping loop");
    }

#if false
    private async Task DeleteExpiredEmailConfirmationCodes()
    {
        var codesDeleted = await _context.EmailConfirmationCodes
            .Where(x => x.Expiry <= DateTime.Now)
            .ExecuteDeleteAsync();

        _logger.LogInformation("Deleted {CodesDeleted} email confirmation codes", codesDeleted);
    }
#endif

    public override void Dispose()
    {
        base.Dispose();
        GC.SuppressFinalize(this);
        _scope.Dispose();
    }
}

#endif
