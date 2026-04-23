import { defineField, defineType } from "sanity"
import { NotebookPen, Eye, Video } from "lucide-react"

export default defineType({
  name: "post",
  title: "Berita & Artikel",
  type: "document",
  icon: NotebookPen as any,

  fields: [
    defineField({
      name: "title",
      title: "Judul Berita",
      type: "string",
      validation: (Rule) => Rule.required().error("Judul wajib diisi!"),
    }),

    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "category",
      title: "Kategori",
      type: "string",
      options: {
        list: [
          { title: "Berita Dinas", value: "Berita Dinas" },
          { title: "Berita Pendidikan", value: "Berita Pendidikan" },
          { title: "Pengumuman", value: "Pengumuman" },
          { title: "Video Dokumentasi", value: "Video" },
          { title: "Artikel Guru", value: "Artikel Guru" },
          { title: "PGRI", value: "PGRI" },
          { title: "Kepramukaan", value: "Kepramukaan" },
          { title: "Agenda / Kegiatan", value: "Agenda" },
        ],
        layout: "radio", 
      },
      initialValue: "Berita Dinas",
      validation: (Rule) => Rule.required(),
    }),

    // --- FIELD BARU: LINK VIDEO YOUTUBE ---
    defineField({
      name: "videoUrl",
      title: "Link Video YouTube",
      description: "Tempel link YouTube di sini (Thumbnail akan otomatis diambil jika kategori adalah Video)",
      type: "url",
      // Hanya muncul jika kategori yang dipilih adalah "Video"
      hidden: ({ document }) => document?.category !== "Video",
      validation: (Rule) => Rule.custom((url, context) => {
        if (context.document?.category === "Video" && !url) {
          return "Link YouTube wajib diisi untuk kategori Video!";
        }
        return true;
      }),
    }),

    defineField({
      name: "mainImage",
      title: "Gambar Utama",
      description: "Kosongkan saja jika kategori adalah 'Video', sistem akan mengambil thumbnail YouTube otomatis.",
      type: "image",
      options: { hotspot: true },
      // Gambar wajib diisi KECUALI jika kategorinya Video
      validation: (Rule) => Rule.custom((value, context) => {
        if (context.document?.category !== "Video" && !value) {
          return "Gambar utama wajib diisi!";
        }
        return true;
      }),
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alt Text (SEO)",
          initialValue: "Gambar Berita Korwil",
        },
      ],
    }),

    defineField({
      name: "isHeadline",
      title: "Jadikan Headline Slider?",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "publishedAt",
      title: "Tanggal Tayang",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: "body",
      title: "Isi Konten",
      type: "array",
      of: [
        { type: "block" },
        {
          type: "image",
          options: { hotspot: true },
          fields: [{ name: "caption", type: "string", title: "Keterangan" }],
        },
        { type: "youtube" }, 
      ],
    }),

    defineField({
      name: "views",
      title: "Jumlah Dilihat",
      type: "number",
      icon: Eye as any,
      initialValue: 0,
    }),
  ],

  preview: {
    select: {
      title: "title",
      category: "category",
      media: "mainImage",
      videoUrl: "videoUrl",
    },
    prepare({ title, category, media, videoUrl }) {
      const isVideo = category === "Video";
      
      // Ambil ID YouTube untuk thumbnail di dashboard Sanity
      let remoteThumb = null;
      if (isVideo && videoUrl) {
        const videoId = videoUrl.includes("v=") ? videoUrl.split("v=")[1].split("&")[0] : videoUrl.split("/").pop();
        remoteThumb = `https://img.youtube.com/vi/${videoId}/default.jpg`;
      }

      return {
        title,
        subtitle: `[${category}]`,
        // Tampilkan thumb YT di dashboard kalau kategorinya video
        media: isVideo ? (remoteThumb ? null : Video) : media,
      };
    },
  },
});