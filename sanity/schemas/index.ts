import { type SchemaTypeDefinition } from 'sanity'

// 1. Import Schema Utama
import post from './post'
import announcement from './announcement'
// PERBAIKAN: Menghapus 's' agar sesuai nama file document.ts Anda
import document from './document' 
import gallery from './gallery'

// 2. Import Schema Pendukung (Sesuai screenshot folder Anda)
import official from './official'
import pressRelease from './pressRelease'
import profileSection from './profileSection'
import school from './school'
import siteSettings from './siteSettings'

export const schemaTypes = [
  // Masukkan semua schema ke dalam array ini
  post,
  announcement,
  document,
  gallery,
  official,
  pressRelease,
  profileSection,
  school,
  siteSettings,
]

// Ekspor dalam format yang dibutuhkan oleh sanity.config.ts
export const schema: { types: SchemaTypeDefinition[] } = {
  types: schemaTypes,
}