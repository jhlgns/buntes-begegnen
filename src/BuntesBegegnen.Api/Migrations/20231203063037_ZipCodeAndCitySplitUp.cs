using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuntesBegegnen.Api.Migrations
{
    /// <inheritdoc />
    public partial class ZipCodeAndCitySplitUp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_AspNetUsers_CreatedById",
                table: "Activities");

            migrationBuilder.DropForeignKey(
                name: "FK_AppUserActivityRegistration_Activities_ActivityId",
                table: "AppUserActivityRegistration");

            migrationBuilder.DropForeignKey(
                name: "FK_AppUserActivityRegistration_AspNetUsers_UserId",
                table: "AppUserActivityRegistration");

            migrationBuilder.DropForeignKey(
                name: "FK_Inquiries_AspNetUsers_SenderId",
                table: "Inquiries");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AppUserActivityRegistration",
                table: "AppUserActivityRegistration");

            migrationBuilder.RenameTable(
                name: "AppUserActivityRegistration",
                newName: "AppUserActivityRegistrations");

            migrationBuilder.RenameColumn(
                name: "SenderId",
                table: "Inquiries",
                newName: "CreatedById");

            migrationBuilder.RenameColumn(
                name: "ReceivedAt",
                table: "Inquiries",
                newName: "CreatedAt");

            migrationBuilder.RenameIndex(
                name: "IX_Inquiries_SenderId",
                table: "Inquiries",
                newName: "IX_Inquiries_CreatedById");

            migrationBuilder.RenameColumn(
                name: "ZipCodeAndCity",
                table: "AspNetUsers",
                newName: "ZipCode");

            migrationBuilder.RenameIndex(
                name: "IX_AppUserActivityRegistration_ActivityId",
                table: "AppUserActivityRegistrations",
                newName: "IX_AppUserActivityRegistrations_ActivityId");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Inquiries",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "AspNetUsers",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "CreatedById",
                table: "Activities",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Activities",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppUserActivityRegistrations",
                table: "AppUserActivityRegistrations",
                columns: new[] { "UserId", "ActivityId" });

            migrationBuilder.CreateTable(
                name: "AppUserActivityVotes",
                columns: table => new
                {
                    ActivityId = table.Column<int>(type: "INTEGER", nullable: false),
                    UserId = table.Column<string>(type: "TEXT", nullable: false)
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

            migrationBuilder.CreateIndex(
                name: "IX_AppUserActivityVotes_ActivityId",
                table: "AppUserActivityVotes",
                column: "ActivityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_AspNetUsers_CreatedById",
                table: "Activities",
                column: "CreatedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserActivityRegistrations_Activities_ActivityId",
                table: "AppUserActivityRegistrations",
                column: "ActivityId",
                principalTable: "Activities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserActivityRegistrations_AspNetUsers_UserId",
                table: "AppUserActivityRegistrations",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Inquiries_AspNetUsers_CreatedById",
                table: "Inquiries",
                column: "CreatedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_AspNetUsers_CreatedById",
                table: "Activities");

            migrationBuilder.DropForeignKey(
                name: "FK_AppUserActivityRegistrations_Activities_ActivityId",
                table: "AppUserActivityRegistrations");

            migrationBuilder.DropForeignKey(
                name: "FK_AppUserActivityRegistrations_AspNetUsers_UserId",
                table: "AppUserActivityRegistrations");

            migrationBuilder.DropForeignKey(
                name: "FK_Inquiries_AspNetUsers_CreatedById",
                table: "Inquiries");

            migrationBuilder.DropTable(
                name: "AppUserActivityVotes");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AppUserActivityRegistrations",
                table: "AppUserActivityRegistrations");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Inquiries");

            migrationBuilder.DropColumn(
                name: "City",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Activities");

            migrationBuilder.RenameTable(
                name: "AppUserActivityRegistrations",
                newName: "AppUserActivityRegistration");

            migrationBuilder.RenameColumn(
                name: "CreatedById",
                table: "Inquiries",
                newName: "SenderId");

            migrationBuilder.RenameColumn(
                name: "CreatedAt",
                table: "Inquiries",
                newName: "ReceivedAt");

            migrationBuilder.RenameIndex(
                name: "IX_Inquiries_CreatedById",
                table: "Inquiries",
                newName: "IX_Inquiries_SenderId");

            migrationBuilder.RenameColumn(
                name: "ZipCode",
                table: "AspNetUsers",
                newName: "ZipCodeAndCity");

            migrationBuilder.RenameIndex(
                name: "IX_AppUserActivityRegistrations_ActivityId",
                table: "AppUserActivityRegistration",
                newName: "IX_AppUserActivityRegistration_ActivityId");

            migrationBuilder.AlterColumn<string>(
                name: "CreatedById",
                table: "Activities",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppUserActivityRegistration",
                table: "AppUserActivityRegistration",
                columns: new[] { "UserId", "ActivityId" });

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_AspNetUsers_CreatedById",
                table: "Activities",
                column: "CreatedById",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserActivityRegistration_Activities_ActivityId",
                table: "AppUserActivityRegistration",
                column: "ActivityId",
                principalTable: "Activities",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_AppUserActivityRegistration_AspNetUsers_UserId",
                table: "AppUserActivityRegistration",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Inquiries_AspNetUsers_SenderId",
                table: "Inquiries",
                column: "SenderId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");
        }
    }
}
