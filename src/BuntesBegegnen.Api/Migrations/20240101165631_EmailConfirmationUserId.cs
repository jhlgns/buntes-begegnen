using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuntesBegegnen.Api.Migrations
{
    /// <inheritdoc />
    public partial class EmailConfirmationUserId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "EmailAddress",
                table: "EmailConfirmationCodes",
                newName: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_EmailConfirmationCodes_UserId",
                table: "EmailConfirmationCodes",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_EmailConfirmationCodes_AspNetUsers_UserId",
                table: "EmailConfirmationCodes",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_EmailConfirmationCodes_AspNetUsers_UserId",
                table: "EmailConfirmationCodes");

            migrationBuilder.DropIndex(
                name: "IX_EmailConfirmationCodes_UserId",
                table: "EmailConfirmationCodes");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "EmailConfirmationCodes",
                newName: "EmailAddress");
        }
    }
}
