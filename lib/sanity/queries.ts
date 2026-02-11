import { groq } from 'next-sanity'

// ==========================================================
// 1. HOMEPAGE
// ==========================================================

// A. SLIDER (Headline diutamakan, ambil 5)
export const sliderQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(isHeadline desc, publishedAt desc)[0...5] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    "category": categories[0]->title
  }
`

// B. BERITA UTAMA (Berita paling baru nomor 1)
export const mainNewsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    "category": categories[0]->title,
    views
  }
`

// C. BERITA SAMPING (Urutan 2 sampai 4)
export const sideNewsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[1...4] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    "category": categories[0]->title,
    views
  }
`

// D. GRID ARTIKEL (PERBAIKAN: Ambil dari 0 agar tidak kosong jika berita masih sedikit)
// Gunakan [0...12] agar semua berita muncul di grid bawah jika Anda baru mulai mengisi data
export const allArticlesQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...12] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    "category": categories[0]->title,
    views
  }
`

// E. GPR DATA (Berita khusus kategori Berita Dinas)
export const gprDataQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...4] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    "category": categories[0]->title
  }
`

// ==========================================================
// 2. DETAIL BERITA
// ==========================================================

export const postDetailQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    "category": categories[0]->title,
    body,
    views,
    "related": *[_type == "post" && categories[0]->title == ^.categories[0]->title && _id != ^._id] | order(publishedAt desc)[0...3] {
      _id,
      title,
      "slug": slug.current,
      mainImage,
      publishedAt
    }
  }
`

// Kueri pendukung
export const schoolsQuery = groq`*[_type == "school"] | order(name asc) { _id, name, npsn, level, status, address, image, mapsUrl }`
export const officialsQuery = groq`*[_type == "official"] | order(rank asc) { _id, name, position, nip, image }`
export const documentsQuery = groq`*[_type == "document"] | order(publishedAt desc) { _id, title, category, publishedAt, fileSource, description }`
export const siteSettingsQuery = groq`*[_type == "siteSettings"][0] { logo, siteName, address, phone, email, socialMedia }`