'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity.config' // Pastikan jalur ini benar mengarah ke file sanity.config.ts di luar

export default function StudioPage() {
  return <NextStudio config={config} />
}