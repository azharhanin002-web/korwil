"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    // Ini akan melempar user ke halaman /search?q=apa-yang-diketik
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-lg mx-auto">
      <input
        type="text"
        placeholder="Cari berita atau artikel..."
        className="w-full px-6 py-3 rounded-full border-2 border-yellow-400 focus:border-blue-500 focus:outline-none shadow-sm text-sm"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button 
        type="submit" 
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
      >
        <Search size={20} />
      </button>
    </form>
  )
}