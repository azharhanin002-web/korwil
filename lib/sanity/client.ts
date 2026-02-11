import { createClient } from 'next-sanity'

export const client = createClient({
  // Kita paksa pakai ID Project Korwil (dari screenshot Anda sebelumnya)
  projectId: 'de303cs3', 
  
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false, 
})