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
        <div className="absolute top-0 right-0 p-10 opacity-5">
            <School size={200} />
        </div>
        <div className="relative z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                <GraduationCap size={16} /> Direktori Pendidikan
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#002040] mb-4 tracking-tighter uppercase">
                Data Satuan Pendidikan
            </h1>
            <p className="text-gray-500 max-w-2xl font-medium mx-auto md:mx-0">
                Daftar lengkap sekolah di bawah naungan Korwilcam Dindik Purwokerto Barat.
            </p>
        </div>
      </div>

      {/* Grid Data Sekolah */}
      {!schools || schools.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200">
          <p className="text-gray-400 italic font-bold uppercase tracking-widest text-sm">Data sekolah belum tersedia</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schools.map((school: any) => {
            const schoolSlug = school.slug?.current || school.npsn;
            
            return (
              <div key={school._id} className="group relative flex flex-col h-full">
                {/* 1. LINK UTAMA (DETAIL) */}
                <Link 
                  href={`/sekolah/${schoolSlug}`}
                  className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex-1 flex flex-col"
                >
                  <div className="relative h-52 w-full bg-gray-100 overflow-hidden">
                    {school.image ? (
                      <Image src={urlFor(school.image).url()} alt={school.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-[#002040] text-white/20">
                        <School size={64} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase shadow-lg ${school.status === 'Negeri' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'}`}>
                        {school.status || 'Negeri'}
                      </span>
                    </div>
                  </div>

                  <div className="p-7 flex flex-col flex-1">
                    <div className="mb-4">
                      <span className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-1 block">{school.level || 'Sekolah Dasar'}</span>
                      <h3 className="text-xl font-extrabold text-[#002040] leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tight line-clamp-2">
                        {school.name}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-[11px] text-gray-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="font-black text-slate-400 uppercase tracking-tighter">NPSN:</span>
                        <span className="font-mono text-blue-700 font-bold">{school.npsn || '-'}</span>
                      </div>
                      <div className="flex items-start gap-3 text-xs text-gray-500 h-10">
                        <MapPin size={16} className="text-red-500 shrink-0" />
                        <p className="line-clamp-2 leading-relaxed font-medium italic">{school.address || 'Alamat belum diatur.'}</p>
                      </div>
                    </div>

                    <div className="mt-auto pt-6 flex gap-2">
                      <div className="flex-1 py-3 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-center group-hover:bg-blue-600 group-hover:text-white transition-all flex items-center justify-center gap-2">
                        Detail Profil <ArrowRight size={14} />
                      </div>
                      {/* Spacer agar tombol Maps di bawah tidak tertutup */}
                      <div className="w-12 h-12"></div>
                    </div>
                  </div>
                </Link>

                {/* 2. TOMBOL MAPS (DILUAR LINK UTAMA) */}
                {/* Kita taruh di luar Link dan pakai z-20 agar bisa diklik tanpa memicu Link detail */}
                {school.mapsUrl && (
                  <a 
                    href={school.mapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute bottom-7 right-7 w-12 h-12 bg-slate-100 text-slate-400 rounded-xl flex items-center justify-center hover:bg-slate-800 hover:text-white transition-all shadow-sm z-20"
                    title="Lihat di Maps"
                  >
                    <Map size={18} />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-16 text-center text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em]">
        <p>Total: {schools?.length || 0} Satuan Pendidikan</p>
      </div>
    </main>
  );
}