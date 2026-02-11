import { defineField, defineType } from 'sanity'
import { Info } from 'lucide-react' // Ikon Info untuk Profil

export default defineType({
  name: 'profileSection',
  title: 'Profil (Halaman Statis)',
  type: 'document',
  icon: Info as any,
  fields: [
    // 1. JUDUL HALAMAN
    defineField({
      name: 'title',
      title: 'Judul Halaman',
      description: 'Contoh: Visi & Misi, Sejarah, Tugas & Fungsi',
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

    // 3. GAMBAR BANNER (Opsional)
    defineField({
      name: 'mainImage',
      title: 'Gambar Utama / Banner',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),

    // 4. ISI KONTEN (Rich Text)
    defineField({
      name: 'content',
      title: 'Isi Konten',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
        },
        {
          type: 'image', // Bisa masukkan gambar di tengah teks
          options: { hotspot: true }
        }
      ],
    }),
  ],

  // Tampilan di Dashboard
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
    },
  },
})