'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DocSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    params.set('page', '1'); // Reset ke hal 1 saat cari
    router.push(`/dokumen?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Cari nama dokumen..."
        className="w-full pl-12 pr-10 py-3 rounded-2xl bg-white border border-slate-100 shadow-xl text-xs font-bold uppercase tracking-widest text-slate-700 outline-none focus:ring-2 focus:ring-blue-600 transition-all"
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      {query && (
        <button 
          type="button"
          onClick={() => { setQuery(''); router.push('/dokumen'); }}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
}