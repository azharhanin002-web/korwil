import { defineField, defineType } from 'sanity'
import { Megaphone } from 'lucide-react' // Ikon Pengumuman

export default defineType({
  name: 'announcement',
  title: 'Pengumuman',
  type: 'document',
  icon: Megaphone as any,
  fields: [
    // 1. JUDUL PENGUMUMAN
    defineField({
      name: 'title',
      title: 'Judul Pengumuman',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // 2. SLUG (URL)
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    // 3. TANGGAL
    defineField({
      name: 'publishedAt',
      title: 'Tanggal Terbit',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),

    // 4. LAMPIRAN DOKUMEN (Fitur Khusus Pengumuman)
    defineField({
      name: 'documentFile',
      title: 'File Lampiran (PDF / Word / Excel)',
      description: 'Upload surat keputusan, edaran, atau jadwal di sini (Opsional).',
      type: 'file',
      options: {
        accept: '.pdf,.doc,.docx,.xls,.xlsx'
      },
    }),

    // 5. ISI RINGKAS
    defineField({
      name: 'summary',
      title: 'Ringkasan Singkat',
      description: 'Akan muncul di halaman depan sebelum diklik.',
      type: 'text',
      rows: 3,
    }),

    // 6. ISI LENGKAP
    defineField({
      name: 'body',
      title: 'Isi Lengkap Pengumuman',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'Quote', value: 'blockquote'},
          ],
        }
      ],
    }),
  ],

  // Tampilan di Dashboard Sanity
  preview: {
    select: {
      title: 'title',
      date: 'publishedAt',
    },
    prepare(selection) {
      const { title, date } = selection
      return {
        title: title,
        subtitle: date ? new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        }) : 'Draft',
        media: Megaphone as any
      }
    },
  },
})