using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuntesBegegnen.Api.Migrations
{
    /// <inheritdoc />
    public partial class PromoterWebsite : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Promoters_AspNetUsers_CreatedById1",
                table: "Promoters");

            migrationBuilder.DropIndex(
                name: "IX_Promoters_CreatedById1",
                table: "Promoters");

            migrationBuilder.RenameColumn(
                name: "CreatedById1",
                table: "Promoters",
                newName: "Website");

            migrationBuilder.CreateIndex(
                name: "IX_Promoters_CreatedById",
                table: "Promoters",
                column: "CreatedById");

            migrationBuilder.AddForeignKey(
                name: "FK_Promoters_AspNetUsers_CreatedById",
                table: "Promoters",
                column: "CreatedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Promoters_AspNetUsers_CreatedById",
                table: "Promoters");

            migrationBuilder.DropIndex(
                name: "IX_Promoters_CreatedById",
                table: "Promoters");

            migrationBuilder.RenameColumn(
                name: "Website",
                table: "Promoters",
                newName: "CreatedById1");

            migrationBuilder.CreateIndex(
                name: "IX_Promoters_CreatedById1",
                table: "Promoters",
                column: "CreatedById1");

            migrationBuilder.AddForeignKey(
                name: "FK_Promoters_AspNetUsers_CreatedById1",
                table: "Promoters",
                column: "CreatedById1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
