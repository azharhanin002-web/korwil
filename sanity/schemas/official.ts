import { defineField, defineType } from 'sanity'
import { User } from 'lucide-react' // Ikon User/Orang

export default defineType({
  name: 'official',
  title: 'Pejabat / Struktur Organisasi',
  type: 'document',
  icon: User as any,
  fields: [
    // 1. NAMA LENGKAP
    defineField({
      name: 'name',
      title: 'Nama Lengkap (Beserta Gelar)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    // 2. JABATAN
    defineField({
      name: 'position',
      title: 'Jabatan',
      type: 'string', // Contoh: Kepala Dinas, Sekretaris, dll.
      validation: (Rule) => Rule.required(),
    }),

    // 3. NIP (Nomor Induk Pegawai) - Opsional
    defineField({
      name: 'nip',
      title: 'NIP (Opsional)',
      type: 'string',
    }),

    // 4. FOTO PROFIL
    defineField({
      name: 'image',
      title: 'Foto Profil',
      type: 'image',
      options: {
        hotspot: true, // Agar bisa crop fokus wajah
      },
      validation: (Rule) => Rule.required(),
    }),

    // 5. URUTAN TAMPIL
    defineField({
      name: 'rank',
      title: 'Urutan Tampil',
      description: 'Isi angka 1 untuk Kepala Dinas (paling atas), angka 2 untuk Sekretaris, dst.',
      type: 'number',
      initialValue: 99,
    }),

    // 6. MEDIA SOSIAL / KONTAK (Opsional)
    defineField({
      name: 'socialMedia',
      title: 'Link Social Media / Kontak',
      type: 'url',
      description: 'Link ke profil LinkedIn, Instagram, atau Website pribadi (Opsional).',
    }),
  ],

  // Tampilan di Dashboard
  preview: {
    select: {
      title: 'name',
      subtitle: 'position',
      media: 'image',
    },
  },
})