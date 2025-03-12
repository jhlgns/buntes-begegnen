using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit.Abstractions;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Data.Sqlite;
using BuntesBegegnen.Api.Data;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.EntityFrameworkCore;
using BuntesBegegnen.Api.Email;
using Microsoft.AspNetCore.Builder;
using System.Net;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Memory;
using System.Security.Cryptography;
using BuntesBegegnen.Api.Util;

namespace BuntesBegegnen.Api.Tests.Shared;

/*
class MockDatabaseSetup : IDatabaseSetup
{
    private readonly IServiceScope _scope;
    private readonly BundlorWebContext _context;

    public MockDatabaseSetup(IServiceProvider serviceProvider)
    {
        _scope = serviceProvider.CreateScope();
        _context = _scope.ServiceProvider.GetRequiredService<BundlorWebContext>();
    }

    public Task StartAsync(CancellationToken cancellationToken)
    {
        return _context.Database.MigrateAsync(cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken)
    {
        return Task.CompletedTask;
    }

    public void Dispose()
    {
    }
}
*/

public class BundlorWebApplicationFactory : WebApplicationFactory<Program>
{
    public ITestOutputHelper? OutputHelper { get; set; }

    protected override IHost CreateHost(IHostBuilder builder)
    {
        // https://github.com/dotnet/aspnetcore/issues/37680
        builder.ConfigureHostConfiguration(configBuilder =>
        {
            var configuration = new ConfigurationBuilder()
                .AddUserSecrets(typeof(BundlorWebApplicationFactory).Assembly, true, true)
                .Build();

            configBuilder.AddConfiguration(configuration);

            configBuilder.Sources.Add(new MemoryConfigurationSource
            {
                InitialData = new Dictionary<string, string>
                {
                    ["BundlorWeb:AdminAccount:Password"] = "iwantaferrari2u7839!j=-",
                }!
            });
        });
        return base.CreateHost(builder);
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        base.ConfigureWebHost(builder);

        builder.UseEnvironment("UnitTest");

        builder
            .ConfigureTestServices(services =>
            {
                services.PostConfigure<RazorPagesOptions>(options =>
                    options.Conventions.ConfigureFilter(new IgnoreAntiforgeryTokenAttribute()));

                services.AddLogging(options => options
                    .ClearProviders()
                    .AddProvider(new TestLoggerProvider(
                        () => OutputHelper ?? throw new($"The {nameof(OutputHelper)} is not set"))));

                var tempFile = Path.Join(Path.GetTempPath(), $"{RandomNumberGenerator.GetHexString(6, lowercase: true)}.db");
                var connection = new SqliteConnection($"Data Source={tempFile}");
                connection.Open();

                var dbName = $"{GetType().FullName}:{Guid.NewGuid()}";
                services.RemoveAll(typeof(DbContextOptions<BundlorWebContext>));
                services.AddDbContext<BundlorWebContext>(options => options.UseSqlite(connection));

                //services.RemoveAll<IDatabaseSetup>();
                //services.AddSingleton<IDatabaseSetup, MockDatabaseSetup>();

                services.RemoveAll<IEmailSender>();
                services.AddScoped<IEmailSender, MockEmailSender>();

                services.AddTransient<IStartupFilter, BundlorWebApplicationFactoryStartupFilter>();
            });
    }
}

public class BundlorWebApplicationFactoryStartupFilter : IStartupFilter
{
    public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next)
    {
        return app =>
        {
            app.Use((context, next) =>
            {
                context.Connection.RemoteIpAddress = IPAddress.Loopback;
                return next(context);
            });

            next(app);
        };
    }
}
