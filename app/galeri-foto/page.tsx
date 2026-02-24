import { client } from "@/lib/sanity/client";
import { galleryQuery } from "@/lib/sanity/queries";
import { ImageIcon, Info } from "lucide-react";
import Image from "next/image";
import GalleryClient from "@/components/GalleryClient";

export const revalidate = 0;

export const metadata = {
  title: "Galeri Kegiatan | Korwilcam Purwokerto Barat",
  description: "Dokumentasi visual kegiatan pendidikan, loma siswa, dan dinas di wilayah Purwokerto Barat.",
};

export default async function GaleriPage() {
  const photos = await client.fetch(galleryQuery);

  return (
    <main className="min-h-screen bg-slate-50 pb-24">
      {/* HERO HEADER */}
      <div className="relative bg-[#002040] text-white pt-24 pb-36 px-4 overflow-hidden mb-[-4rem]">
        <Image 
          src="/dokumen.jpg" // Gunakan background yang sama biar konsisten
          alt="Background Galeri" 
          fill 
          className="object-cover opacity-10 pointer-events-none" 
          priority
        />
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-[#002040] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-xl">
            <ImageIcon size={14} /> Dokumentasi Visual
          </div>
          <h1 className="text-5xl md:text-8xl font-extrabold uppercase tracking-tighter mb-4 drop-shadow-2xl">
            Galeri <span className="text-blue-400">Foto</span>
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto font-medium opacity-80 text-sm md:text-base">
            Merekam jejak langkah pendidikan dan pengabdian di Korwilcam Dindik Purwokerto Barat.
          </p>
        </div>
      </div>

      {/* CLIENT INTERACTIVE GRID */}
      <section className="relative z-20">
        <GalleryClient items={photos || []} />
      </section>

      {/* FOOTER NOTE */}
      <div className="max-w-6xl mx-auto px-4 mt-20 text-center">
         <div className="inline-flex items-center gap-2 text-slate-300 text-[9px] font-black uppercase tracking-[0.3em]">
            <Info size={12} /> Klik foto untuk melihat detail dokumentasi
         </div>
      </div>
    </main>
  );
}