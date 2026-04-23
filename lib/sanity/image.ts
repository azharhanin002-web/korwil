import { createImageUrlBuilder } from '@sanity/image-url'; // Gunakan named export
import { client } from './client';

// Buat builder yang modern
const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}