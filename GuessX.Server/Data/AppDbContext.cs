using System;
using System.Collections.Generic;
using GuessX.Server.Entities;
using Microsoft.EntityFrameworkCore;

namespace GuessX.Server.Data;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Genre> Genres { get; set; }

    public virtual DbSet<TitleAnswer> TitleAnswers { get; set; }

    public virtual DbSet<TitleImage> TitleImages { get; set; }

    public virtual DbSet<TitlePictureGallery> TitlePictureGalleries { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer(
        "Server=localhost,1433;" +
        "Database=picture_gallery;" +
        "User Id=sa;" +
        "Password=Warmog79.;" +
        "TrustServerCertificate=True;"
    );


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Genre>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__genres__3213E83F11A1BFCE");

            entity.ToTable("genres");

            entity.HasIndex(e => e.Name, "UQ__genres__72E12F1BA4FD6A64").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("name");
        });

        modelBuilder.Entity<TitleAnswer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__title_an__3213E83F43C4A7EC");

            entity.ToTable("title_answers");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Answer)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("answer");
            entity.Property(e => e.TitleId).HasColumnName("title_id");

            entity.HasOne(d => d.Title).WithMany(p => p.TitleAnswers)
                .HasForeignKey(d => d.TitleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__title_ans__title__7B5B524B");
        });

        modelBuilder.Entity<TitleImage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__title_im__3213E83F2615F9A0");

            entity.ToTable("title_images");

            entity.HasIndex(e => e.ImageUrl, "idx_image_url");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ImageType)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("image_type");
            entity.Property(e => e.ImageUrl)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("image_url");
            entity.Property(e => e.TitleId).HasColumnName("title_id");

            entity.HasOne(d => d.Title).WithMany(p => p.TitleImages)
                .HasForeignKey(d => d.TitleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__title_ima__title__787EE5A0");
        });

        modelBuilder.Entity<TitlePictureGallery>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__title_pi__3213E83F65F656E0");

            entity.ToTable("title_picture_gallery");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Category)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("category");
            entity.Property(e => e.TitleName)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("title_name");

            entity.HasMany(d => d.Genres).WithMany(p => p.Titles)
                .UsingEntity<Dictionary<string, object>>(
                    "TitleGenre",
                    r => r.HasOne<Genre>().WithMany()
                        .HasForeignKey("GenreId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__title_gen__genre__75A278F5"),
                    l => l.HasOne<TitlePictureGallery>().WithMany()
                        .HasForeignKey("TitleId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__title_gen__title__74AE54BC"),
                    j =>
                    {
                        j.HasKey("TitleId", "GenreId").HasName("PK__title_ge__21E6F1A3D62E87BC");
                        j.ToTable("title_genres");
                        j.IndexerProperty<int>("TitleId").HasColumnName("title_id");
                        j.IndexerProperty<int>("GenreId").HasColumnName("genre_id");
                    });
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
