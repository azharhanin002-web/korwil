'use client'; 

import { useRouter, useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';

export default function YearFilter({ years, currentYear }: { years: string[], currentYear: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedYear = e.target.value;
    
    // Ambil semua param yang sudah ada (kategori, dll) agar tidak hilang
    const params = new URLSearchParams(searchParams.toString());
    
    if (selectedYear) {
      params.set('tahun', selectedYear);
    } else {
      params.delete('tahun');
    }
    
    // Setiap ganti filter, wajib reset ke halaman 1
    params.set('page', '1');
    
    // Pindah halaman menggunakan router (Navigasi Client-side)
    router.push(`/dokumen?${params.toString()}`);
  };

  return (
    <div className="bg-white p-2 rounded-3xl shadow-xl border border-slate-100 flex items-center px-4">
      <Filter size={16} className="text-slate-400 mr-2" />
      <select 
        className="w-full bg-transparent text-[11px] font-bold uppercase tracking-widest text-slate-700 outline-none cursor-pointer"
        onChange={handleYearChange}
        value={currentYear}
      >
        <option value="">Tahun Ajaran</option>
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
    </div>
  );
}