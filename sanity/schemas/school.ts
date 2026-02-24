import { defineField, defineType } from 'sanity'
import { GraduationCap } from 'lucide-react' 

export default defineType({
  name: 'school',
  title: 'Data Sekolah',
  type: 'document',
  icon: GraduationCap as any,
  fields: [
    // 1. NAMA SEKOLAH
    defineField({
      name: 'name',
      title: 'Nama Sekolah',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // 2. SLUG (BARU - Untuk URL Cantik)
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      description: 'Klik "Generate" setelah mengisi nama sekolah agar URL otomatis terisi',
      options: {
        source: 'name', // Mengambil data otomatis dari field 'name'
        maxLength: 96,
      },
      validation: (Rule) => Rule.required().error('Slug wajib diisi untuk keperluan URL halaman!'),
    }),

    // 3. LOGO SEKOLAH
    defineField({
      name: 'logo',
      title: 'Logo Sekolah',
      type: 'image',
      description: 'Upload logo resmi sekolah (disarankan format PNG transparan)',
      options: {
        hotspot: true,
      },
    }),

    // 4. NPSN
    defineField({
      name: 'npsn',
      title: 'NPSN',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // 5. JENJANG PENDIDIKAN
    defineField({
      name: 'level',
      title: 'Jenjang',
      type: 'string',
      options: {
        list: [
          { title: 'PAUD / TK', value: 'PAUD' },
          { title: 'SD / MI', value: 'SD' },
          { title: 'SMP / MTs', value: 'SMP' },
          { title: 'SMA / SMK / MA', value: 'SMA' },
          { title: 'SLB', value: 'SLB' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),

    // 6. STATUS (Negeri/Swasta)
    defineField({
      name: 'status',
      title: 'Status Sekolah',
      type: 'string',
      options: {
        list: [
          { title: 'Negeri', value: 'Negeri' },
          { title: 'Swasta', value: 'Swasta' },
        ],
        layout: 'radio'
      },
      initialValue: 'Negeri',
    }),

    // 7. PROFIL SINGKAT SEKOLAH
    defineField({
      name: 'shortProfile',
      title: 'Profil Singkat Sekolah',
      description: 'Ringkasan mengenai sejarah atau gambaran umum sekolah',
      type: 'text',
      rows: 5,
    }),

    // 8. VISI & MISI
    defineField({
      name: 'visionMission',
      title: 'Visi & Misi Sekolah',
      description: 'Tuliskan visi dan misi sekolah di sini',
      type: 'array',
      of: [{ type: 'block' }],
    }),

    // 9. AKREDITASI
    defineField({
      name: 'accreditation',
      title: 'Akreditasi',
      type: 'string',
      options: {
        list: [
          { title: 'A', value: 'A' },
          { title: 'B', value: 'B' },
          { title: 'C', value: 'C' },
          { title: 'Belum Terakreditasi', value: 'Belum' },
        ],
      },
    }),

    // 10. KEPALA SEKOLAH
    defineField({
      name: 'headmaster',
      title: 'Nama Kepala Sekolah',
      type: 'string',
    }),

    // 11. ALAMAT
    defineField({
      name: 'address',
      title: 'Alamat Lengkap',
      type: 'text',
      rows: 3,
    }),

    // 12. FOTO UTAMA SEKOLAH
    defineField({
      name: 'image',
      title: 'Foto Gedung/Halaman Sekolah',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),

    // 13. LINK MAPS
    defineField({
      name: 'mapsUrl',
      title: 'Link Google Maps',
      type: 'url',
    }),
  ],

  preview: {
    select: {
      title: 'name',
      subtitle: 'npsn',
      media: 'logo',
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      return {
        title: title,
        subtitle: `NPSN: ${subtitle}`,
        media: media
      }
    },
  },
})