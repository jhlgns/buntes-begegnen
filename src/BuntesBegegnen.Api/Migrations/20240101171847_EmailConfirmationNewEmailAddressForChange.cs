using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuntesBegegnen.Api.Migrations
{
    /// <inheritdoc />
    public partial class EmailConfirmationNewEmailAddressForChange : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmailAddress",
                table: "EmailConfirmationCodes");

            migrationBuilder.AddColumn<string>(
                name: "NewEmailAddress",
                table: "EmailConfirmationCodes",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "NewEmailAddress",
                table: "EmailConfirmationCodes");

            migrationBuilder.AddColumn<string>(
                name: "EmailAddress",
                table: "EmailConfirmationCodes",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }
    }
}
