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
        => optionsBuilder.UseSqlServer("Server=localhost;Database=picture_gallery;Trusted_Connection=True;Encrypt=False;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Genre>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__genres__3213E83F11B2ACCC");

            entity.ToTable("genres");

            entity.HasIndex(e => e.Name, "UQ__genres__72E12F1B0D002016").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("name");
        });

        modelBuilder.Entity<TitleAnswer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__title_an__3213E83FE3A79BA0");

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
                .HasConstraintName("FK__title_ans__title__5BE2A6F2");
        });

        modelBuilder.Entity<TitleImage>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__title_im__3213E83FA4623572");

            entity.ToTable("title_images");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
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
                .HasConstraintName("FK__title_ima__title__59063A47");
        });

        modelBuilder.Entity<TitlePictureGallery>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__title_pi__3213E83F40A514FF");

            entity.ToTable("title_picture_gallery");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
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
                        .HasConstraintName("FK__title_gen__genre__5629CD9C"),
                    l => l.HasOne<TitlePictureGallery>().WithMany()
                        .HasForeignKey("TitleId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__title_gen__title__5535A963"),
                    j =>
                    {
                        j.HasKey("TitleId", "GenreId").HasName("PK__title_ge__21E6F1A38476D57C");
                        j.ToTable("title_genres");
                        j.IndexerProperty<int>("TitleId").HasColumnName("title_id");
                        j.IndexerProperty<int>("GenreId").HasColumnName("genre_id");
                    });
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
