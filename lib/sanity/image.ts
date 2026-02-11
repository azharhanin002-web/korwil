import createImageUrlBuilder from '@sanity/image-url'
import { client } from './client' // Mengambil client dari file di atas

const builder = createImageUrlBuilder(client)

export function urlFor(source: any) {
  return builder.image(source)
}