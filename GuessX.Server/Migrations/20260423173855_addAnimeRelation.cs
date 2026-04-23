using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GuessX.Server.Migrations
{
    /// <inheritdoc />
    public partial class addAnimeRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SplashOfTheDays_characters_CharacterId",
                table: "SplashOfTheDays");

            migrationBuilder.AlterColumn<int>(
                name: "CharacterId",
                table: "SplashOfTheDays",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "AnimeId",
                table: "SplashOfTheDays",
                type: "int",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SplashOfTheDays_characters_CharacterId",
                table: "SplashOfTheDays",
                column: "CharacterId",
                principalTable: "characters",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SplashOfTheDays_characters_CharacterId",
                table: "SplashOfTheDays");

            migrationBuilder.DropColumn(
                name: "AnimeId",
                table: "SplashOfTheDays");

            migrationBuilder.AlterColumn<int>(
                name: "CharacterId",
                table: "SplashOfTheDays",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_SplashOfTheDays_characters_CharacterId",
                table: "SplashOfTheDays",
                column: "CharacterId",
                principalTable: "characters",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
