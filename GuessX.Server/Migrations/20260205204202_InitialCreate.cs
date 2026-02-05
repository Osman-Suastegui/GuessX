using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GuessX.Server.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "genres",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    name = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__genres__3213E83F11A1BFCE", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "title_picture_gallery",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    title_name = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false),
                    category = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__title_pi__3213E83F65F656E0", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "title_answers",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    title_id = table.Column<int>(type: "int", nullable: false),
                    answer = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__title_an__3213E83F43C4A7EC", x => x.id);
                    table.ForeignKey(
                        name: "FK__title_ans__title__7B5B524B",
                        column: x => x.title_id,
                        principalTable: "title_picture_gallery",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "title_genres",
                columns: table => new
                {
                    title_id = table.Column<int>(type: "int", nullable: false),
                    genre_id = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__title_ge__21E6F1A3D62E87BC", x => new { x.title_id, x.genre_id });
                    table.ForeignKey(
                        name: "FK__title_gen__genre__75A278F5",
                        column: x => x.genre_id,
                        principalTable: "genres",
                        principalColumn: "id");
                    table.ForeignKey(
                        name: "FK__title_gen__title__74AE54BC",
                        column: x => x.title_id,
                        principalTable: "title_picture_gallery",
                        principalColumn: "id");
                });

            migrationBuilder.CreateTable(
                name: "title_images",
                columns: table => new
                {
                    id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    title_id = table.Column<int>(type: "int", nullable: false),
                    image_url = table.Column<string>(type: "varchar(500)", unicode: false, maxLength: 500, nullable: false),
                    image_type = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__title_im__3213E83F2615F9A0", x => x.id);
                    table.ForeignKey(
                        name: "FK__title_ima__title__787EE5A0",
                        column: x => x.title_id,
                        principalTable: "title_picture_gallery",
                        principalColumn: "id");
                });

            migrationBuilder.CreateIndex(
                name: "UQ__genres__72E12F1BA4FD6A64",
                table: "genres",
                column: "name",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_title_answers_title_id",
                table: "title_answers",
                column: "title_id");

            migrationBuilder.CreateIndex(
                name: "IX_title_genres_genre_id",
                table: "title_genres",
                column: "genre_id");

            migrationBuilder.CreateIndex(
                name: "idx_image_url",
                table: "title_images",
                column: "image_url");

            migrationBuilder.CreateIndex(
                name: "IX_title_images_title_id",
                table: "title_images",
                column: "title_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "title_answers");

            migrationBuilder.DropTable(
                name: "title_genres");

            migrationBuilder.DropTable(
                name: "title_images");

            migrationBuilder.DropTable(
                name: "genres");

            migrationBuilder.DropTable(
                name: "title_picture_gallery");
        }
    }
}
