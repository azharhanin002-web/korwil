import { defineField, defineType } from 'sanity'
import { Images } from 'lucide-react' // Ikon Galeri

export default defineType({
  name: 'gallery',
  title: 'Galeri Foto',
  type: 'document',
  icon: Images as any,
  fields: [
    // 1. JUDUL ALBUM
    defineField({
      name: 'title',
      title: 'Judul Album / Kegiatan',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // 2. SLUG
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

    // 3. TANGGAL KEGIATAN
    defineField({
      name: 'publishedAt',
      title: 'Tanggal Kegiatan',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),

    // 4. COVER ALBUM (Thumbnail Depan)
    defineField({
      name: 'mainImage',
      title: 'Cover Album',
      description: 'Gambar ini yang akan muncul paling depan di halaman daftar galeri.',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),

    // 5. ISI FOTO (Multiple Upload)
    defineField({
      name: 'images',
      title: 'Daftar Foto Dokumentasi',
      type: 'array',
      options: {
        layout: 'grid', // Tampilan Grid agar rapi saat upload banyak foto
      },
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption Foto (Opsional)',
              description: 'Keterangan singkat untuk foto ini.'
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text (SEO)',
              initialValue: 'Dokumentasi Kegiatan'
            }
          ]
        }
      ],
      validation: (Rule) => Rule.required().min(1).error('Minimal upload 1 foto dokumentasi!'),
    }),

    // 6. DESKRIPSI SINGKAT
    defineField({
      name: 'description',
      title: 'Deskripsi Singkat Kegiatan',
      type: 'text',
      rows: 3,
    }),
  ],

  // Tampilan Preview di Dashboard
  preview: {
    select: {
      title: 'title',
      date: 'publishedAt',
      media: 'mainImage',
    },
    prepare(selection) {
      const { title, date, media } = selection
      return {
        title: title,
        subtitle: date ? new Date(date).toLocaleDateString('id-ID', {
            day: 'numeric', month: 'long', year: 'numeric'
        }) : 'Belum ada tanggal',
        media: media
      }
    },
  },
})