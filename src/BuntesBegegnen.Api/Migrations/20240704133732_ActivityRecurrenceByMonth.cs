using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuntesBegegnen.Api.Migrations
{
    /// <inheritdoc />
    public partial class ActivityRecurrenceByMonth : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RecurrenceByMonth",
                table: "Activities");

            migrationBuilder.AlterColumn<int>(
                name: "RecurrenceFrequency",
                table: "Activities",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "INTEGER",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "ActivityRecurrenceByMonth",
                columns: table => new
                {
                    ActivityId = table.Column<int>(type: "INTEGER", nullable: false),
                    Month = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ActivityRecurrenceByMonth", x => new { x.ActivityId, x.Month });
                    table.ForeignKey(
                        name: "FK_ActivityRecurrenceByMonth_Activities_ActivityId",
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
                name: "ActivityRecurrenceByMonth");

            migrationBuilder.AlterColumn<int>(
                name: "RecurrenceFrequency",
                table: "Activities",
                type: "INTEGER",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "INTEGER");

            migrationBuilder.AddColumn<int>(
                name: "RecurrenceByMonth",
                table: "Activities",
                type: "INTEGER",
                nullable: true);
        }
    }
}
