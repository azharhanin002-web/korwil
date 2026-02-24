import { client } from "@/lib/sanity/client";
import { schoolsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import Image from "next/image";
import Link from "next/link";
import { MapPin, School, GraduationCap, ArrowRight, Map } from "lucide-react";

export const revalidate = 0; 

export default async function SekolahPage() {
  const schools = await client.fetch(schoolsQuery, {}, { cache: 'no-store' });

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 min-h-screen bg-gray-50/30">
      
      {/* Header Halaman */}
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
            <School size={200} />
        </div>
        <div className="relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                <GraduationCap size={16} /> Direktori Pendidikan
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-[#002040] mb-4 tracking-tighter uppercase">
                Satuan Pendidikan
            </h1>
            <p className="text-gray-500 max-w-2xl font-medium mx-auto md:mx-0">
                Daftar resmi sekolah jenjang SD/MI di wilayah Korwilcam Dindik Purwokerto Barat.
            </p>
        </div>
      </div>

      {/* Grid Data Sekolah */}
      {!schools || schools.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[3rem] border-4 border-dashed border-gray-100 shadow-inner">
          <p className="text-gray-300 italic font-black uppercase tracking-[0.2em] text-sm">Data sekolah belum tersedia</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schools.map((school: any) => {
            const schoolSlug = school.slug || school.npsn;
            
            return (
              <div key={school._id} className="group relative flex flex-col h-full">
                
                {/* 1. KONTEN UTAMA (Link ke Profil) */}
                <Link 
                  href={`/sekolah/${schoolSlug}`}
                  className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex-1 flex flex-col"
                >
                  <div className="relative h-56 w-full bg-slate-200 overflow-hidden">
                    {school.image ? (
                      <Image 
                        src={urlFor(school.image).width(600).url()} 
                        alt={school.name} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-[#002040] text-white/10">
                        <School size={80} />
                      </div>
                    )}
                    
                    <div className="absolute top-5 left-5">
                      <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase shadow-xl backdrop-blur-md ${
                        school.status === 'Negeri' ? 'bg-green-500/90 text-white' : 'bg-orange-500/90 text-white'
                      }`}>
                        {school.status || 'Negeri'}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col flex-1">
                    <div className="mb-6">
                      <span className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-2 block">
                        {school.level || 'Sekolah Dasar'}
                      </span>
                      <h3 className="text-xl md:text-2xl font-black text-[#002040] leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tighter line-clamp-2">
                        {school.name}
                      </h3>
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100 shadow-inner">
                        <span className="font-black text-slate-400 uppercase tracking-tighter">NPSN:</span>
                        <span className="font-mono text-blue-700 font-bold tracking-widest">{school.npsn || '-'}</span>
                      </div>
                      <div className="flex items-start gap-3 text-xs text-slate-400 min-h-[40px]">
                        <MapPin size={16} className="text-red-500 shrink-0" />
                        <p className="line-clamp-2 leading-relaxed font-medium italic">
                            {school.address || 'Alamat belum diatur.'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                       <div className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-center group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center gap-2 shadow-sm group-hover:shadow-blue-200">
                          Profil Sekolah <ArrowRight size={14} />
                       </div>
                       <div className="w-16 h-4"></div>
                    </div>
                  </div>
                </Link>

                {/* 2. TOMBOL MAPS (FIX: Hapus onClick agar tidak error di Server Component) */}
                {school.mapsUrl && (
                  <a 
                    href={school.mapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute bottom-8 right-8 w-14 h-14 bg-white text-slate-400 rounded-2xl flex items-center justify-center hover:bg-slate-900 hover:text-white transition-all shadow-lg hover:shadow-2xl z-20 border border-slate-50"
                    title="Buka Lokasi di Google Maps"
                  >
                    <Map size={20} />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-20 text-center">
        <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.4em]">
            Total {schools?.length || 0} Satuan Pendidikan Terdaftar
        </p>
      </div>
    </main>
  );
}