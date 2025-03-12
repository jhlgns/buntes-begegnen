using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuntesBegegnen.Api.Migrations
{
    /// <inheritdoc />
    public partial class EntityRefactoring : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppUserActivityRegistrations");

            migrationBuilder.DropTable(
                name: "AppUserActivityVotes");

            migrationBuilder.DropTable(
                name: "AppUserFavoriteCategories");

            migrationBuilder.AddColumn<int>(
                name: "PromoterId",
                table: "Activities",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Promoter",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    OwnerId = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    StreetAddress = table.Column<string>(type: "TEXT", nullable: true),
                    ZipCode = table.Column<string>(type: "TEXT", nullable: true),
                    City = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "TEXT", nullable: false),
                    CreatedById = table.Column<string>(type: "TEXT", nullable: true),
                    IsDeleted = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Promoter", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Promoter_AspNetUsers_CreatedById",
                        column: x => x.CreatedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Promoter_AspNetUsers_OwnerId",
                        column: x => x.OwnerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserActivityRegistrations",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    ActivityId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserActivityRegistrations", x => new { x.UserId, x.ActivityId });
                    table.ForeignKey(
                        name: "FK_UserActivityRegistrations_Activities_ActivityId",
                        column: x => x.ActivityId,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserActivityRegistrations_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserActivityVotes",
                columns: table => new
                {
                    ActivityId = table.Column<int>(type: "INTEGER", nullable: false),
                    UserId = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserActivityVotes", x => new { x.UserId, x.ActivityId });
                    table.ForeignKey(
                        name: "FK_UserActivityVotes_Activities_ActivityId",
                        column: x => x.ActivityId,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserActivityVotes_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserFavoriteCategories",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    Category = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserFavoriteCategories", x => new { x.UserId, x.Category });
                    table.ForeignKey(
                        name: "FK_UserFavoriteCategories_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Activities_PromoterId",
                table: "Activities",
                column: "PromoterId");

            migrationBuilder.CreateIndex(
                name: "IX_Promoter_CreatedById",
                table: "Promoter",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Promoter_OwnerId",
                table: "Promoter",
                column: "OwnerId");

            migrationBuilder.CreateIndex(
                name: "IX_UserActivityRegistrations_ActivityId",
                table: "UserActivityRegistrations",
                column: "ActivityId");

            migrationBuilder.CreateIndex(
                name: "IX_UserActivityVotes_ActivityId",
                table: "UserActivityVotes",
                column: "ActivityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_Promoter_PromoterId",
                table: "Activities",
                column: "PromoterId",
                principalTable: "Promoter",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_Promoter_PromoterId",
                table: "Activities");

            migrationBuilder.DropTable(
                name: "Promoter");

            migrationBuilder.DropTable(
                name: "UserActivityRegistrations");

            migrationBuilder.DropTable(
                name: "UserActivityVotes");

            migrationBuilder.DropTable(
                name: "UserFavoriteCategories");

            migrationBuilder.DropIndex(
                name: "IX_Activities_PromoterId",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "PromoterId",
                table: "Activities");

            migrationBuilder.CreateTable(
                name: "AppUserActivityRegistrations",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    ActivityId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUserActivityRegistrations", x => new { x.UserId, x.ActivityId });
                    table.ForeignKey(
                        name: "FK_AppUserActivityRegistrations_Activities_ActivityId",
                        column: x => x.ActivityId,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppUserActivityRegistrations_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppUserActivityVotes",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    ActivityId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUserActivityVotes", x => new { x.UserId, x.ActivityId });
                    table.ForeignKey(
                        name: "FK_AppUserActivityVotes_Activities_ActivityId",
                        column: x => x.ActivityId,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppUserActivityVotes_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AppUserFavoriteCategories",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    Category = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUserFavoriteCategories", x => new { x.UserId, x.Category });
                    table.ForeignKey(
                        name: "FK_AppUserFavoriteCategories_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppUserActivityRegistrations_ActivityId",
                table: "AppUserActivityRegistrations",
                column: "ActivityId");

            migrationBuilder.CreateIndex(
                name: "IX_AppUserActivityVotes_ActivityId",
                table: "AppUserActivityVotes",
                column: "ActivityId");
        }
    }
}
