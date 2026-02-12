import { client } from "@/lib/sanity/client";
import { schoolsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import Image from "next/image";
import Link from "next/link";
import { MapPin, School, GraduationCap, Search } from "lucide-react";

export default async function SekolahPage() {
  const schools = await client.fetch(schoolsQuery);

  return (
    <main className="max-w-7xl mx-auto px-4 py-10 min-h-screen bg-gray-50/30">
      {/* Header Halaman */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-10 opacity-5">
            <School size={200} />
        </div>
        <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                <GraduationCap size={16} /> Direktori Pendidikan
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-[#002040] mb-4">
                Data Satuan Pendidikan
            </h1>
            <p className="text-gray-500 max-w-2xl font-medium">
                Daftar lengkap sekolah di bawah naungan Korwilcam Dindik Purwokerto Barat mulai dari jenjang PAUD, TK, hingga Sekolah Dasar.
            </p>
        </div>
      </div>

      {/* Grid Data Sekolah */}
      {schools.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 italic">Data sekolah belum tersedia atau sedang dalam proses sinkronisasi.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {schools.map((school: any) => (
            <div 
              key={school._id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 group"
            >
              {/* Image Section */}
              <div className="relative h-48 w-full bg-gray-100">
                {school.image ? (
                  <Image
                    src={urlFor(school.image).url()}
                    alt={school.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-blue-900 text-white/20">
                    <School size={64} />
                  </div>
                )}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-lg ${
                    school.status === 'Negeri' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                  }`}>
                    {school.status}
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <span className="text-blue-600 text-[10px] font-bold uppercase tracking-tighter">{school.level}</span>
                        <h3 className="text-lg font-black text-[#002040] leading-tight group-hover:text-blue-600 transition-colors">
                        {school.name}
                        </h3>
                    </div>
                </div>

                <div className="space-y-3 mt-4">
                    <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg">
                        <span className="font-bold text-gray-400">NPSN:</span>
                        <span className="font-mono text-blue-700">{school.npsn || '-'}</span>
                    </div>
                    
                    <div className="flex items-start gap-3 text-xs text-gray-500 min-h-[40px]">
                        <MapPin size={16} className="text-red-500 shrink-0" />
                        <p className="line-clamp-2 leading-relaxed italic">{school.address}</p>
                    </div>
                </div>

                {/* Action Button */}
                <div className="mt-6">
                  {school.mapsUrl ? (
                    <Link 
                      href={school.mapsUrl} 
                      target="_blank" 
                      className="flex items-center justify-center gap-2 w-full py-3 bg-[#002040] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/10"
                    >
                      LIHAT LOKASI MAPS
                    </Link>
                  ) : (
                    <div className="py-3 bg-gray-100 text-gray-400 rounded-xl text-center text-[10px] font-bold">
                      LOKASI BELUM TERSEDIA
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="mt-16 text-center text-gray-400 text-xs font-medium">
        <p>Menampilkan {schools.length} satuan pendidikan di wilayah Purwokerto Barat.</p>
        <p className="mt-1 italic">Data diperbarui secara berkala melalui Dapodik.</p>
      </div>
    </main>
  );
}