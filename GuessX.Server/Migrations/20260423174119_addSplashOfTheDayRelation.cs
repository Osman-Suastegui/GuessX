using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GuessX.Server.Migrations
{
    /// <inheritdoc />
    public partial class addSplashOfTheDayRelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_SplashOfTheDays_AnimeId",
                table: "SplashOfTheDays",
                column: "AnimeId");

            migrationBuilder.AddForeignKey(
                name: "FK_SplashOfTheDays_Animes_AnimeId",
                table: "SplashOfTheDays",
                column: "AnimeId",
                principalTable: "Animes",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_SplashOfTheDays_Animes_AnimeId",
                table: "SplashOfTheDays");

            migrationBuilder.DropIndex(
                name: "IX_SplashOfTheDays_AnimeId",
                table: "SplashOfTheDays");
        }
    }
}
