using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuntesBegegnen.Api.Migrations
{
    /// <inheritdoc />
    public partial class AppUserImpairments : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Handicap",
                table: "AspNetUsers",
                newName: "ImpairedSpeech");

            migrationBuilder.AddColumn<bool>(
                name: "ImpairedHearing",
                table: "AspNetUsers",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ImpairedMobility",
                table: "AspNetUsers",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "ImpairedSight",
                table: "AspNetUsers",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "AppUserActivityRegistration",
                columns: table => new
                {
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    ActivityId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppUserActivityRegistration", x => new { x.UserId, x.ActivityId });
                    table.ForeignKey(
                        name: "FK_AppUserActivityRegistration_Activities_ActivityId",
                        column: x => x.ActivityId,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppUserActivityRegistration_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppUserActivityRegistration_ActivityId",
                table: "AppUserActivityRegistration",
                column: "ActivityId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppUserActivityRegistration");

            migrationBuilder.DropColumn(
                name: "ImpairedHearing",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ImpairedMobility",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "ImpairedSight",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "ImpairedSpeech",
                table: "AspNetUsers",
                newName: "Handicap");
        }
    }
}
