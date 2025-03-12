using System.Net;
using System.Text.Json.Serialization;
using BuntesBegegnen.Api.UserManagement;
using BuntesBegegnen.Api.Data;
using BuntesBegegnen.Api.Email;
using BuntesBegegnen.Api.Util;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Threading.RateLimiting;
using BuntesBegegnen.Api.Data.Entities;
using System.Net.Mail;
using RateLimiter = BuntesBegegnen.Api.Util.RateLimiter;
using Microsoft.OpenApi.Models;
using System.Reflection;
using Microsoft.AspNetCore.Authentication;
using System.Text.Json;
using System.Globalization;
using BuntesBegegnen.Api.Localization;
using Bundlor.Lib.Hosting;

// TODO: Rename project to Bundlor.Api

namespace BuntesBegegnen.Api;

public class Program
{
    private static async Task Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Host.UseDefaultServiceProvider(options =>
        {
            options.ValidateOnBuild = true;
            options.ValidateScopes = true;
        });

        if (builder.Environment.IsLocal())
        {
            builder.Configuration.AddUserSecrets(typeof(Program).Assembly);
        }

        var apiOptions = LoadConfiguration(builder);

        SetupSwagger(builder);
        await SetupProxy(builder, apiOptions);
        SetupAspNetCoreStuff(builder, apiOptions);
        SetupRateLimiting(builder, apiOptions);

        builder.Services.AddAutoMapper(options =>
            options.AddMaps(Assembly.GetAssembly(typeof(Program))));

        builder.Services.AddDbContext<BundlorWebContext>(options =>
            options.UseSqlite(
                builder.Configuration.GetConnectionString("Default")));

        SetupIdentity(builder, apiOptions);

        builder.Services.Configure<EmailOptions>(builder.Configuration.GetSection(EmailOptions.Key));

        builder.Services.AddScoped<IUserManager, UserManager>();
        builder.Services.AddScoped<IEmailSender, EmailSender>();
        builder.Services.AddScoped<IEmailGenerator, EmailGenerator>();
        builder.Services.AddScoped<ActivityStore>();
        //builder.Services.AddScoped<IConversationStore, ConversationStore>();
        builder.Services.AddScoped<InquiryHandler>();
        builder.Services.AddSingleton<RateLimiter>();

        //builder.Services.AddHostedService<Housekeeper>();
        builder.Services.AddHostedService<DatabaseSetup>();


        var app = builder.Build();

        var logger = app.Services.GetRequiredService<ILogger<Program>>();
        var info = $$"""
            Service started! Info:
            Hosting environment: {{app.Environment.EnvironmentName}}
            Preview mode is enabled: {{apiOptions.PreviewMode.IsEnabled}}
            User interaction is enabled: {{apiOptions.PreviewMode.EnableUserInteraction}}
            Registration password is set: {{apiOptions.PreviewMode.RegistrationPassword is not (null or "")}}
            Allowed email pattern for registration: {{apiOptions.PreviewMode.RegistrationAllowedEmailAddressPattern}}
            """;
        logger.LogInformation(LoggingCategories.Security, info);

        // Middleware order: https://learn.microsoft.com/en-us/aspnet/core/fundamentals/middleware/?view=aspnetcore-8.0#middleware-order

        app.UseExceptionHandler("/error");

        app.UseForwardedHeaders();
        if (app.Environment.IsLocal())
        {
            app.UseSwagger();
            app.UseSwaggerUI();
        }
        else
        {
            app.UseHsts();
        }

        //app.UseStatusCodePagesWithReExecute("/error", "?statusCode={0}");

        // NOTE: [RequireRateLimiting] is not available if this is registered here already.
        // We want to rate limit all requests, also the requests to static files.
        app.UseRateLimiter();

        app.UseStaticFiles();

        app.UseRouting();
        app.UseRequestLocalization();
        app.UseCors();

        app.UseAuthentication();
        app.UseAuthorization();

        app.UseMiddleware<LoggingScopeMiddleware>();

        app.MapRazorPages();
        app.MapControllers().RequireAuthorization();

        app.Run();
    }

    private static void SetupSwagger(WebApplicationBuilder builder)
    {
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(options =>
        {
            options.SupportNonNullableReferenceTypes();

            var scheme = new OpenApiSecurityScheme
            {
                Description = "Enter the authentication token (without the 'Bearer' prefix)",
                In = ParameterLocation.Header,
                Name = "Authorization",
                Scheme = "Bearer",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
            };
            options.AddSecurityDefinition("Bearer", scheme);

            options.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                [
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer",
                        },
                    }
                ] = (string[])[]
            });

            var filePath = Path.Combine(AppContext.BaseDirectory, "BuntesBegegnen.Api.xml");
            options.IncludeXmlComments(filePath);
        });
    }

    private static ApiOptions LoadConfiguration(WebApplicationBuilder builder)
    {
        var options = new ApiOptions();
        builder.Configuration.GetSection(ApiOptions.Key).Bind(options);
        builder.Services.AddSingleton(Options.Create(options));

        if (MailAddress.TryCreate(options.ContactEmailAddress, out _) == false)
        {
            throw new InvalidOperationException("The contact email address is not valid");
        }

        return options;
    }

    // TODO: Use Lib
    private static async Task SetupProxy(WebApplicationBuilder builder, ApiOptions bundlorWebOptions)
    {
        var proxyEntry = bundlorWebOptions.ProxyHostName is null or ""
            ? null
            : await Dns.GetHostEntryAsync(bundlorWebOptions.ProxyHostName);

        builder.Services.Configure<ForwardedHeadersOptions>(options =>
        {
            options.ForwardedHeaders = ForwardedHeaders.All;

            options.KnownProxies.Clear();
            if (proxyEntry != null)
            {
                foreach (var address in proxyEntry.AddressList)
                {
                    options.KnownProxies.Add(address);
                }
            }

            options.KnownNetworks.Clear();

            options.AllowedHosts.Clear();
            if (bundlorWebOptions.ProxyHostName is not (null or ""))
            {
                options.AllowedHosts.Add("localhost");
                options.AllowedHosts.Add("buntes-begegnen.de");
                options.AllowedHosts.Add("*.buntes-begegnen.de");
            }
        });
    }

    private static void SetupAspNetCoreStuff(WebApplicationBuilder builder, ApiOptions bundlorWebOptions)
    {
        /*
        builder.Services.AddRazorPages(options =>
        {
            options.Conventions.AuthorizeFolder("/Internal", PolicyNames.TeamMember);
            options.Conventions.AuthorizeFolder("/Admin", PolicyNames.Admin);

            if (bundlorWebOptions.PreviewMode?.IsEnabled == true)
            {
                options.Conventions.AuthorizeFolder("/");
            }
        });
        */

        builder.Services.AddControllers()
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(
                    new JsonStringEnumConverter(allowIntegerValues: false));
                options.JsonSerializerOptions.Converters.Add(
                    new DateTimeOffsetJsonConverter());
            });

        builder.Services.AddMvc(options =>
        {
            // TODO: https://www.lloydatkinson.net/posts/2023/consistent-kebab-cased-controller-routes-in-aspnet-core/
            //ModelBindingMessages.Customize(options.ModelBindingMessageProvider);
            options.ModelBinderProviders.Insert(0, new StringTrimmingModelBinderProvider());
            options.Filters.Add(new EmailConfirmationRedirectionFilter());  // NOTE: When introducing API controllers, this does not work I think
        });

        builder.Services.Configure<RouteOptions>(options =>
        {
            options.LowercaseUrls = true;
            options.LowercaseQueryStrings = true;
        });

        builder.Services.AddCors(options =>
            options.AddDefaultPolicy(
                policy => policy
                    .WithOrigins(bundlorWebOptions.AllowedCorsOrigins)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()));

        builder.Services.Configure<RequestLocalizationOptions>(options =>
        {
            options.SetDefaultCulture("de-DE")
                .AddSupportedCultures(["de-DE", "en-US"])
                .AddSupportedUICultures(["de-DE", "en-US"]);
        });

        builder.Services.AddHttpContextAccessor();
        builder.Services.AddTransient<IActionContextAccessor, ActionContextAccessor>();
    }

    private static void SetupRateLimiting(WebApplicationBuilder builder, ApiOptions bundlorWebOptions)
    {
        builder.Services.AddRateLimiter(options =>
        {
            var globalRateLimits = bundlorWebOptions.RateLimits.Where(
                x => x.ResourceId == RateLimitedResourceId.Global);

            options.GlobalLimiter = PartitionedRateLimiter.CreateChained(
                globalRateLimits.Select(x =>
                    PartitionedRateLimiter.Create<HttpContext, string>(
                        context => RateLimitPartition.GetTokenBucketLimiter(
                            context.Connection.RemoteIpAddress!.ToString(),
                            key => new TokenBucketRateLimiterOptions
                            {
                                AutoReplenishment = true,
                                QueueLimit = 100,
                                QueueProcessingOrder = QueueProcessingOrder.OldestFirst,
                                ReplenishmentPeriod = x.Period,
                                TokenLimit = x.PermitLimit,  // NOTE: This should be the same as a fixed window...
                                TokensPerPeriod = x.PermitLimit,
                            })))
                    .ToArray());
        });
    }

    private static void SetupIdentity(WebApplicationBuilder builder, ApiOptions bundlorWebOptions)
    {
        builder.Services.AddIdentity<User, IdentityRole>(options =>
        {
            options.User = new()
            {
                RequireUniqueEmail = true,
                // NOTE: UserName is email, make sure all valid email chars are allowed
                AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+ßäöü",
            };

            options.Password = new()
            {
                RequiredLength = UserManagement.PasswordOptions.RequiredLength,
                RequiredUniqueChars = UserManagement.PasswordOptions.RequiredUniqueChars,
                RequireNonAlphanumeric = UserManagement.PasswordOptions.RequireNonAlphanumeric,
                RequireLowercase = UserManagement.PasswordOptions.RequireLowercase,
                RequireUppercase = UserManagement.PasswordOptions.RequireUppercase,
                RequireDigit = UserManagement.PasswordOptions.RequireDigit,
            };

            options.ClaimsIdentity = new()
            {
                RoleClaimType = ClaimTypes.Role,
                UserNameClaimType = ClaimTypes.UserName,
                UserIdClaimType = ClaimTypes.UserId,
                EmailClaimType = ClaimTypes.Email,
                SecurityStampClaimType = ClaimTypes.SecurityStamp,
            };
        })
            .AddEntityFrameworkStores<BundlorWebContext>()
            .AddClaimsPrincipalFactory<ClaimsPrincipalFactory>();

        //builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme);
        builder.Services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = CompositeAuthenticationHandler.DefaultSchemeName;
            options.DefaultScheme = CompositeAuthenticationHandler.DefaultSchemeName;
            options.DefaultAuthenticateScheme = CompositeAuthenticationHandler.DefaultSchemeName;
            options.DefaultSignInScheme = CompositeAuthenticationHandler.DefaultSchemeName;
            options.DefaultSignOutScheme = CompositeAuthenticationHandler.DefaultSchemeName;
            options.DefaultChallengeScheme = CompositeAuthenticationHandler.DefaultSchemeName;
            options.DefaultForbidScheme = CompositeAuthenticationHandler.DefaultSchemeName;
        })
            .AddScheme<AuthenticationSchemeOptions, CompositeAuthenticationHandler>(CompositeAuthenticationHandler.DefaultSchemeName, null);

        builder.Services.ConfigureApplicationCookie(options =>
        {
            // TODO: Check that the URLs are still correct
            options.LoginPath = "/anmeldung";
            options.LogoutPath = "/abmeldung";
            options.AccessDeniedPath = "/zugriff-verweigert";

            options.Cookie.SameSite = SameSiteMode.None;
            options.ExpireTimeSpan = bundlorWebOptions.Authentication.CookieTimeToLive;

            options.Events.OnRedirectToLogin = context =>
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                return Task.CompletedTask;
            };

            options.Events.OnRedirectToAccessDenied = context =>
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                return Task.CompletedTask;
            };
        });

        builder.Services.AddAuthorizationBuilder()
            .AddPolicy(PolicyNames.TeamMember, builder => builder
                .RequireRole(RoleNames.TeamMember, RoleNames.Admin))
            .AddPolicy(PolicyNames.Admin, builder => builder
                .RequireAssertion(context =>
                    context.User.IsInRole(RoleNames.Admin) ||
                    context.User.HasClaim(UserManagement.ClaimTypes.AdminPasswordAuthorized, ClaimValueConstants.AdminPasswordIsAuthorized)));
    }
}


public class DateTimeOffsetJsonConverter : JsonConverter<DateTimeOffset>
{
    public override DateTimeOffset Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var s = reader.GetString() ??
            throw new InvalidOperationException("Could not read string");

        return DateTimeOffset.Parse(s, CultureInfo.InvariantCulture);
    }

    public override void Write(Utf8JsonWriter writer, DateTimeOffset value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString("o", CultureInfo.InvariantCulture));
    }
}
