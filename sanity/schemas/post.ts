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
        slugify: (input) =>
          input
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "")
            .slice(0, 96),
      },
      validation: (Rule) => Rule.required(),
    }),

    // 3. KATEGORI
    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: {
        list: [
          { title: "Berita Dinas", value: "Berita" },
          { title: "Berita Pendidikan", value: "Berita" },
          { title: "Pengumuman", value: "Pengumuman" },
          { title: "Artikel Guru", value: "Artikel" },
          { title: "PGRI", value: "PGRI" },
          { title: "Kepramukaan", value: "Pramuka" },
          { title: "Agenda / Kegiatan", value: "Agenda" },
        ],
        layout: "radio",
      },
      initialValue: "Berita",
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
          validation: (Rule) =>
            Rule.required().error("Alt text penting untuk SEO"),
        },
      ],
    }),

    // 5. HEADLINE SLIDER
    defineField({
      name: "isHeadline",
      title: "Jadikan Headline Slider?",
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
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Judul Besar (H2)", value: "h2" },
            { title: "Sub Judul (H3)", value: "h3" },
            { title: "Kutipan", value: "blockquote" },
          ],
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "caption",
              type: "string",
              title: "Caption Gambar",
              options: { isHighlighted: true },
            },
          ],
        },
      ],
      validation: (Rule) => Rule.required().error("Isi berita wajib diisi!"),
    }),

    // 8. VIEW COUNTER
    defineField({
      name: "views",
      title: "Jumlah Dilihat",
      type: "number",
      initialValue: 0,
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
      const dateFormatted = date
        ? new Date(date).toLocaleDateString("id-ID")
        : ""

      return {
        title,
        subtitle: `${headline ? "⭐ HEADLINE | " : ""}[${category}] - ${dateFormatted}`,
        media,
      }
    },
  },
})
