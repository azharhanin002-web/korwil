import { defineField, defineType } from 'sanity'
import { Settings } from 'lucide-react' // Ikon Roda Gigi / Pengaturan

export default defineType({
  name: 'siteSettings',
  title: 'Pengaturan Situs (Global)',
  type: 'document',
  icon: Settings as any,
  fields: [
    // --- BAGIAN 1: IDENTITAS WEBSITE ---
    defineField({
      name: 'siteTitle',
      title: 'Nama Website / Instansi',
      description: 'Akan muncul di Tab Browser dan Header.',
      type: 'string',
    }),
    defineField({
      name: 'siteLogo',
      title: 'Logo Instansi',
      description: 'Upload logo transparan (PNG) sebaiknya.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'siteDescription',
      title: 'Deskripsi Singkat (SEO)',
      description: 'Penjelasan singkat tentang website ini untuk mesin pencari Google.',
      type: 'text',
      rows: 3,
    }),

    // --- BAGIAN 2: KONTAK & ALAMAT ---
    defineField({
      name: 'address',
      title: 'Alamat Lengkap',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'email',
      title: 'Email Resmi',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Nomor Telepon / WhatsApp',
      type: 'string',
    }),
    defineField({
      name: 'mapsLink',
      title: 'Link Google Maps',
      type: 'url',
    }),

    // --- BAGIAN 3: SOSIAL MEDIA ---
    defineField({
      name: 'socialMedia',
      title: 'Akun Sosial Media',
      type: 'object',
      fields: [
        { name: 'facebook', title: 'Facebook URL', type: 'url' },
        { name: 'instagram', title: 'Instagram URL', type: 'url' },
        { name: 'youtube', title: 'YouTube Channel URL', type: 'url' },
        { name: 'tiktok', title: 'TikTok URL', type: 'url' },
        { name: 'twitter', title: 'Twitter / X URL', type: 'url' },
      ],
      options: {
        collapsible: true, // Bisa dilipat agar rapi
        collapsed: false,
      }
    }),

    // --- BAGIAN 4: FOOTER ---
    defineField({
      name: 'footerText',
      title: 'Teks Copyright Footer',
      description: 'Contoh: © 2026 Kementerian Pendidikan Dasar dan Menengah',
      type: 'string',
    }),
  ],

  // Tampilan di Dashboard
  preview: {
    select: {
      title: 'siteTitle',
    },
    prepare(selection) {
      return {
        title: selection.title || 'Pengaturan Situs',
        subtitle: 'Konfigurasi Global Website',
        media: Settings as any
      }
    },
  },
})