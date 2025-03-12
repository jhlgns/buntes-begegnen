using BuntesBegegnen.Api.Data.Entities;
using BuntesBegegnen.Api.UserManagement;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace BuntesBegegnen.Api.Data;

public class DatabaseSetup : IHostedService, IDisposable
{
    private readonly IServiceScope _scope;
    private readonly UserManager<User> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly BundlorWebContext _context;
    private readonly ApiOptions _options;
    private readonly ILogger<DatabaseSetup> _logger;
    private bool _wasDisposed;

    public DatabaseSetup(IServiceProvider serviceProvider)
    {
        _scope = serviceProvider.CreateScope();

        _userManager = _scope.ServiceProvider.GetRequiredService<UserManager<User>>();
        _roleManager = _scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        _context = _scope.ServiceProvider.GetRequiredService<BundlorWebContext>();
        _options = _scope.ServiceProvider.GetRequiredService<IOptions<ApiOptions>>().Value;
        _logger = _scope.ServiceProvider.GetRequiredService<ILogger<DatabaseSetup>>();
    }

    public Task StartAsync(CancellationToken cancellationToken)
        => Run();

    public Task StopAsync(CancellationToken cancellationToken)
        => Task.CompletedTask;

    private async Task Run()
    {
        _logger.LogInformation("Running database setup");

        await _context.Database.MigrateAsync();

        await EnsureRoles();
        var admin = await EnsureAdminUser();
        var promoter = await EnsureDefaultPromoter(admin);

        if (_options.SeedBogusData)
        {
            await SeedBogusActivities(admin, promoter);
        }

        _logger.LogInformation("Database setup done");
    }

    private async Task EnsureRoles()
    {
        foreach (var roleName in RoleNames.All)
        {
            var role = await _roleManager.FindByNameAsync(roleName);
            if (role != null)
            {
                _logger.LogDebug("Role {RoleName} exists", roleName);
                continue;
            }

            _logger.LogInformation("Role {RoleName} does not exist, creating", roleName);

            role = new() { Name = roleName };
            await _roleManager.CreateAsync(role);
        }
    }

    private async Task<User> EnsureAdminUser()
    {
        var adminOptionsInvalid =
            _options.AdminAccount.Email == "" ||
            _options.AdminAccount.Password == "";
        if (adminOptionsInvalid)
        {
            _logger.LogError("Invalid admin options");
            throw new InvalidOperationException("Invalid admin options");
        }

        var admin = await _userManager.FindByEmailAsync(_options.AdminAccount.Email);
        if (admin != null)
        {
            _logger.LogDebug("Admin user found");
        }
        else
        {
            _logger.LogInformation("Admin user not found, creating");

            admin = new()
            {
                UserName = _options.AdminAccount.Email,
                Email = _options.AdminAccount.Email,
                EmailConfirmed = true,

                CreatedAt = DateTimeOffset.UtcNow,
                FirstName = "Admin",
                LastName = "Adminsson",
                BirthDay = new(1970, 1, 1),
                StreetName = "Adminweg",
                HouseNumber = "24",
                ZipCode = "13337",
                City = "Adminheim",
                Goals = null,
                Hobbies = null,
                ImpairedSight = false,
                ImpairedHearing = false,
                ImpairedSpeech = false,
                ImpairedMobility = false,
                AdditionalHandicaps = null,
            };

            var result = await _userManager.CreateAsync(admin, _options.AdminAccount.Password);
            if (result.Succeeded == false)
            {
                _logger.LogError("Failed to create admin user: {Result}", result);
                throw new InvalidOperationException("Could not create admin user");
            }
        }

        // Check and update password
        var passwordIsValid = await _userManager.CheckPasswordAsync(admin, _options.AdminAccount.Password);
        if (passwordIsValid == false)
        {
            _logger.LogInformation("Changing admin password");
            admin.PasswordHash = _userManager.PasswordHasher.HashPassword(admin, _options.AdminAccount.Password);
            await _userManager.UpdateAsync(admin);
        }
        else
        {
            _logger.LogInformation("The admin password is up-to-date");
        }

        foreach (var roleName in RoleNames.All)
        {
            if (await _userManager.IsInRoleAsync(admin, roleName) == false)
            {
                _logger.LogInformation(
                    "Admin is not in role {RoleName}, adding to role",
                    roleName);
                await _userManager.AddToRoleAsync(admin, roleName);
            }
        }

        return admin;
    }

    public async Task<Promoter> EnsureDefaultPromoter(User admin)
    {
        if (_options.DefaultPromoter.Name is null or "")
        {
            throw new InvalidOperationException("The default promoter options are invalid");
        }

        var buntesBegegnen = await _context.Promoters.FirstOrDefaultAsync(x => x.Name == _options.DefaultPromoter.Name);
        if (buntesBegegnen == null)
        {
            _logger.LogInformation("Creating the default promoter with name {Name}", _options.DefaultPromoter.Name);

            buntesBegegnen = new()
            {
                CreatedAt = DateTimeOffset.UtcNow,
                CreatedById = admin.Id,
                Name = _options.DefaultPromoter.Name,
                Website = _options.DefaultPromoter.Website,
                StreetName = _options.DefaultPromoter.StreetName,
                HouseNumber = _options.DefaultPromoter.HouseNumber,
                ZipCode = _options.DefaultPromoter.ZipCode,
                City = _options.DefaultPromoter.City,
            };

            _context.Promoters.Add(buntesBegegnen);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Default promoter created, id: {Id}", buntesBegegnen.Id);
        }
        else
        {
            _logger.LogInformation("The default promoter exists");
        }

        if (admin.PromoterId != buntesBegegnen.Id)
        {
            _logger.LogInformation("Setting the promoter ID of the admin user to {PromoterId}", buntesBegegnen.Id);
            admin.PromoterId = buntesBegegnen.Id;
            await _context.SaveChangesAsync();
        }
        else
        {
            _logger.LogInformation("The admin user is already correctly assigned to the default promoter");
        }

        return buntesBegegnen;
    }


    public async Task SeedBogusActivities(User admin, Promoter promoter)
    {
        _logger.LogInformation("Ensuring initial activities");

        var activities = new List<Activity>
        {
            new()
            {
                CreatedById = admin.Id,
                CreatedAt   = DateTimeOffset.UtcNow,
                PromoterId  = promoter.Id,
                Visibility  = ActivityVisibility.Public,
                Title       = "Stammtisch Buntes Begegnen",
                Category    = ActivityCategory.Excursion,
                StartTime   = AsUtc(2024, 7, 2, 18, 0),
                EndTime     = AsUtc(2024, 7, 2, 20, 0),
                IsAllDay    = false,
                MaxNumberOfParticipants = 30,
                RegistrationLocked = true,
                Location    = "Marktplatz 11, 64283 Darmstadt",
                Description = """
                Jeden ersten Dienstag im Monat findet der
                Stammtisch Buntes Begegnen statt.
                In der Zeit von 18:00 Uhr bis 20:00 Uhr kannst du im
                Café Extrablatt in den Aus-tausch mit
                Mit-menschen kommen.
                Hier kannst du dir Speisen und Getränke bestellen.
                Das Café Extrablatt befindet sich am
                Marktplatz 11 in 64283 Darmstadt.
                Wir freuen uns auf deine Teil-nahme!
                """,
                RecurrenceFrequency = ActivityRecurrenceFrequency.Monthly,
                RecurrenceInterval = 1,
                RepeatUntil = DateOnly.FromDateTime(DateTimeOffset.UtcNow.AddYears(2).Date),
                RepeatCount = null,
                RecurrenceByDay =
                [
                    new ActivityRecurrenceByDay()
                    {
                        ActivityId = 0,
                        Ordinal = 1,
                        DayOfWeek = DayOfWeek.Tuesday,
                    },
                ],
            },
            new()
            {
                CreatedById = admin.Id,
                CreatedAt   = DateTimeOffset.UtcNow,
                PromoterId  = promoter.Id,
                Visibility  = ActivityVisibility.Public,
                Title       = "Bibelkreis für alle",
                Category    = ActivityCategory.Excursion,
                StartTime   = AsUtc(2024, 7, 4, 16, 30),
                EndTime     = AsUtc(2024, 7, 4, 17, 30),
                IsAllDay    = false,
                MaxNumberOfParticipants = 20,
                RegistrationLocked = true,
                Location    = "Wichernstraße 4b, Mühltal",
                Description = """
                Der Bibelkreis wird von der evangelischen Gemeinde
                Nieder-Ramstadt veranstaltet.
                Er findet an folgenden Terminen statt:
                4. Juli. 1. August und 5. September.
                Ab 16:30 Uhr bis 17:30 Uhr wird
                gemeinsam über die Bibel gesprochen.
                Dieses Jahr sprechen wir über Psalme.
                Wir beten und wir singen.
                Komm dafür in den I-Bau der NRD
                in der Wichernstr. 4b in 64367 Mühltal.
                Bei Fragen und An-liegen kannst du dich an
                Wolfgang Bonnet wenden:
                E-Mail: Wolfgang.Bonnet@nrd.de
                Telefon: 0160 6147440
                """,
                RecurrenceFrequency = ActivityRecurrenceFrequency.FixedDates,
                RecurrenceInterval = 1,
                RepeatUntil = null,
                RepeatCount = null,
                RecurrenceDates =
                [
                    new ActivityRecurrenceDate
                    {
                        ActivityId = 0,
                        StartTime = AsUtc(2024, 8, 1, 16, 30),
                    },
                    new ActivityRecurrenceDate
                    {
                        ActivityId = 0,
                        StartTime = AsUtc(2024, 9, 5, 16, 30),
                    },
                ],
            },
            new()
            {
                CreatedById = admin.Id,
                CreatedAt   = DateTimeOffset.UtcNow,
                PromoterId  = promoter.Id,
                Visibility  = ActivityVisibility.Public,
                Title       = "SV 98 Offenes Training",
                Category    = ActivityCategory.Exercise,
                StartTime   = AsUtc(2024, 7, 13, 10, 0),
                EndTime     = AsUtc(2024, 7, 13, 12, 0),
                IsAllDay    = false,
                MaxNumberOfParticipants = 20,
                RegistrationLocked = false,
                Location    = "Schreberweg 52, 64289 Darmstadt",
                Description = """
                Der Sportverein Darmstadt 1898 veranstaltet offene
                Trainings für Menschen mit Einschränkungen.
                Auf dem Sport-platz Merck werden die
                Trainings-spiele statt-finden.
                Die Termine sind am 13. und 27. Juli und am 17. August.
                Von 10:00 Uhr bis 12:00 Uhr kannst du
                bei Interesse mit-spielen.
                Der Sport-platz und die Sport-halle von Merck befinden
                sich im Schreberweg 52 in
                64289 Darmstadt.
                Bei Interesse kannst du dich per E-Mail an-melden:
                ruben.doering@sv98.de
                eckhard.doering@sv98.de
                """,
                RecurrenceFrequency = ActivityRecurrenceFrequency.FixedDates,
                RecurrenceInterval = 1,
                RepeatUntil = null,
                RepeatCount = null,
                RecurrenceDates =
                [
                    new ActivityRecurrenceDate
                    {
                        ActivityId = 0,
                        StartTime = AsUtc(2024, 7, 27, 10, 00),
                    },
                    new ActivityRecurrenceDate
                    {
                        ActivityId = 0,
                        StartTime = AsUtc(2024, 8, 17, 10, 00),
                    },
                ],
            },
            new()
            {
                CreatedById = admin.Id,
                CreatedAt   = DateTimeOffset.UtcNow,
                PromoterId  = promoter.Id,
                Visibility  = ActivityVisibility.Public,
                Title       = "Inklusives Klettern mit dem Alpenverein",
                Category    = ActivityCategory.Exercise,
                StartTime   = AsUtc(2024, 7, 20, 9, 30),
                EndTime     = AsUtc(2024, 7, 20, 12, 0),
                IsAllDay    = false,
                MaxNumberOfParticipants = 25,
                RegistrationLocked = false,
                Location    = "Lichtwiesenweg 15, 64287 Darmstadt",
                Description = """
                Carsten, Gudrun, Heike und Matthias leiten eine
                Kletter-gruppe für Erwachsene mit Einschränkungen.
                Jeden dritten Samstag im Monat hast du die
                Gelegenheit von 9:30 Uhr bis 12:00 Uhr zu klettern.
                Du hast Spaß am Klettern oder
                möchtest es aus-probieren?
                Dann komm dafür in die Kletter-halle Darmstadt im
                Lichtwiesenweg 15 in 64287 Darmstadt.
                Wenn du Lust am Klettern hast,
                kannst du dich bei Carsten oder Gudrun an-melden.
                Carsten teilhabe@alpenverein-darmstadt.de
                Gudrun gudrun.kreutz@t-online.de
                """,
                RecurrenceFrequency = ActivityRecurrenceFrequency.Monthly,
                RecurrenceInterval = 1,
                RepeatUntil = DateOnly.FromDateTime(DateTimeOffset.UtcNow.AddYears(2).Date),
                RepeatCount = null,
                RecurrenceByDay =
                [
                    new ActivityRecurrenceByDay
                    {
                        ActivityId = 0,
                        Ordinal = 3,
                        DayOfWeek = DayOfWeek.Saturday,
                    },
                ],
            },
            new()
            {
                CreatedById = admin.Id,
                CreatedAt   = DateTimeOffset.UtcNow,
                PromoterId  = promoter.Id,
                Visibility  = ActivityVisibility.Public,
                Title       = "Malgruppe BeWo",
                Category    = ActivityCategory.Creativity,
                StartTime   = AsUtc(2024, 7, 26, 15, 0),
                EndTime     = AsUtc(2024, 7, 26, 17, 0),
                IsAllDay    = false,
                MaxNumberOfParticipants = 20,
                RegistrationLocked = false,
                Location    = "Grafenstraße 31A, 64283 Damstadt",
                Description = """
                Jeden letzten Freitag im Monat findet ab 17:00 Uhr eine
                Mal-gruppe statt.
                Im BeWo Darmstadt hast du die Gelegenheit,
                kreativ zu werden.
                Bis etwa 19:00 Uhr kannst du dich im Malen aus-probieren.
                Das BeWo Darmstadt befindet sich
                in der Grafenstraße 31A in 64283 Darmstadt.
                Bei Fragen kannst du dich bei BeWo Darmstadt melden:
                Telefon: 06151 3972777
                E-Mail: bwd@bwdev.de
                """,
                RecurrenceFrequency = ActivityRecurrenceFrequency.Monthly,
                RecurrenceInterval = 1,
                RepeatUntil = DateOnly.FromDateTime(DateTimeOffset.UtcNow.AddYears(2).Date),
                RepeatCount = null,
                RecurrenceByDay =
                [
                    new ActivityRecurrenceByDay
                    {
                        ActivityId = 0,
                        Ordinal = -1,
                        DayOfWeek = DayOfWeek.Friday,
                    },
                ],
            },
            new()
            {
                CreatedById = admin.Id,
                CreatedAt   = DateTimeOffset.UtcNow,
                PromoterId  = promoter.Id,
                Visibility  = ActivityVisibility.Public,
                Title       = "Inklusives Tanzen",
                Category    = ActivityCategory.Exercise,
                StartTime   = AsUtc(2024, 8, 30, 16, 0),
                EndTime     = AsUtc(2024, 8, 30, 20, 0),
                IsAllDay    = false,
                MaxNumberOfParticipants = null,
                RegistrationLocked = false,
                Location    = "Centralstation Darmstadt",
                Description = """
                Am 30. August beginnt um 18:00 Uhr das
                Inklusive Tanzen in der Centralstation Darmstadt.
                Erwachsene Menschen mit und ohne Einschränkungen
                können gemeinsam tanzen und Spaß haben.
                Für Party-stimmung wird gesorgt.
                Getränke könnt ihr euch vor Ort kaufen.
                Tickets gibt es für 5 € an der Abend-kasse.
                """,
                RecurrenceFrequency = ActivityRecurrenceFrequency.None,
                RecurrenceInterval = null,
                RepeatUntil = null,
                RepeatCount = null,
            },
            new()
            {
                CreatedById = admin.Id,
                CreatedAt   = DateTimeOffset.UtcNow,
                PromoterId  = promoter.Id,
                Visibility  = ActivityVisibility.Public,
                Title       = "StammZelle von Zwischenräume",
                Category    = ActivityCategory.Excursion,
                StartTime   = AsUtc(2024, 7, 30, 14, 0),  // TODO: StartDate is missing in the newsletter
                EndTime     = AsUtc(2024, 7, 30, 16, 0),
                IsAllDay    = true,
                MaxNumberOfParticipants = null,
                RegistrationLocked = false,
                Location    = "(Bitte Ort eingeben)",
                Description = """
                Alle vier Wochen findet die inklusive StammZelle statt.
                Der Veranstaltungs-ort wird immer
                gemeinsam ab-gestimmt.
                Da hast du die Möglichkeit,
                neue Menschen kennen-zu-lernen
                oder bekannte Menschen wieder-zu-sehen.
                Wenn du das erste Mal dabei bist,
                kannst du kosten-los teil-nehmen.
                Ansonsten gibt es eine
                Teil-nahme-gebühr von 12 €.
                Für die Teil-nahme musst du dich
                bei Elke Hitzel an-melden.
                Sie steht dir auch bei Fragen zur Verfügung:
                Telefon: 06151 1308899
                E-Mail: info@zwischenraeume-da.de
                """,
                RecurrenceFrequency = ActivityRecurrenceFrequency.Weekly,
                RecurrenceInterval = 4,
                RepeatUntil = DateOnly.FromDateTime(DateTimeOffset.UtcNow.AddYears(2).Date),
                RepeatCount = null,
            },
            new()
            {
                CreatedById = admin.Id,
                CreatedAt   = DateTimeOffset.UtcNow,
                PromoterId  = promoter.Id,
                Visibility  = ActivityVisibility.Public,
                Title       = "ZwischenRäume Brunch",
                Category    = ActivityCategory.Excursion,
                StartTime   = AsUtc(2024, 7, 20, 11, 0),
                EndTime     = AsUtc(2024, 7, 20, 14, 0),
                IsAllDay    = false,
                MaxNumberOfParticipants = null,
                RegistrationLocked = false,
                Location    = "Adelungstr. 53, 64283 Darmstadt",
                Description = """
                Jeden Samstag von 11:00 Uhr bis 14:00 Uhr
                gibt ein leckeres Früh-stück.
                Komm dafür in die ZwischenRäume Darmstadt
                in die Adelungstr. 53, 64283 Darmstadt.
                Es gibt warme und kalte Speisen
                und Getränke zu günstigen Preisen.
                Dabei hast du die Möglichkeit deine Lieblings-musik
                zu hören und nette Menschen zu treffen.
                Neben-bei kannst du dich über bestehende
                An-gebote in der Region informieren.
                Du kannst dich über diese An-gebote aus-tauschen.
                Oder bringe neue Vor-schläge ein.
                Bitte melde dich vorher bei Elke Hitzel an:
                Telefon: 06151 1308899
                E-Mail: info@zwischenraeume-da.de
                """,
                RecurrenceFrequency = ActivityRecurrenceFrequency.Weekly,
                RecurrenceInterval = 1,
                RepeatUntil = DateOnly.FromDateTime(DateTimeOffset.UtcNow.AddYears(2).Date),
                RepeatCount = null,
            },
            new()
            {
                CreatedById = admin.Id,
                CreatedAt   = DateTimeOffset.UtcNow,
                PromoterId  = promoter.Id,
                Visibility  = ActivityVisibility.Public,
                Title       = "ZwischenRäume Montagscafé",
                Category    = ActivityCategory.Creativity,
                StartTime   = AsUtc(2024, 7, 22, 16, 0),
                EndTime     = AsUtc(2024, 7, 22, 19, 0),
                IsAllDay    = false,
                MaxNumberOfParticipants = null,
                RegistrationLocked = false,
                Location    = "Adelungenstr. 53, 64283 Darmstadt",
                Description = """
                Jeden Montag von 16:00 Uhr bis 19:00 Uhr
                findet ein An-gebot statt.
                Komm dafür in die ZwischenRäume Darmstadt
                in die Adelungstr. 53, 64283 Darmstadt.
                Es gibt Snacks und Getränke zu günstigen Preisen.
                Hier kannst du Menschen treffen
                und verschiedene Dinge aus-probieren.
                Inge Birner aus der Aumühle bietet ein
                gemeinsames Hand-arbeiten an.
                Melde dich vorher bei Elke Hitzel an und komm dazu.
                Telefon: 06151 1308899
                E-Mail: info@zwischenraeume-da.de
                """,
                RecurrenceFrequency = ActivityRecurrenceFrequency.Weekly,
                RecurrenceInterval = 1,
                RepeatUntil = DateOnly.FromDateTime(DateTimeOffset.UtcNow.AddYears(2).Date),
                RepeatCount = null,
            },
            new()
            {
                CreatedById = admin.Id,
                CreatedAt   = DateTimeOffset.UtcNow,
                PromoterId  = promoter.Id,
                Visibility  = ActivityVisibility.Public,
                Title       = "Mal-an-gebot mit Karin Cikes",
                Category    = ActivityCategory.Creativity,
                StartTime   = AsUtc(2024, 9, 27, 17, 30),
                EndTime     = AsUtc(2024, 9, 27, 20, 0),
                IsAllDay    = false,
                MaxNumberOfParticipants = null,
                RegistrationLocked = false,
                Location    = "Mahalia-Jackson-Str. 1c, 64285 Darmstadt",
                Description = """
                Am 27. September bietet Karin Cikes
                das nächste Mal-angebot an.
                Um 17:30 Uhr beginnt der Mal-spaß und geht bis
                20:00 Uhr.
                Du brauchst keine Vor-kenntnisse
                oder Mal-sachen. Dafür ist vor Ort gesorgt.
                Das An-gebot findet in der Mahalia-Jackson-Str. 1c in
                64285 Darmstadt statt.
                Deine Ansprech-partnerin ist Karin Cikes.
                Sie steht dir telefonisch und
                per E-Mail zur Verfügung.
                Telefon: 0178 5648819
                E-Mail: karin@cikes.de
                """,
                RecurrenceFrequency = ActivityRecurrenceFrequency.None,
                RecurrenceInterval = null,
                RepeatUntil = null,
                RepeatCount = null,
            },
            new()
            {
                CreatedById = admin.Id,
                CreatedAt   = DateTimeOffset.UtcNow,
                PromoterId  = promoter.Id,
                Visibility  = ActivityVisibility.SharedDraft,
                Title       = "Mobilitäts-schulung (TODO)",
                Category    = ActivityCategory.Excursion,
                StartTime   = AsUtc(2024, 9, 9, 9, 0),
                EndTime     = AsUtc(2024, 9, 9, 12, 0),
                IsAllDay    = false,
                MaxNumberOfParticipants = null,
                RegistrationLocked = false,
                Location    = "Mobilitäts-schulung [TODO: Hier fehlen viele Informationen]",
                Description = """
                Menschen mit Lern-schwierigkeiten können über die
                Web-site MobiLE lernen, selbst-ständig mobil zu sein.
                Dort gibt es Informationen und Materialien für das
                Training.
                Man kann verschiedene Lern-bereiche auswählen:
                Bus und Bahn fahren
                Zu Fuß gehen
                Fahrrad fahren
                Es gibt Übungs-pakete zum Herunter-laden.
                Für Fach-kräfte gibt es auch Hin-weise.
                Mehr Hinweise gibt es auf der Web-site:
                https://www.xn--mobilitt-lernen-6kb.de/startseite
                """,
                RecurrenceFrequency = ActivityRecurrenceFrequency.None,
                RecurrenceInterval = null,
                RepeatUntil = null,
                RepeatCount = null,
            },
            new()
            {
                CreatedById = admin.Id,
                CreatedAt   = DateTimeOffset.UtcNow,
                PromoterId  = promoter.Id,
                Visibility  = ActivityVisibility.Public,
                Title       = "Radeln ohne Alter Darmstadt [TODO: Hier fehlen Informationen]",
                Category    = ActivityCategory.Exercise,
                StartTime   = AsUtc(2024, 7, 4, 17, 30),
                EndTime     = AsUtc(2024, 7, 4, 19, 30),
                IsAllDay    = false,
                MaxNumberOfParticipants = null,
                RegistrationLocked = false,
                Location    = "(Bitte Ort eingeben)",
                Description = """
                Radeln ohne Alter bietet Aus-flüge mit
                der Fahr-rad-Rikscha an.
                Die Fahrten sind kosten-los.
                Hier kannst du dich an-melden:
                E-Mail: zentrale@roa-darmstadt.de
                Telefon: 06151 599 5742
                Die Stand-orte der Rikschas sind:
                DRK Seniorenzentrum Fiedlersee
                Im Fiedlersee 43 in 64291 Darmstadt
                Telefon: 06151 93 53 180
                E-Mail: sozialdienst@drk-starkenburg.de
                Wohnpark Kranichstein
                Borsdorffstraße 40 in 64289 Darmstadt
                Telefon: 06151 739 0
                E-Mail: info@wohnparl-kranichstein.de
                """,
                RecurrenceFrequency = ActivityRecurrenceFrequency.None,
                RecurrenceInterval = null,
                RepeatUntil = null,
                RepeatCount = null,
            },
        };

        foreach (var activity in activities)
        {
            var found = await _context.Activities.Where(x => x.Title == activity.Title).ToListAsync();
            if (found.Count > 0)
            {
                if (_options.OverwriteInitialActivities)
                {
                    _context.Activities.RemoveRange(found);
                }
                else
                {
                    continue;
                }
            }
            else
            {
                _logger.LogInformation("No activity with title {Title} found, creating it", activity.Title);
            }

            _context.Activities.Add(activity);
        }

        await _context.SaveChangesAsync();
    }

    private static DateTimeOffset AsUtc(int year, int month, int day, int hour, int minute)
    {
        var dateTime = new DateTimeOffset(year, month, day, hour, minute, 0, TimeSpan.Zero)
            .Subtract(DateTimeOffset.Now.Offset);
        return dateTime;
    }

    protected virtual void Dispose(bool disposing)
    {
        if (_wasDisposed)
        {
            return;
        }

        if (disposing)
        {
            _scope.Dispose();
        }

        _wasDisposed = true;
    }

    public void Dispose()
    {
        // Do not change this code. Put cleanup code in 'Dispose(bool disposing)' method
        Dispose(disposing: true);
        GC.SuppressFinalize(this);
    }
}


/*

ChatGPT Prompt:

Stell dir ein Projekt vor, das sich zum Ziel setzt, Menschen mit Einschränkungen, die in Wohnheimen wohnen, die Teilhabe an der Gesellschaft zu erleichtern. Das Projekt besteht aus Begleitern, Teilnehmern und Trägern. Die Begleiter begleiten die Teilnehmer zu Veranstaltungen und betreuen sie da. Außerdem gibt es lokale Träger außerhalb vom Projekt, die Veranstaltungen anbieten können. Generiere eine Liste von 8 Ideen, für Veranstaltungen, die barrierefrei und pädagogisch wertvoll sind. Jede Veranstaltung soll einen Titel und eine Beschreibung mit ca. 2-3 Sätzen in deutscher Sprache haben. Der Titel und die Beschreibung sollen ansprechend und leicht verständlich sein. Gib außerdem in jeder der Beschreibungen einen Hinweis, dass diese Idee von ChatGPT generiert wurde und lediglich als Platzhalter dient.
Schreibe die Liste von Ideen als eine C#-Liste von Objekten mit deutschen Titeln und Beschreibungen. Wähle für das Feld "Category" einen passenden Wert aus "ActivityCategory.Exercise" (Bewegung), "ActivityCategory.Excursion" (Ausfläuge) oder "ActivityCategory.Creativity" (Kreativität).
Bitte antworte nur mit der List<Activity> und keinen weiteren Definitionen.

var activities = new List<Activity>()
{
    new()
    {
        CreatedById = max.Id,
        CreatedAt   = DateTimeOffset.UtcNow,
        Visibility  = ActivityVisibility.Public,
        Title       = "(Hier der Titel)",
        Category    = ActivityCategory.Excursion,
        StartTime   = new DateTimeOffset(2023, 12, 16, 9, 30),
        EndTime     = new DateTimeOffset(2023, 12, 16, 12, 0),
        Location    = "Darmstadt",
        Description = """
        (Hier die Beschreibung)
        """,
    },
    // ... Hier die restlichen Ideen...
}

*/
