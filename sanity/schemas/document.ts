import { defineField, defineType } from "sanity"
import { FileText } from "lucide-react"

export default defineType({
  name: "documentFile", // lebih aman & jelas
  title: "Dokumen & Unduhan",
  type: "document",
  icon: FileText,

  fields: [
    // ===============================
    // 1. JUDUL DOKUMEN
    // ===============================
    defineField({
      name: "title",
      title: "Nama Dokumen",
      type: "string",
      validation: (Rule) =>
        Rule.required().min(5).error("Nama dokumen wajib diisi minimal 5 karakter."),
    }),

    // ===============================
    // 2. SLUG (Opsional tapi bagus untuk URL download)
    // ===============================
    defineField({
      name: "slug",
      title: "Slug URL",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),

    // ===============================
    // 3. KATEGORI
    // ===============================
    defineField({
      name: "category",
      title: "Kategori Dokumen",
      type: "string",
      options: {
        list: [
          { title: "Surat Keputusan (SK)", value: "SK" },
          { title: "Surat Edaran (SE)", value: "SE" },
          { title: "Peraturan / Juknis", value: "Peraturan" },
          { title: "Formulir", value: "Formulir" },
          { title: "Lainnya", value: "Lainnya" },
        ],
        layout: "radio",
      },
      initialValue: "Lainnya",
      validation: (Rule) => Rule.required(),
    }),

    // ===============================
    // 4. FILE UPLOAD
    // ===============================
    defineField({
      name: "fileSource",
      title: "Upload File",
      description: "Format: PDF, Word, Excel, PowerPoint, ZIP, RAR",
      type: "file",
      options: {
        accept: ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar",
      },
      validation: (Rule) =>
        Rule.required().error("File wajib diupload!"),
    }),

    // ===============================
    // 5. TANGGAL UPLOAD
    // ===============================
    defineField({
      name: "publishedAt",
      title: "Tanggal Upload",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),

    // ===============================
    // 6. DESKRIPSI
    // ===============================
    defineField({
      name: "description",
      title: "Keterangan / Deskripsi Singkat",
      type: "text",
      rows: 3,
    }),

    // ===============================
    // 7. JUMLAH DOWNLOAD (Optional)
    // ===============================
    defineField({
      name: "downloads",
      title: "Jumlah Download (Manual)",
      type: "number",
      initialValue: 0,
    }),
  ],

  // =====================================
  // Preview di Dashboard
  // =====================================
  preview: {
    select: {
      title: "title",
      category: "category",
      date: "publishedAt",
    },
    prepare({ title, category, date }) {
      const formattedDate = date
        ? new Date(date).toLocaleDateString("id-ID")
        : ""

      return {
        title,
        subtitle: `📂 ${category || "Umum"} • ${formattedDate}`,
        media: FileText,
      }
    },
  },
})
