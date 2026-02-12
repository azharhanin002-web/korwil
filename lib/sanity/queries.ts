import { groq } from 'next-sanity'

// ==========================================================
// 1. HOMEPAGE & SEARCH
// ==========================================================

export const searchNewsQuery = groq`
  *[_type == "post" && (title match $searchTerm + "*" || category match $searchTerm + "*")] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    mainImage,
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
    "category": category,
    views
  }
`

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

export const gprDataQuery = groq`
  *[_type == "post" && defined(slug.current)] 
  | order(select(category == "Berita Dinas" => 1, 0) desc, publishedAt desc)[0...4] {
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

// ==========================================================
// 3. KUERI PENDUKUNG (FIXED FOR IMAGES)
// ==========================================================

// PERBAIKAN: Memastikan image diambil dengan benar agar urlFor tidak error
export const schoolsQuery = groq`
  *[_type == "school"] | order(name asc) { 
    _id, 
    name, 
    npsn, 
    level, 
    status, 
    address, 
    image, 
    mapsUrl 
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

export const documentsQuery = groq`
  *[_type == "document"] | order(publishedAt desc) { 
    _id, 
    title, 
    category, 
    publishedAt, 
    fileSource, 
    description 
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