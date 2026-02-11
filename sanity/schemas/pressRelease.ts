import { defineField, defineType } from 'sanity'
import { Mic2 } from 'lucide-react' // Ikon Microphone untuk Siaran Pers

export default defineType({
  name: 'pressRelease',
  title: 'Siaran Pers',
  type: 'document',
  icon: Mic2 as any,
  fields: [
    // 1. JUDUL
    defineField({
      name: 'title',
      title: 'Judul Siaran Pers',
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

    // 3. TANGGAL RILIS
    defineField({
      name: 'publishedAt',
      title: 'Tanggal Rilis',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),

    // 4. LOKASI (Opsional)
    defineField({
      name: 'location',
      title: 'Lokasi',
      description: 'Contoh: Jakarta, Bandung, atau Aceh Utara (Opsional)',
      type: 'string',
    }),

    // 5. GAMBAR UTAMA
    defineField({
      name: 'mainImage',
      title: 'Gambar Utama / Dokumentasi',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),

    // 6. LAMPIRAN PDF RESMI (Fitur Penting Siaran Pers)
    defineField({
      name: 'officialDoc',
      title: 'Dokumen Resmi (PDF)',
      description: 'Upload file PDF asli Siaran Pers jika ada.',
      type: 'file',
      options: {
        accept: '.pdf'
      },
    }),

    // 7. ISI KONTEN
    defineField({
      name: 'body',
      title: 'Isi Siaran Pers',
      type: 'array',
      of: [
        {
          type: 'block',
        },
        {
          type: 'image',
          options: { hotspot: true }
        }
      ],
    }),
  ],

  // Tampilan di Dashboard
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
        }) : 'Draft',
        media: media
      }
    },
  },
})