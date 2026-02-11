import { defineField, defineType } from 'sanity'
import { NotebookPen } from 'lucide-react' // Ikon dashboard

export default defineType({
  name: 'post',
  title: 'Berita & Artikel',
  type: 'document',
  // Ikon ini akan muncul di sidebar Sanity Studio
  icon: NotebookPen as any, 
  fields: [
    // 1. JUDUL
    defineField({
      name: 'title',
      title: 'Judul Berita',
      type: 'string',
      validation: (Rule) => Rule.required().error('Judul wajib diisi!'),
    }),

    // 2. SLUG (URL)
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      description: 'Klik "Generate" untuk membuat URL otomatis dari judul',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    // 3. KATEGORI (DISESUAIKAN DENGAN STRUKTUR MENU ANDA)
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'Berita Dinas', value: 'Berita' },       // Masuk ke Menu Berita
          { title: 'Pengumuman', value: 'Pengumuman' },     // Masuk ke Menu Pengumuman
          { title: 'Artikel Guru', value: 'Artikel' },      // Masuk ke Menu Artikel
          { title: 'PGRI', value: 'PGRI' },                 // Masuk ke Menu PGRI
          { title: 'Kepramukaan', value: 'Pramuka' },       // Masuk ke Menu Kepramukaan
          { title: 'Agenda / Kegiatan', value: 'Agenda' },  // Tambahan untuk Kalender
        ],
        layout: 'radio' 
      },
      initialValue: 'Berita',
      validation: (Rule) => Rule.required(),
    }),

    // 4. GAMBAR UTAMA
    defineField({
      name: 'mainImage',
      title: 'Gambar Utama',
      type: 'image',
      options: {
        hotspot: true, // Agar bisa crop fokus gambar
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Deskripsi gambar untuk tunanetra & SEO (Wajib diisi sebaiknya)',
          initialValue: 'Dokumentasi Kegiatan'
        }
      ]
    }),

    // 5. OPSI SLIDER (HEADLINE)
    defineField({
      name: 'isHeadline',
      title: 'Jadikan Headline Slider?',
      description: 'Aktifkan ini jika ingin berita muncul di SLIDER BESAR paling atas (Beranda).',
      type: 'boolean',
      initialValue: false,
    }),

    // 6. TANGGAL PUBLISH
    defineField({
      name: 'publishedAt',
      title: 'Tanggal Tayang',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),

    // 7. ISI BERITA (Rich Text)
    defineField({
      name: 'body',
      title: 'Isi Berita',
      type: 'array',
      of: [
        {
          type: 'block',
          // Styles untuk Heading
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Judul Besar (H2)', value: 'h2'},
            {title: 'Sub Judul (H3)', value: 'h3'},
            {title: 'Kutipan', value: 'blockquote'},
          ],
        },
        {
          type: 'image', // Agar bisa masukin gambar di tengah paragraf
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Caption Gambar',
              options: { isHighlighted: true }
            }
          ]
        }
      ],
    }),

    // 8. VIEW COUNTER (Opsional)
    defineField({
      name: 'views',
      title: 'Jumlah Dilihat (Manual)',
      description: 'Angka ini akan muncul di kartu berita. Bisa diisi manual untuk memalsukan popularitas.',
      type: 'number',
      initialValue: 0,
    }),
  ],

  // Konfigurasi Tampilan List di Dashboard
  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'mainImage',
      headline: 'isHeadline',
      date: 'publishedAt'
    },
    prepare(selection) {
      const { title, category, headline, date } = selection
      const dateFormatted = date ? new Date(date).toLocaleDateString('id-ID') : ''
      return {
        title: title,
        subtitle: `${headline ? '⭐ HEADLINE | ' : ''}[${category}] - ${dateFormatted}`,
        media: selection.media
      }
    },
  },
})