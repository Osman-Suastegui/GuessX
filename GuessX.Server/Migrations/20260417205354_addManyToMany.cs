using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GuessX.Server.Migrations
{
    /// <inheritdoc />
    public partial class addManyToMany : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CharacterOfTheDays_characters_CharacterId",
                table: "CharacterOfTheDays");

            migrationBuilder.DropForeignKey(
                name: "FK_genres_Animes_AnimeId",
                table: "genres");

            migrationBuilder.DropIndex(
                name: "IX_genres_AnimeId",
                table: "genres");

            migrationBuilder.DropColumn(
                name: "AnimeId",
                table: "genres");

            migrationBuilder.AlterColumn<int>(
                name: "CharacterId",
                table: "CharacterOfTheDays",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateTable(
                name: "AnimeGenre",
                columns: table => new
                {
                    AnimesId = table.Column<int>(type: "int", nullable: false),
                    GenresId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnimeGenre", x => new { x.AnimesId, x.GenresId });
                    table.ForeignKey(
                        name: "FK_AnimeGenre_Animes_AnimesId",
                        column: x => x.AnimesId,
                        principalTable: "Animes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AnimeGenre_genres_GenresId",
                        column: x => x.GenresId,
                        principalTable: "genres",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AnimeGenre_GenresId",
                table: "AnimeGenre",
                column: "GenresId");

            migrationBuilder.AddForeignKey(
                name: "FK_CharacterOfTheDays_characters_CharacterId",
                table: "CharacterOfTheDays",
                column: "CharacterId",
                principalTable: "characters",
                principalColumn: "id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CharacterOfTheDays_characters_CharacterId",
                table: "CharacterOfTheDays");

            migrationBuilder.DropTable(
                name: "AnimeGenre");

            migrationBuilder.AddColumn<int>(
                name: "AnimeId",
                table: "genres",
                type: "int",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "CharacterId",
                table: "CharacterOfTheDays",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_genres_AnimeId",
                table: "genres",
                column: "AnimeId");

            migrationBuilder.AddForeignKey(
                name: "FK_CharacterOfTheDays_characters_CharacterId",
                table: "CharacterOfTheDays",
                column: "CharacterId",
                principalTable: "characters",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_genres_Animes_AnimeId",
                table: "genres",
                column: "AnimeId",
                principalTable: "Animes",
                principalColumn: "Id");
        }
    }
}
