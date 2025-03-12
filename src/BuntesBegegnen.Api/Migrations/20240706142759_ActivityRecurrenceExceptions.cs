using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuntesBegegnen.Api.Migrations
{
    /// <inheritdoc />
    public partial class ActivityRecurrenceExceptions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_Activities_ParentActivityId",
                table: "Activities");

            migrationBuilder.DropIndex(
                name: "IX_Activities_ParentActivityId",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "IsExceptionalDelete",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "ParentActivityId",
                table: "Activities");

            migrationBuilder.CreateTable(
                name: "ActivityRecurrenceExceptions",
                columns: table => new
                {
                    ActivityId = table.Column<int>(type: "INTEGER", nullable: false),
                    StartTime = table.Column<DateTimeOffset>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityRecurrenceExceptions", x => new { x.ActivityId, x.StartTime });
                    table.ForeignKey(
                        name: "FK_ActivityRecurrenceExceptions_Activities_ActivityId",
                        column: x => x.ActivityId,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ActivityRecurrenceExceptions");

            migrationBuilder.AddColumn<bool>(
                name: "IsExceptionalDelete",
                table: "Activities",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ParentActivityId",
                table: "Activities",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Activities_ParentActivityId",
                table: "Activities",
                column: "ParentActivityId");

            migrationBuilder.AddForeignKey(
                name: "FK_Activities_Activities_ParentActivityId",
                table: "Activities",
                column: "ParentActivityId",
                principalTable: "Activities",
                principalColumn: "Id");
        }
    }
}
