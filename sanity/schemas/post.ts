import { defineField, defineType } from "sanity"
import { NotebookPen } from "lucide-react"

export default defineType({
  name: "post",
  title: "Berita & Artikel",
  type: "document",
  icon: NotebookPen as any,

  fields: [
    // 1. JUDUL
    defineField({
      name: "title",
      title: "Judul Berita",
      type: "string",
      validation: (Rule) => Rule.required().error("Judul wajib diisi!"),
    }),

    // 2. SLUG
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    // 3. KATEGORI (DI SINI PERBAIKANNYA)
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: {
        list: [
          // Value harus UNIK (berbeda satu sama lain)
          { title: "Berita Dinas", value: "Berita Dinas" },
          { title: "Berita Pendidikan", value: "Berita Pendidikan" }, // Sekarang sudah beda
          { title: "Pengumuman", value: "Pengumuman" },
          { title: "Artikel Guru", value: "Artikel Guru" },
          { title: "PGRI", value: "PGRI" },
          { title: "Kepramukaan", value: "Kepramukaan" },
          { title: "Agenda / Kegiatan", value: "Agenda" },
        ],
        layout: "radio", // Tetap pakai radio agar mudah diklik
      },
      initialValue: "Berita Dinas",
      validation: (Rule) => Rule.required(),
    }),

    // 4. GAMBAR UTAMA
    defineField({
      name: "mainImage",
      title: "Gambar Utama",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required().error("Gambar utama wajib diisi!"),
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text (SEO)",
          initialValue: "Gambar Berita Korwil",
          validation: (Rule) => Rule.required(),
        },
      ],
    }),

    // 5. HEADLINE SLIDER
    defineField({
      name: "isHeadline",
      title: "Jadikan Headline Slider?",
      description: "Jika dicentang, berita akan muncul di slide gambar paling atas",
      type: "boolean",
      initialValue: false,
    }),

    // 6. TANGGAL PUBLISH
    defineField({
      name: "publishedAt",
      title: "Tanggal Tayang",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),

    // 7. ISI BERITA
    defineField({
      name: "body",
      title: "Isi Berita",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "caption",
              type: "string",
              title: "Keterangan Gambar",
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),

    // 8. VIEW COUNTER
    defineField({
      name: "views",
      title: "Jumlah Dilihat",
      type: "number",
      initialValue: 0,
      readOnly: true, // Sebaiknya admin tidak bisa edit manual
    }),
  ],

  preview: {
    select: {
      title: "title",
      category: "category",
      media: "mainImage",
      headline: "isHeadline",
      date: "publishedAt",
    },
    prepare({ title, category, media, headline, date }) {
      const dateFormatted = date ? new Date(date).toLocaleDateString("id-ID") : ""
      return {
        title,
        subtitle: `${headline ? "⭐ HEADLINE | " : ""}[${category}] - ${dateFormatted}`,
        media,
      }
    },
  },
})