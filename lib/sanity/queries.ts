import { groq } from 'next-sanity'

// ==========================================================
// 1. HOMEPAGE & SEARCH
// ==========================================================

// KUERI PENCARIAN (Baru)
// Mencari berdasarkan judul yang mengandung kata kunci (searchTerm)
export const searchNewsQuery = groq`
  *[_type == "post" && title match $searchTerm + "*"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    "category": category,
    views
  }
`

// A. SLIDER
export const sliderQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(isHeadline desc, publishedAt desc)[0...5] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    "category": category
  }
`

// B. BERITA UTAMA
export const mainNewsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    "category": category,
    views
  }
`

// C. BERITA SAMPING
export const sideNewsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[1...4] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    "category": category,
    views
  }
`

// D. GRID ARTIKEL
export const allArticlesQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...12] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    "category": category,
    views
  }
`

// E. GPR DATA (Sekarang menggunakan filter kategori yang benar)
export const gprDataQuery = groq`
  *[_type == "post" && category == "Berita Dinas"] | order(publishedAt desc)[0...4] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    "category": category
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
    "category": category,
    body,
    views,
    "related": *[_type == "post" && category == ^.category && _id != ^._id] | order(publishedAt desc)[0...3] {
      _id,
      title,
      "slug": slug.current,
      mainImage,
      publishedAt
    }
  }
`

// Kueri pendukung lainnya
export const schoolsQuery = groq`*[_type == "school"] | order(name asc) { _id, name, npsn, level, status, address, image, mapsUrl }`
export const officialsQuery = groq`*[_type == "official"] | order(rank asc) { _id, name, position, nip, image }`
export const documentsQuery = groq`*[_type == "document"] | order(publishedAt desc) { _id, title, category, publishedAt, fileSource, description }`
export const siteSettingsQuery = groq`*[_type == "siteSettings"][0] { logo, siteName, address, phone, email, socialMedia }`