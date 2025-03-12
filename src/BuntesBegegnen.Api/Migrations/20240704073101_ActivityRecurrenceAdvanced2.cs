using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuntesBegegnen.Api.Migrations
{
    /// <inheritdoc />
    public partial class ActivityRecurrenceAdvanced2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "RecurrenceType",
                table: "Activities",
                newName: "RecurrenceInterval");

            migrationBuilder.RenameColumn(
                name: "RecurrenceN",
                table: "Activities",
                newName: "RecurrenceFrequency");

            migrationBuilder.RenameColumn(
                name: "RecurrenceDayOfWeek",
                table: "Activities",
                newName: "RecurrenceByMonth");

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "StartTime",
                table: "Activities",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(DateTimeOffset),
                oldType: "TEXT");

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "EndTime",
                table: "Activities",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(DateTimeOffset),
                oldType: "TEXT");

            migrationBuilder.AddColumn<bool>(
                name: "IsAllDay",
                table: "Activities",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);

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

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "RepeatFrom",
                table: "Activities",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "RepeatUntil",
                table: "Activities",
                type: "TEXT",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ActivityRecurrenceByDay",
                columns: table => new
                {
                    ActivityId = table.Column<int>(type: "INTEGER", nullable: false),
                    Ordinal = table.Column<int>(type: "INTEGER", nullable: false),
                    DayOfWeek = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityRecurrenceByDay", x => new { x.ActivityId, x.Ordinal, x.DayOfWeek });
                    table.ForeignKey(
                        name: "FK_ActivityRecurrenceByDay_Activities_ActivityId",
                        column: x => x.ActivityId,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ActivityRecurrenceByMonthDay",
                columns: table => new
                {
                    ActivityId = table.Column<int>(type: "INTEGER", nullable: false),
                    MonthDay = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityRecurrenceByMonthDay", x => new { x.ActivityId, x.MonthDay });
                    table.ForeignKey(
                        name: "FK_ActivityRecurrenceByMonthDay_Activities_ActivityId",
                        column: x => x.ActivityId,
                        principalTable: "Activities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Activities_Activities_ParentActivityId",
                table: "Activities");

            migrationBuilder.DropTable(
                name: "ActivityRecurrenceByDay");

            migrationBuilder.DropTable(
                name: "ActivityRecurrenceByMonthDay");

            migrationBuilder.DropIndex(
                name: "IX_Activities_ParentActivityId",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "IsAllDay",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "IsExceptionalDelete",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "ParentActivityId",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "RepeatFrom",
                table: "Activities");

            migrationBuilder.DropColumn(
                name: "RepeatUntil",
                table: "Activities");

            migrationBuilder.RenameColumn(
                name: "RecurrenceInterval",
                table: "Activities",
                newName: "RecurrenceType");

            migrationBuilder.RenameColumn(
                name: "RecurrenceFrequency",
                table: "Activities",
                newName: "RecurrenceN");

            migrationBuilder.RenameColumn(
                name: "RecurrenceByMonth",
                table: "Activities",
                newName: "RecurrenceDayOfWeek");

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "StartTime",
                table: "Activities",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)),
                oldClrType: typeof(DateTimeOffset),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AlterColumn<DateTimeOffset>(
                name: "EndTime",
                table: "Activities",
                type: "TEXT",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)),
                oldClrType: typeof(DateTimeOffset),
                oldType: "TEXT",
                oldNullable: true);
        }
    }
}
