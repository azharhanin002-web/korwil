import { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { 
  GraduationCap, 
  MapPin, 
  User, 
  Award, 
  Fingerprint, 
  ArrowLeft, 
  Globe, 
  Map 
} from "lucide-react";

// FUNGSI METADATA DINAMIS
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const school = await client.fetch(`*[_type == "school" && npsn == $slug][0]`, { slug });

  if (!school) return { title: "Sekolah Tidak Ditemukan" };

  return {
    title: `Profil ${school.name}`,
    description: `Profil resmi ${school.name} - NPSN: ${school.npsn}. Lihat visi, misi, dan informasi lengkap lainnya.`,
  };
}

// KOMPONEN PORTABLE TEXT UNTUK VISI MISI
const ptComponents = {
  block: {
    normal: ({ children }: any) => <p className="mb-4 text-slate-600 leading-relaxed">{children}</p>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc ml-6 mb-6 space-y-2 text-slate-600">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal ml-6 mb-6 space-y-2 text-slate-600">{children}</ol>,
  },
};

export default async function SchoolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Query mengambil data sekolah berdasarkan NPSN atau Slug
  const school = await client.fetch(`*[_type == "school" && npsn == $slug][0]`, { slug });

  if (!school) {
    return (
      <div className="py-40 text-center">
        <h1 className="text-2xl font-bold text-slate-300">Data Sekolah Tidak Ditemukan</h1>
        <Link href="/sekolah" className="text-blue-600 font-bold mt-4 inline-block">Kembali ke Daftar Sekolah</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* 1. HEADER HERO */}
      <div className="bg-[#002040] text-white pt-20 pb-32 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8">
          {/* Logo Sekolah */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 bg-white rounded-3xl p-4 shadow-2xl flex-shrink-0 border-4 border-blue-400">
            {school.logo ? (
              <Image src={urlFor(school.logo).url()} alt={school.name} fill className="object-contain p-4" />
            ) : (
              <GraduationCap className="w-full h-full text-slate-200" />
            )}
          </div>
          
          <div className="text-center md:text-left">
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
              <span className="bg-blue-500 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{school.level}</span>
              <span className="bg-yellow-500 text-[#002040] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{school.status}</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter uppercase mb-2">{school.name}</h1>
            <p className="flex items-center justify-center md:justify-start gap-2 text-blue-200 font-medium">
              <MapPin size={16} /> {school.address}
            </p>
          </div>
        </div>
      </div>

      {/* 2. KONTEN UTAMA */}
      <main className="max-w-6xl mx-auto px-4 -mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KOLOM KIRI: DETAIL & VISI MISI */}
          <div className="lg:col-span-2 space-y-8">
            {/* Foto Gedung */}
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white">
              {school.image ? (
                <div className="relative aspect-video">
                  <Image src={urlFor(school.image).url()} alt="Gedung Sekolah" fill className="object-cover" />
                </div>
              ) : (
                <div className="aspect-video bg-slate-200 flex items-center justify-center text-slate-400">Foto Sekolah Belum Tersedia</div>
              )}
            </div>

            {/* Profil Singkat */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-blue-600 rounded-full"></span> Profil Sekolah
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                {school.shortProfile || "Belum ada profil singkat untuk sekolah ini."}
              </p>
            </div>

            {/* Visi & Misi */}
            <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-100">
              <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-6 flex items-center gap-3">
                <span className="w-2 h-8 bg-yellow-500 rounded-full"></span> Visi & Misi
              </h2>
              <div className="prose prose-slate max-w-none">
                {school.visionMission ? (
                  <PortableText value={school.visionMission} components={ptComponents} />
                ) : (
                  <p className="italic text-slate-400">Data visi dan misi belum diisi.</p>
                )}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: SIDEBAR INFO */}
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100 sticky top-24">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Informasi Cepat</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0"><Fingerprint size={20}/></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NPSN</p>
                    <p className="font-bold text-slate-800">{school.npsn}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 shrink-0"><Award size={20}/></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Akreditasi</p>
                    <p className="font-bold text-slate-800">Peringkat {school.accreditation || '-'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 shrink-0"><User size={20}/></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kepala Sekolah</p>
                    <p className="font-bold text-slate-800">{school.headmaster || '-'}</p>
                  </div>
                </div>
              </div>

              <hr className="my-8 border-slate-50" />

              <div className="space-y-3">
                {school.mapsUrl && (
                  <a href={school.mapsUrl} target="_blank" className="flex items-center justify-center gap-2 w-full bg-slate-800 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-all">
                    <Map size={16} /> Petunjuk Lokasi
                  </a>
                )}
                <Link href="/sekolah" className="flex items-center justify-center gap-2 w-full bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-all">
                  <ArrowLeft size={16} /> Daftar Sekolah
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}