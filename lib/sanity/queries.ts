import { groq } from 'next-sanity'

// ==========================================================
// 1. HOMEPAGE & SEARCH (BERITA & GALERI)
// ==========================================================

// FIX: Pencarian kini juga menarik data videoUrl agar thumb video muncul di hasil cari
export const searchNewsQuery = groq`
  *[
    (_type == "post" || _type == "gallery") && 
    defined(slug.current) && 
    (
      title match $searchTerm || 
      category match $searchTerm || 
      pt::text(body) match $searchTerm ||
      description match $searchTerm
    )
  ] | order(publishedAt desc) {
    _id,
    _type,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    videoUrl, // <-- DITAMBAHKAN
    "category": category,
    views
  }
`

// A. SLIDER (Headline)
export const sliderQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(isHeadline desc, publishedAt desc)[0...5] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    videoUrl, // <-- DITAMBAHKAN
    "category": category
  }
`

// B. BERITA UTAMA (Paling Baru)
export const mainNewsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    videoUrl, // <-- DITAMBAHKAN
    "category": category,
    views
  }
`

// C. BERITA SAMPING (Urutan 2 sampai 4)
export const sideNewsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[1...5] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    videoUrl, // <-- DITAMBAHKAN
    "category": category,
    views
  }
`

// D. GRID ARTIKEL (Semua kategori)
export const allArticlesQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...12] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    videoUrl, // <-- DITAMBAHKAN
    "category": category,
    views
  }
`

// ==========================================================
// 2. DETAIL BERITA & RELASI
// ==========================================================

export const postDetailQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    videoUrl, // <-- DITAMBAHKAN
    "category": category,
    body,
    views,
    "related": *[_type == "post" && category == ^.category && _id != ^._id] | order(publishedAt desc)[0...4] {
      _id,
      title,
      "slug": slug.current,
      mainImage,
      videoUrl, // <-- DITAMBAHKAN AGAR THUMB RELASI TIDAK PECAH
      "category": category,
      publishedAt
    }
  }
`

// ==========================================================
// 3. KUERI PENDUKUNG (TIDAK BERUBAH)
// ==========================================================

export const schoolsQuery = groq`
  *[_type == "school"] | order(name asc) { 
    _id, 
    name, 
    "slug": slug.current,
    logo,
    npsn, 
    level, 
    status, 
    address, 
    image, 
    mapsUrl 
  }
`

export const documentsQuery = groq`
  *[_type == "documentFile"] | order(publishedAt desc) { 
    _id, 
    title, 
    category, 
    description,
    publishedAt, 
    "fileUrl": fileSource.asset->url,
    "fileName": fileSource.asset->originalFilename,
    "fileSize": fileSource.asset->size,
    downloads
  }
`

export const galleryQuery = groq`
  *[_type == "gallery"] | order(publishedAt desc) {
    _id,
    title,
    "category": category,
    description,
    mainImage,
    publishedAt
  }
`

export const officialsQuery = groq`
  *[_type == "official"] | order(rank asc) { 
    _id, 
    name, 
    position, 
    nip, 
    image 
  }
`

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] { 
    logo, 
    siteName, 
    address, 
    phone, 
    email, 
    socialMedia 
  }
`