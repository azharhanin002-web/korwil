import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/studio/', // Jangan biarkan Google indeks dashboard Sanity kamu
    },
    sitemap: 'https://www.korwilbarat.web.id/sitemap.xml',
  }
}