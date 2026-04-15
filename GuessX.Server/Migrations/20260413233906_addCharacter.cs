using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GuessX.Server.Migrations
{
    /// <inheritdoc />
    public partial class addCharacter : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CharacterId",
                table: "SplashOfTheDays",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_SplashOfTheDays_CharacterId",
                table: "SplashOfTheDays",
                column: "CharacterId");

            migrationBuilder.AddForeignKey(
                name: "FK_SplashOfTheDays_characters_CharacterId",
                table: "SplashOfTheDays",
                column: "CharacterId",
                principalTable: "characters",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SplashOfTheDays_characters_CharacterId",
                table: "SplashOfTheDays");

            migrationBuilder.DropIndex(
                name: "IX_SplashOfTheDays_CharacterId",
                table: "SplashOfTheDays");

            migrationBuilder.DropColumn(
                name: "CharacterId",
                table: "SplashOfTheDays");
        }
    }
}
