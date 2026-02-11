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
import official from "./official"
import pressRelease from "./pressRelease"
import profileSection from "./profileSection"
import school from "./school"
import siteSettings from "./siteSettings"

// ==========================
// Gabungkan Semua Schema
// ==========================
export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  announcement,
  documentSchema,
  gallery,
  official,
  pressRelease,
  profileSection,
  school,
  siteSettings,
]

// ==========================
// Export untuk sanity.config.ts
// ==========================
export const schema = {
  types: schemaTypes,
}
