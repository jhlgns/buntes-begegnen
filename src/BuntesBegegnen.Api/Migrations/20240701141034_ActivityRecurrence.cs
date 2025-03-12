using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuntesBegegnen.Api.Migrations
{
    /// <inheritdoc />
    public partial class ActivityRecurrence : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "RecurrenceDayOfWeek",
                table: "Activities",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RecurrenceN",
                table: "Activities",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RecurrenceType",
                table: "Activities",
                type: "INTEGER",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RecurrenceDayOfWeek",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "RecurrenceN",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "RecurrenceType",
                table: "Activities");
        }
    }
}
