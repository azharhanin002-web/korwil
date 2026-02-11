import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure' // Versi terbaru pengganti deskTool
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas' 

export default defineConfig({
  name: 'default',
  title: 'Korwil Barat',

  projectId: 'de303cs3', // Sesuai ID di screenshot Anda
  dataset: 'production',

  basePath: '/studio',

  plugins: [
    structureTool(), 
    visionTool()
  ],

  schema: {
    types: schemaTypes,
  },
})