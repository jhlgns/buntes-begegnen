using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuntesBegegnen.Api.Migrations
{
    /// <inheritdoc />
    public partial class SplitPromoterStreetAddressIntoStreetNameAndHouseNumber : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StreetAddress",
                table: "Promoters",
                newName: "StreetName");

            migrationBuilder.AddColumn<string>(
                name: "HouseNumber",
                table: "Promoters",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HouseNumber",
                table: "Promoters");

            migrationBuilder.RenameColumn(
                name: "StreetName",
                table: "Promoters",
                newName: "StreetAddress");
        }
    }
}
