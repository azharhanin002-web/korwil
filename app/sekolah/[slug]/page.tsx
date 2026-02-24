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
  Map,
  School as SchoolIcon 
} from "lucide-react";

export const revalidate = 0;

// --- 1. FUNGSI GENERATE METADATA DINAMIS (Fix: Pakai Slug) ---
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  // Cari berdasarkan slug.current
  const school = await client.fetch(
    `*[_type == "school" && slug.current == $slug][0]`, 
    { slug }
  );

  if (!school) return { title: "Sekolah Tidak Ditemukan" };

  const imageUrl = school.image ? urlFor(school.image).url() : "/og-image.jpg";

  return {
    title: `Profil ${school.name} | Korwilcam Purwokerto Barat`,
    description: `Profil resmi ${school.name}. NPSN: ${school.npsn}. Lihat visi, misi, dan informasi lengkap lainnya.`,
    openGraph: {
      title: `Profil ${school.name}`,
      images: [{ url: imageUrl }],
    }
  };
}

// --- 2. KONFIGURASI PORTABLE TEXT ---
const ptComponents = {
  block: {
    normal: ({ children }: any) => <p className="mb-4 text-slate-600 leading-relaxed text-lg">{children}</p>,
    h3: ({ children }: any) => <h3 className="text-xl font-black text-slate-800 mt-6 mb-2 uppercase tracking-tight">{children}</h3>,
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc ml-6 mb-6 space-y-2 text-slate-600 font-medium">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal ml-6 mb-6 space-y-2 text-slate-600 font-medium">{children}</ol>,
  },
};

// --- 3. KOMPONEN UTAMA HALAMAN ---
export default async function SchoolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // FIX: Query mengambil data sekolah berdasarkan slug.current
  const school = await client.fetch(
    `*[_type == "school" && slug.current == $slug][0]`, 
    { slug }
  );

  if (!school) {
    return (
      <div className="py-40 text-center font-sans">
        <h1 className="text-3xl font-black text-slate-200 uppercase tracking-widest mb-6">Sekolah Tidak Ditemukan</h1>
        <Link href="/sekolah" className="bg-blue-600 text-white px-8 py-3 rounded-full font-black shadow-lg hover:bg-blue-700 transition-all uppercase text-xs tracking-widest">
          Kembali ke Daftar Sekolah
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans">
      {/* HEADER HERO */}
      <div className="relative bg-[#002040] text-white pt-24 pb-36 px-4 overflow-hidden">
        {/* Dekorasi Latar */}
        <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none transform translate-x-20 -translate-y-10">
            <SchoolIcon size={400} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-10">
          {/* Logo Sekolah */}
          <div className="relative w-40 h-40 md:w-48 md:h-48 bg-white rounded-[2.5rem] p-6 shadow-2xl flex-shrink-0 border-[6px] border-blue-400/30 backdrop-blur-sm">
            {school.logo ? (
              <Image src={urlFor(school.logo).url()} alt={school.name} fill className="object-contain p-6" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-100">
                 <SchoolIcon size={80} />
              </div>
            )}
          </div>
          
          <div className="text-center md:text-left flex-1">
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
              <span className="bg-blue-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-blue-900/20">
                {school.level || "Sekolah Dasar"}
              </span>
              <span className="bg-yellow-500 text-[#002040] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-yellow-900/20">
                {school.status || "Negeri"}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4 leading-[1.1] drop-shadow-xl">
              {school.name}
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-3 text-blue-200 font-bold uppercase tracking-widest text-[11px]">
              <MapPin size={18} className="text-yellow-400" /> {school.address || "Alamat belum tersedia"}
            </div>
          </div>
        </div>
      </div>

      {/* KONTEN UTAMA */}
      <main className="max-w-6xl mx-auto px-4 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* KOLOM KIRI: FOTO & VISI MISI */}
          <div className="lg:col-span-2 space-y-10">
            {/* Foto Gedung */}
            <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border-[8px] border-white ring-1 ring-slate-200">
              {school.image ? (
                <div className="relative aspect-video">
                  <Image src={urlFor(school.image).url()} alt="Gedung Sekolah" fill className="object-cover" priority />
                </div>
              ) : (
                <div className="aspect-video bg-slate-200 flex flex-col items-center justify-center text-slate-400 gap-4">
                   <SchoolIcon size={64} className="opacity-20" />
                   <span className="font-black uppercase tracking-widest text-xs">Dokumentasi Belum Tersedia</span>
                </div>
              )}
            </div>

            {/* Profil Singkat */}
            <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-sm border border-slate-100">
              <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-8 flex items-center gap-4">
                <span className="w-3 h-10 bg-blue-600 rounded-full shadow-lg shadow-blue-200"></span> 
                Profil Sekolah
              </h2>
              <div className="text-slate-600 leading-relaxed text-lg whitespace-pre-line font-medium">
                {school.shortProfile || "Selamat datang di portal resmi informasi sekolah kami."}
              </div>
            </div>

            {/* Visi & Misi */}
            <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-sm border border-slate-100">
              <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter mb-8 flex items-center gap-4">
                <span className="w-3 h-10 bg-yellow-500 rounded-full shadow-lg shadow-yellow-200"></span> 
                Visi & Misi
              </h2>
              <div className="prose prose-slate max-w-none">
                {school.visionMission ? (
                  <PortableText value={school.visionMission} components={ptComponents} />
                ) : (
                  <p className="italic text-slate-400 py-10 text-center border-2 border-dashed border-slate-50 rounded-3xl uppercase font-black text-xs tracking-widest">
                    Data visi dan misi sedang dalam proses pembaruan
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: SIDEBAR INFO */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100 sticky top-24 ring-1 ring-slate-50">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-10 text-center border-b border-slate-50 pb-6">
                Informasi Cepat
              </h3>
              
              <div className="space-y-8">
                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                    <Fingerprint size={24}/>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">NPSN Resmi</p>
                    <p className="font-black text-slate-800 text-lg tracking-tight">{school.npsn || "-"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 shrink-0 group-hover:bg-green-600 group-hover:text-white transition-all duration-500 shadow-inner">
                    <Award size={24}/>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Akreditasi</p>
                    <p className="font-black text-slate-800 text-lg tracking-tight">Peringkat {school.accreditation || "B"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500 shadow-inner">
                    <User size={24}/>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Kepala Sekolah</p>
                    <p className="font-black text-slate-800 leading-tight">{school.headmaster || "-"}</p>
                  </div>
                </div>
              </div>

              <div className="my-10 h-px bg-gradient-to-r from-transparent via-slate-100 to-transparent" />

              <div className="space-y-4">
                {school.mapsUrl && (
                  <a href={school.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 w-full bg-[#002040] text-white py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-blue-900/10 active:scale-95">
                    <Map size={18} /> Petunjuk Lokasi
                  </a>
                )}
                <Link href="/sekolah" className="flex items-center justify-center gap-3 w-full bg-slate-50 text-slate-400 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-slate-200 hover:text-slate-600 transition-all">
                  <ArrowLeft size={18} /> Daftar Sekolah
                </Link>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}