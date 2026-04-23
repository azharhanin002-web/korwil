import { groq } from 'next-sanity'

// ==========================================================
// 1. HOMEPAGE & SEARCH (BERITA & GALERI)
// ==========================================================

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
    videoUrl,
    "category": category,
    views
  }
`

export const sliderQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(isHeadline desc, publishedAt desc)[0...5] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    videoUrl,
    "category": category
  }
`

export const mainNewsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    videoUrl,
    "category": category,
    views
  }
`

export const sideNewsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[1...5] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    videoUrl,
    "category": category,
    views
  }
`

export const allArticlesQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...12] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    videoUrl,
    "category": category,
    views
  }
`

// ==========================================================
// 2. DETAIL BERITA & SIDEBAR LOGIC (TRENDING BULANAN)
// ==========================================================

export const postDetailQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
    videoUrl,
    "category": category,
    body,
    views,
    
    // Berita Terkait (4 Post)
    "related": *[_type == "post" && category == ^.category && _id != ^._id] | order(publishedAt desc)[0...4] {
      _id,
      title,
      "slug": slug.current,
      mainImage,
      videoUrl,
      "category": category,
      publishedAt
    },

    // WIDGET SIDEBAR 1: SEKOLAH TERAKTIF BULANAN
    // Menghitung sebutan sekolah hanya yang terbit setelah $monthStart
    "trendingSchools": *[_type == "school"] {
      _id,
      name,
      "slug": slug.current,
      logo,
      status,
      "mentionCount": count(*[_type == "post" && (title match ^.name || pt::text(body) match ^.name) && publishedAt >= $monthStart])
    } | order(mentionCount desc)[0...5],

    // WIDGET SIDEBAR 2: POSTINGAN TERPOPULER
    "popularPosts": *[_type == "post" && slug.current != $slug] | order(views desc)[0...5] {
      _id,
      title,
      "slug": slug.current,
      mainImage,
      videoUrl,
      publishedAt,
      views,
      "category": category
    }
  }
`

// ==========================================================
// 3. KUERI PENDUKUNG
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