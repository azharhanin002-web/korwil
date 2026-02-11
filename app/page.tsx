import React from 'react';
import Link from 'next/link';
import { Newspaper, NotebookPen, Megaphone, Volume2, BookOpen, Users } from 'lucide-react';

// --- IMPORT KOMPONEN & LIBRARY ---
import HeroSlider from '../components/HeroSlider';
import { client } from '../lib/sanity/client'; 
import { urlFor } from '../lib/sanity/image';

// --- IMPORT QUERY (Agar kodingan lebih bersih) ---
import { 
  sliderQuery, 
  mainNewsQuery, 
  sideNewsQuery, 
  allArticlesQuery, 
  gprDataQuery 
} from '../lib/sanity/queries';

// Revalidate data setiap 60 detik agar selalu update
export const revalidate = 60;

// === 1. FUNGSI PENGAMBIL DATA (CLEAN VERSION) ===
async function getData() {
  // Kita cukup panggil query yang sudah disiapkan di file queries.ts
  const sliderData = await client.fetch(sliderQuery);
  const mainNews = await client.fetch(mainNewsQuery);
  const sideNews = await client.fetch(sideNewsQuery);
  const allArticles = await client.fetch(allArticlesQuery);
  const gprData = await client.fetch(gprDataQuery);

  return { sliderData, mainNews, sideNews, allArticles, gprData };
}

// === 2. KOMPONEN UTAMA HALAMAN ===
export default async function Home() {
  const { sliderData, mainNews, sideNews, allArticles, gprData } = await getData();

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900 font-sans">
      
      {/* 1. SLIDER */}
      <HeroSlider data={sliderData} />

      {/* 2. KONTEN UTAMA */}
      <main className="container mx-auto px-4 py-10 max-w-7xl">
        
        {/* === HEADER INFORMASI TERKINI === */}
        <div className="flex items-center gap-3 mb-8">
           <Newspaper className="text-gray-700" size={24}/>
           <h2 className="text-xl md:text-2xl font-bold text-gray-800 whitespace-nowrap">
             Informasi Terkini
           </h2>
           <div className="h-[2px] bg-gray-300 w-full mt-1"></div> 
        </div>

        {/* === GRID BERITA UTAMA & SAMPING === */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
           
           {/* KIRI: BERITA UTAMA */}
           {mainNews && (
             <div className="lg:col-span-2 group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl mb-4 aspect-video shadow-sm">
                   {mainNews.mainImage ? (
                     <img 
                       src={urlFor(mainNews.mainImage).url()} 
                       alt={mainNews.title} 
                       className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500" 
                     />
                   ) : (
                     <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                   )}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#002040] mb-3 leading-tight group-hover:text-blue-700 transition-colors">
                  {mainNews.title}
                </h3>
                <div className="flex items-center text-xs md:text-sm text-gray-500 gap-2 font-medium mt-2">
                   <span className="text-orange-500 font-bold uppercase tracking-wider">{mainNews.category || 'Berita'}</span>
                   <span className="text-gray-300">|</span>
                   <span>{new Date(mainNews.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                   <span className="text-gray-300">|</span>
                   <span>(dilihat {mainNews.views || 0} kali)</span>
                </div>
             </div>
           )}

           {/* KANAN: LIST 3 BERITA */}
           <div className="flex flex-col gap-5">
              {sideNews?.map((item: any) => (
                <div key={item._id} className="flex flex-row gap-4 group cursor-pointer items-start pb-5 border-b border-gray-100 last:border-0">
                   <div className="relative overflow-hidden rounded-xl w-32 md:w-36 aspect-[4/3] flex-shrink-0 shadow-sm">
                      {item.mainImage ? (
                        <img 
                          src={urlFor(item.mainImage).url()} 
                          alt={item.title} 
                          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">No Image</div>
                      )}
                   </div>
                   <div className="flex-1">
                      <h4 className="text-sm md:text-[15px] font-bold text-[#002040] mb-2 leading-snug group-hover:text-blue-700 transition-colors line-clamp-3">
                         {item.title}
                      </h4>
                      <div className="flex flex-wrap items-center text-[10px] text-gray-500 gap-2 font-medium">
                         <span className="text-orange-500 font-bold uppercase tracking-wide">{item.category || 'Info'}</span>
                         <span className="text-gray-300">|</span>
                         <span>{new Date(item.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </section>


        {/* === SECTION GPR KOMDIGI (WIDGET BIRU) === */}
        <section className="mb-16">
           <div className="bg-[#2E86C1] rounded-xl p-6 md:p-8 flex flex-col lg:flex-row items-center lg:items-stretch gap-8 shadow-lg">
              
              <div className="flex items-center justify-center lg:justify-start w-full lg:w-40 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-white/20 pb-6 lg:pb-0 lg:pr-6">
                 <h3 className="text-white text-3xl font-bold uppercase leading-tight text-center lg:text-right">
                    GPR <br/> KOMDIGI
                 </h3>
              </div>

              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 {gprData?.map((item: any) => (
                   <div key={item._id} className="bg-white rounded-lg p-4 flex gap-3 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex-shrink-0 pt-1">
                         <div className="w-10 h-10 bg-[#4a148c] rounded-full flex items-center justify-center text-white">
                            <NotebookPen size={18} />
                         </div>
                      </div>
                      <div className="flex flex-col justify-between h-full w-full">
                         <div>
                            <p className="text-[10px] text-gray-500 mb-1">
                              {new Date(item.publishedAt).toLocaleString('id-ID')}
                            </p>
                            <h5 className="text-xs font-bold text-gray-800 leading-snug line-clamp-3">
                               {item.title}
                            </h5>
                         </div>
                         <span className="text-xs font-bold text-blue-600 mt-3">{item.category}</span>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </section>


        {/* === ARTIKEL LAINNYA (Grid Bawah) === */}
        <section id="artikel-lainnya">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
             <Newspaper className="text-gray-700" size={24}/>
             <h2 className="text-xl md:text-2xl font-bold text-gray-800 whitespace-nowrap">Artikel Lainnya</h2>
             <div className="h-[2px] bg-gray-300 w-full mt-1"></div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-4 mb-8">
            <Link href="/" className="px-6 py-2.5 rounded-full text-sm font-bold bg-[#368bc5] text-white shadow-md hover:bg-[#2d76a8] transition-colors shadow-blue-200">
               Semua
            </Link>
            <Link href="/kategori/berita" className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-white text-gray-600 border border-gray-200 shadow-sm hover:shadow-md hover:text-[#368bc5] transition-all">
               <Newspaper size={16} className="text-[#368bc5]" />
               Berita Dinas
            </Link>
            <Link href="/kategori/pengumuman" className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-white text-gray-600 border border-gray-200 shadow-sm hover:shadow-md hover:text-[#368bc5] transition-all">
               <Megaphone size={16} className="text-[#368bc5]" />
               Pengumuman
            </Link>
            <Link href="/kategori/artikel" className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-white text-gray-600 border border-gray-200 shadow-sm hover:shadow-md hover:text-[#368bc5] transition-all">
               <BookOpen size={16} className="text-[#368bc5]" />
               Artikel Guru
            </Link>
            <Link href="/kategori/pgri" className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-white text-gray-600 border border-gray-200 shadow-sm hover:shadow-md hover:text-[#368bc5] transition-all">
               <Users size={16} className="text-[#368bc5]" />
               PGRI
            </Link>
          </div>

          {/* Grid Kartu Artikel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allArticles?.map((item: any) => (
              <div key={item._id} className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                {/* Gambar */}
                <div className="relative overflow-hidden h-48 rounded-t-xl bg-gray-200">
                   {item.mainImage ? (
                     <img 
                        src={urlFor(item.mainImage).url()} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                     />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                   )}
                </div>
                
                {/* Konten */}
                <div className="p-5 flex flex-col flex-1">
                   <h4 className="font-bold text-[#002040] leading-snug group-hover:text-blue-600 transition-colors line-clamp-3 mb-4 text-sm md:text-[15px]">
                      {item.title}
                   </h4>
                   
                   {/* Meta Footer */}
                   <div className="mt-auto pt-3 border-t border-gray-50 flex flex-wrap items-center text-[10px] md:text-[11px] text-gray-500 gap-2 font-medium">
                      <span className="text-orange-500 font-bold uppercase">{item.category || 'Umum'}</span>
                      <span className="text-gray-300">|</span>
                      <span>{new Date(item.publishedAt).toLocaleDateString('id-ID')}</span>
                      <span className="text-gray-300">|</span>
                      <span>(dilihat {item.views || 0} kali)</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}