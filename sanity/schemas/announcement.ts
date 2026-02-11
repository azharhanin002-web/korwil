import { defineField, defineType } from "sanity"
import { Megaphone } from "lucide-react"

export default defineType({
  name: "announcement",
  title: "Pengumuman",
  type: "document",
  icon: Megaphone,

  fields: [
    // ==================================
    // 1. JUDUL
    // ==================================
    defineField({
      name: "title",
      title: "Judul Pengumuman",
      type: "string",
      validation: (Rule) =>
        Rule.required().min(10).error("Judul minimal 10 karakter."),
    }),

    // ==================================
    // 2. SLUG (URL)
    // ==================================
    defineField({
      name: "slug",
      title: "Slug (URL)",
      description: 'Klik "Generate" untuk membuat URL otomatis',
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    // ==================================
    // 3. STATUS PENTING
    // ==================================
    defineField({
      name: "isImportant",
      title: "Tandai Sebagai Pengumuman Penting?",
      type: "boolean",
      initialValue: false,
    }),

    // ==================================
    // 4. TANGGAL TERBIT
    // ==================================
    defineField({
      name: "publishedAt",
      title: "Tanggal Terbit",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),

    // ==================================
    // 5. TANGGAL KADALUARSA (Opsional)
    // ==================================
    defineField({
      name: "expiresAt",
      title: "Tanggal Berakhir (Opsional)",
      type: "datetime",
      description: "Isi jika pengumuman memiliki batas waktu.",
    }),

    // ==================================
    // 6. LAMPIRAN FILE
    // ==================================
    defineField({
      name: "attachment",
      title: "File Lampiran",
      description: "Format: PDF, Word, Excel",
      type: "file",
      options: {
        accept: ".pdf,.doc,.docx,.xls,.xlsx",
      },
    }),

    // ==================================
    // 7. RINGKASAN
    // ==================================
    defineField({
      name: "summary",
      title: "Ringkasan Singkat",
      description: "Akan tampil di halaman listing.",
      type: "text",
      rows: 3,
      validation: (Rule) =>
        Rule.max(200).warning("Sebaiknya tidak lebih dari 200 karakter."),
    }),

    // ==================================
    // 8. ISI LENGKAP
    // ==================================
    defineField({
      name: "body",
      title: "Isi Lengkap Pengumuman",
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
        },
      ],
    }),

    // ==================================
    // 9. VIEW COUNTER (Optional)
    // ==================================
    defineField({
      name: "views",
      title: "Jumlah Dilihat (Manual)",
      type: "number",
      initialValue: 0,
    }),
  ],

  // ==================================
  // Preview Dashboard
  // ==================================
  preview: {
    select: {
      title: "title",
      date: "publishedAt",
      important: "isImportant",
    },
    prepare({ title, date, important }) {
      const formattedDate = date
        ? new Date(date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "Draft"

      return {
        title,
        subtitle: `${important ? "⭐ PENTING | " : ""}${formattedDate}`,
        media: Megaphone,
      }
    },
  },
})
