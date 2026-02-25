import type { SchemaTypeDefinition } from "sanity"

// ==========================
// Import Schema Utama
// ==========================
import post from "./post"
import announcement from "./announcement"
import documentSchema from "./document"
import gallery from "./gallery"

// ==========================
// Import Schema Pendukung
// ==========================
import pressRelease from "./pressRelease"
import profileSection from "./profileSection"
import school from "./school"
import siteSettings from "./siteSettings"
import youtube from "./youtube" // --- IMPORT BARU ---

// ==========================
// Gabungkan Semua Schema
// ==========================
export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  announcement,
  documentSchema,
  gallery,
  pressRelease,
  profileSection,
  school,
  siteSettings,
  youtube, // --- DAFTARKAN DI SINI ---
]

// ==========================
// Export untuk sanity.config.ts
// ==========================
export const schema = {
  types: schemaTypes,
}