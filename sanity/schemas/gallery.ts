import { defineField, defineType } from 'sanity'
import { Images } from 'lucide-react' 

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

    // 3. KATEGORI (Penting untuk Fitur Filter di Website)
    defineField({
      name: 'category',
      title: 'Kategori Galeri',
      type: 'string',
      options: {
        list: [
          { title: 'Kegiatan Dinas', value: 'Dinas' },
          { title: 'Lomba Siswa', value: 'Lomba' },
          { title: 'PGRI', value: 'PGRI' },
          { title: 'Kepramukaan', value: 'Pramuka' },
          { title: 'Lainnya', value: 'Lainnya' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    // 4. TANGGAL KEGIATAN
    defineField({
      name: 'publishedAt',
      title: 'Tanggal Kegiatan',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),

    // 5. COVER ALBUM (Thumbnail Depan)
    defineField({
      name: 'mainImage',
      title: 'Cover Album (Thumbnail)',
      description: 'Gambar ini yang akan muncul di halaman utama galeri.',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    }),

    // 6. ISI FOTO (Multiple Upload)
    defineField({
      name: 'images',
      title: 'Daftar Foto Dokumentasi',
      type: 'array',
      options: {
        layout: 'grid', 
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
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text (SEO)',
              initialValue: 'Dokumentasi Kegiatan Korwilcam'
            }
          ]
        }
      ],
      validation: (Rule) => Rule.required().min(1).error('Minimal upload 1 foto dokumentasi!'),
    }),

    // 7. DESKRIPSI SINGKAT
    defineField({
      name: 'description',
      title: 'Deskripsi Singkat Kegiatan',
      type: 'text',
      rows: 3,
    }),
  ],

  // Tampilan Preview di Dashboard Sanity
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'mainImage',
    },
    prepare(selection) {
      const { title, category, media } = selection
      return {
        title: title,
        subtitle: `Kategori: ${category || 'Umum'}`,
        media: media
      }
    },
  },
})