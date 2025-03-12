using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuntesBegegnen.Api.Migrations
{
    /// <inheritdoc />
    public partial class PromoterStuff : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_Promoter_PromoterId",
                table: "Activities");

            migrationBuilder.DropForeignKey(
                name: "FK_Promoter_AspNetUsers_CreatedById",
                table: "Promoter");

            migrationBuilder.DropForeignKey(
                name: "FK_Promoter_AspNetUsers_OwnerId",
                table: "Promoter");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Promoter",
                table: "Promoter");

            migrationBuilder.DropIndex(
                name: "IX_Promoter_CreatedById",
                table: "Promoter");

            migrationBuilder.DropIndex(
                name: "IX_Promoter_OwnerId",
                table: "Promoter");

            migrationBuilder.DropColumn(
                name: "OwnerId",
                table: "Promoter");

            migrationBuilder.RenameTable(
                name: "Promoter",
                newName: "Promoters");

            migrationBuilder.AddColumn<int>(
                name: "PromoterId",
                table: "AspNetUsers",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedById1",
                table: "Promoters",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Promoters",
                table: "Promoters",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_PromoterId",
                table: "AspNetUsers",
                column: "PromoterId");

            migrationBuilder.CreateIndex(
                name: "IX_Promoters_CreatedById1",
                table: "Promoters",
                column: "CreatedById1");

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_Promoters_PromoterId",
                table: "Activities",
                column: "PromoterId",
                principalTable: "Promoters",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Promoters_PromoterId",
                table: "AspNetUsers",
                column: "PromoterId",
                principalTable: "Promoters",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Promoters_AspNetUsers_CreatedById1",
                table: "Promoters",
                column: "CreatedById1",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_Promoters_PromoterId",
                table: "Activities");

            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Promoters_PromoterId",
                table: "AspNetUsers");

            migrationBuilder.DropForeignKey(
                name: "FK_Promoters_AspNetUsers_CreatedById1",
                table: "Promoters");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_PromoterId",
                table: "AspNetUsers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Promoters",
                table: "Promoters");

            migrationBuilder.DropIndex(
                name: "IX_Promoters_CreatedById1",
                table: "Promoters");

            migrationBuilder.DropColumn(
                name: "PromoterId",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "CreatedById1",
                table: "Promoters");

            migrationBuilder.RenameTable(
                name: "Promoters",
                newName: "Promoter");

            migrationBuilder.AddColumn<string>(
                name: "OwnerId",
                table: "Promoter",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Promoter",
                table: "Promoter",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Promoter_CreatedById",
                table: "Promoter",
                column: "CreatedById");

            migrationBuilder.CreateIndex(
                name: "IX_Promoter_OwnerId",
                table: "Promoter",
                column: "OwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_Promoter_PromoterId",
                table: "Activities",
                column: "PromoterId",
                principalTable: "Promoter",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Promoter_AspNetUsers_CreatedById",
                table: "Promoter",
                column: "CreatedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Promoter_AspNetUsers_OwnerId",
                table: "Promoter",
                column: "OwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
