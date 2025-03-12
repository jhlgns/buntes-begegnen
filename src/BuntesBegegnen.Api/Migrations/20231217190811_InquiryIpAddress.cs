using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BuntesBegegnen.Api.Migrations
{
    /// <inheritdoc />
    public partial class InquiryIpAddress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "IpAddress",
                table: "Inquiries",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsAnonymous",
                table: "Inquiries",
                type: "INTEGER",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IpAddress",
                table: "Inquiries");

            migrationBuilder.DropColumn(
                name: "IsAnonymous",
                table: "Inquiries");
        }
    }
}
