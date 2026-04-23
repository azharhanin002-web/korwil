import { MetadataRoute } from 'next'
import { client } from "@/lib/sanity/client"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.korwilbarat.web.id'

  // --- 1. FETCH DATA DINAMIS DARI SANITY ---
  // Kita ambil semua post, kategori, dan tanggal update terakhirnya
  const query = `*[_type == "post"]{
    "slug": slug.current,
    category,
    _updatedAt
  }`
  
  const posts = await client.fetch(query)

  // --- 2. LOGIKA MAPPING URL DINAMIS ---
  const dynamicRoutes = posts.map((post: any) => {
    // Menentukan sub-folder berdasarkan kategori di Sanity
    let route = 'berita' // default
    if (post.category === 'PGRI') route = 'pgri'
    if (post.category === 'Kepramukaan') route = 'pramuka'
    if (post.category === 'Artikel Guru') route = 'artikel'
    if (post.category === 'Pengumuman') route = 'berita' // atau folder khusus pengumuman

    return {
      url: `${baseUrl}/${route}/${post.slug}`,
      lastModified: new Date(post._updatedAt),
      changeFrequency: 'weekly' as const, // Berita biasanya jarang berubah setelah publish
      priority: 0.7, // Artikel punya prioritas menengah
    }
  })

  // --- 3. HALAMAN STATIS (PRIORITAS TINGGI) ---
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0, // Halaman utama paling penting
    },
    {
      url: `${baseUrl}/berita`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pgri`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pramuka`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/artikel`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]

  // --- 4. GABUNGKAN SEMUA ---
  return [...staticRoutes, ...dynamicRoutes]
}