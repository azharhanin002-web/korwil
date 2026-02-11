import { defineField, defineType } from 'sanity'
import { GraduationCap } from 'lucide-react' // Ikon Sekolah/Topi Wisuda

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

    // 2. NPSN (Nomor Pokok Sekolah Nasional)
    defineField({
      name: 'npsn',
      title: 'NPSN',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // 3. JENJANG PENDIDIKAN
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

    // 4. STATUS (Negeri/Swasta)
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

    // 5. AKREDITASI
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

    // 6. KEPALA SEKOLAH
    defineField({
      name: 'headmaster',
      title: 'Nama Kepala Sekolah',
      type: 'string',
    }),

    // 7. ALAMAT
    defineField({
      name: 'address',
      title: 'Alamat Lengkap',
      type: 'text',
      rows: 3,
    }),

    // 8. FOTO SEKOLAH
    defineField({
      name: 'image',
      title: 'Foto Sekolah',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),

    // 9. LINK MAPS (Opsional)
    defineField({
      name: 'mapsUrl',
      title: 'Link Google Maps',
      type: 'url',
    }),
  ],

  // Tampilan di Dashboard
  preview: {
    select: {
      title: 'name',
      subtitle: 'npsn',
      media: 'image',
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