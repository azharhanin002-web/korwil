import { defineField, defineType } from 'sanity'
import { FileText } from 'lucide-react' // Ikon Dokumen

export default defineType({
  name: 'documents', // Nama tipe data (jangan 'document' karena itu keyword Sanity)
  title: 'Dokumen & Unduhan',
  type: 'document',
  icon: FileText as any,
  fields: [
    // 1. NAMA DOKUMEN
    defineField({
      name: 'title',
      title: 'Nama Dokumen',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // 2. KATEGORI (Agar bisa difilter di website)
    defineField({
      name: 'category',
      title: 'Kategori Dokumen',
      type: 'string',
      options: {
        list: [
          { title: 'Surat Keputusan (SK)', value: 'SK' },
          { title: 'Surat Edaran (SE)', value: 'SE' },
          { title: 'Peraturan / Juknis', value: 'Peraturan' },
          { title: 'Formulir', value: 'Formulir' },
          { title: 'Lainnya', value: 'Lainnya' },
        ],
      },
      initialValue: 'Lainnya',
    }),

    // 3. FILE UPLOAD
    defineField({
      name: 'fileSource',
      title: 'Upload File',
      description: 'Format yang didukung: PDF, Word, Excel, PowerPoint, ZIP',
      type: 'file',
      options: {
        accept: '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip,.rar'
      },
      validation: (Rule) => Rule.required().error('File wajib diupload!'),
    }),

    // 4. TANGGAL
    defineField({
      name: 'publishedAt',
      title: 'Tanggal Upload',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),

    // 5. KETERANGAN
    defineField({
      name: 'description',
      title: 'Keterangan / Deskripsi Singkat',
      type: 'text',
      rows: 3,
    }),
  ],

  // Tampilan Preview di Dashboard
  preview: {
    select: {
      title: 'title',
      category: 'category',
    },
    prepare(selection) {
      const { title, category } = selection
      return {
        title: title,
        subtitle: `📂 ${category || 'Umum'}`,
        media: FileText as any
      }
    },
  },
})