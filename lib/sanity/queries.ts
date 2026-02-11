import { groq } from 'next-sanity';

// ==========================================================
// 1. QUERY HALAMAN BERANDA (HOMEPAGE)
// ==========================================================

// A. Slider (Mengambil 5 berita terbaru yang ditandai sebagai Headline)
export const sliderQuery = groq`
  *[_type == "post" && isHeadline == true] | order(publishedAt desc)[0...5] {
    _id,
    title,
    publishedAt,
    mainImage,
    slug,
    category
  }
`;

// B. Berita Utama (1 Berita terbaru yang BUKAN headline)
export const mainNewsQuery = groq`
  *[_type == "post" && !isHeadline] | order(publishedAt desc)[0] {
    _id,
    title,
    publishedAt,
    mainImage,
    category,
    slug,
    views
  }
`;

// C. Berita Samping (3 Berita setelah berita utama)
export const sideNewsQuery = groq`
  *[_type == "post" && !isHeadline] | order(publishedAt desc)[1...4] {
    _id,
    title,
    publishedAt,
    mainImage,
    category,
    slug,
    views
  }
`;

// D. Semua Artikel (Grid bawah, ambil mulai dari urutan ke-5)
export const allArticlesQuery = groq`
  *[_type == "post"] | order(publishedAt desc)[4...12] {
    _id,
    title,
    publishedAt,
    mainImage,
    category,
    slug,
    views
  }
`;

// E. Widget GPR (Khusus kategori Berita Dinas)
export const gprDataQuery = groq`
  *[_type == "post" && category == "Berita"] | order(publishedAt desc)[0...4] {
    _id,
    title,
    publishedAt,
    category,
    slug
  }
`;

// ==========================================================
// 2. QUERY DETAIL BERITA (SINGLE PAGE)
// ==========================================================
export const postDetailQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    publishedAt,
    mainImage,
    category,
    body,
    views,
    "related": *[_type == "post" && category == ^.category && _id != ^._id] | order(publishedAt desc)[0...3] {
      _id, title, slug, mainImage, publishedAt
    }
  }
`;

// ==========================================================
// 3. QUERY DATA LAINNYA (PROFIL, DOKUMEN, DLL)
// ==========================================================

// Data Sekolah
export const schoolsQuery = groq`
  *[_type == "school"] | order(name asc) {
    _id, name, npsn, level, status, address, image, mapsUrl
  }
`;

// Data Pejabat / Struktur Organisasi
export const officialsQuery = groq`
  *[_type == "official"] | order(rank asc) {
    _id, name, position, nip, image
  }
`;

// Galeri Foto
export const galleryQuery = groq`
  *[_type == "gallery"] | order(publishedAt desc) {
    _id, title, publishedAt, mainImage, slug, images
  }
`;

// Dokumen & Unduhan
export const documentsQuery = groq`
  *[_type == "documents"] | order(publishedAt desc) {
    _id, title, category, publishedAt, fileSource, description
  }
`;

// Pengaturan Website Global (Logo, Sosmed, Alamat)
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0]
`;