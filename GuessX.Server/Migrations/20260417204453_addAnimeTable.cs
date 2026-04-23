using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GuessX.Server.Migrations
{
    /// <inheritdoc />
    public partial class addAnimeTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AnimeId",
                table: "genres",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MalId",
                table: "characters",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "AnimeId",
                table: "CharacterOfTheDays",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Animes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GameId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MalId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Animes", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_genres_AnimeId",
                table: "genres",
                column: "AnimeId");

            migrationBuilder.CreateIndex(
                name: "IX_CharacterOfTheDays_AnimeId",
                table: "CharacterOfTheDays",
                column: "AnimeId");

            migrationBuilder.AddForeignKey(
                name: "FK_CharacterOfTheDays_Animes_AnimeId",
                table: "CharacterOfTheDays",
                column: "AnimeId",
                principalTable: "Animes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_genres_Animes_AnimeId",
                table: "genres",
                column: "AnimeId",
                principalTable: "Animes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CharacterOfTheDays_Animes_AnimeId",
                table: "CharacterOfTheDays");

            migrationBuilder.DropForeignKey(
                name: "FK_genres_Animes_AnimeId",
                table: "genres");

            migrationBuilder.DropTable(
                name: "Animes");

            migrationBuilder.DropIndex(
                name: "IX_genres_AnimeId",
                table: "genres");

            migrationBuilder.DropIndex(
                name: "IX_CharacterOfTheDays_AnimeId",
                table: "CharacterOfTheDays");

            migrationBuilder.DropColumn(
                name: "AnimeId",
                table: "genres");

            migrationBuilder.DropColumn(
                name: "MalId",
                table: "characters");

            migrationBuilder.DropColumn(
                name: "AnimeId",
                table: "CharacterOfTheDays");
        }
    }
}
