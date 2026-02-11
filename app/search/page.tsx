import { client } from '@/lib/sanity/client'
import { searchNewsQuery } from '@/lib/sanity/queries'
import ArtikelLainnya from '@/components/ArtikelLainnya'

export default async function SearchPage({ searchParams }: { searchParams: { q: string } }) {
  const searchTerm = searchParams.q || ''
  const results = await client.fetch(searchNewsQuery, { searchTerm })

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6 px-4">
        Hasil Pencarian untuk: <span className="text-blue-600">"{searchTerm}"</span>
      </h1>
      
      {results.length > 0 ? (
        <ArtikelLainnya posts={results} />
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500">Berita tidak ditemukan. Coba kata kunci lain.</p>
        </div>
      )}
    </main>
  )
}