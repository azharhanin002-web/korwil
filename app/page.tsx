import React from 'react';
import Link from 'next/link';
import { Newspaper, NotebookPen, Megaphone, BookOpen, Users } from 'lucide-react';

// --- IMPORT KOMPONEN & LIBRARY ---
import HeroSlider from '../components/HeroSlider';
import { client } from '../lib/sanity/client'; 
import { urlFor } from '../lib/sanity/image';

// --- IMPORT QUERY ---
import { 
  sliderQuery, 
  mainNewsQuery, 
  sideNewsQuery, 
  allArticlesQuery, 
  gprDataQuery 
} from '../lib/sanity/queries';

export const revalidate = 60;

async function getData() {
  const [sliderData, mainNews, sideNews, allArticles, gprData] = await Promise.all([
    client.fetch(sliderQuery),
    client.fetch(mainNewsQuery),
    client.fetch(sideNewsQuery),
    client.fetch(allArticlesQuery),
    client.fetch(gprDataQuery),
  ]);

  return { sliderData, mainNews, sideNews, allArticles, gprData };
}

export default async function Home() {
  const { sliderData, mainNews, sideNews, allArticles, gprData } = await getData();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50 text-gray-900 font-sans">
      
      {/* 1. SLIDER */}
      <HeroSlider data={sliderData} />

      <main className="container mx-auto px-4 py-10 max-w-7xl">
        
        {/* === HEADER INFORMASI TERKINI === */}
        <div className="flex items-center gap-3 mb-8">
           <Newspaper className="text-blue-600" size={24}/>
           <h2 className="text-xl md:text-2xl font-bold text-gray-800 whitespace-nowrap">
             Informasi Terkini
           </h2>
           <div className="h-[2px] bg-gray-200 w-full mt-1"></div> 
        </div>

        {/* === GRID BERITA UTAMA & SAMPING === */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
           
           {/* KIRI: BERITA UTAMA */}
           {mainNews && (
             <Link href={`/berita/${mainNews.slug}`} className="lg:col-span-2 group">
                <div className="relative overflow-hidden rounded-2xl mb-4 aspect-video shadow-md bg-gray-200">
                   {mainNews.mainImage ? (
                     <img 
                       src={urlFor(mainNews.mainImage).url()} 
                       alt={mainNews.title} 
                       className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700" 
                     />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                   )}
                   <div className="absolute top-4 left-4">
                     <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase">
                       Utama
                     </span>
                   </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-[#002040] mb-3 leading-tight group-hover:text-blue-700 transition-colors">
                  {mainNews.title}
                </h3>
                <div className="flex items-center text-xs md:text-sm text-gray-500 gap-3 font-medium">
                   <span className="text-orange-600 font-bold uppercase tracking-wider">{mainNews.category || 'Berita'}</span>
                   <span className="text-gray-300">|</span>
                   <span>{new Date(mainNews.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                   <span className="text-gray-300">|</span>
                   <span>{mainNews.views || 0} kali dilihat</span>
                </div>
             </Link>
           )}

           {/* KANAN: LIST 3 BERITA */}
           <div className="flex flex-col gap-5">
              {sideNews?.map((item: any) => (
                <Link href={`/berita/${item.slug}`} key={item._id} className="flex flex-row gap-4 group items-start pb-5 border-b border-gray-100 last:border-0">
                   <div className="relative overflow-hidden rounded-xl w-32 md:w-36 aspect-[4/3] flex-shrink-0 shadow-sm bg-gray-100">
                      {item.mainImage ? (
                        <img 
                          src={urlFor(item.mainImage).url()} 
                          alt={item.title} 
                          className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                      )}
                   </div>
                   <div className="flex-1">
                      <h4 className="text-sm md:text-[15px] font-bold text-[#002040] mb-2 leading-snug group-hover:text-blue-700 transition-colors line-clamp-3">
                         {item.title}
                      </h4>
                      <div className="flex items-center text-[10px] text-gray-500 gap-2 font-medium">
                         <span className="text-orange-500 font-bold uppercase">{item.category || 'Info'}</span>
                         <span className="text-gray-300">|</span>
                         <span>{new Date(item.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                      </div>
                   </div>
                </Link>
              ))}
           </div>
        </section>

        {/* === SECTION KORWIL UPDATES (WIDGET BIRU) === */}
        <section className="mb-16">
           <div className="bg-gradient-to-r from-blue-700 to-blue-500 rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row items-center gap-8 shadow-xl">
              <div className="flex items-center justify-center lg:justify-start w-full lg:w-40 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-white/20 pb-6 lg:pb-0 lg:pr-6">
                 <h3 className="text-white text-3xl font-black uppercase leading-none text-center lg:text-right">
                    KORWIL <br/><span className="text-blue-200">UPDATES</span>
                 </h3>
              </div>

              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                 {gprData?.map((item: any) => (
                   <Link href={`/berita/${item.slug}`} key={item._id} className="bg-white rounded-xl p-4 flex gap-3 shadow-md hover:translate-y-[-4px] transition-all duration-300">
                      <div className="flex-shrink-0 pt-1">
                         <div className="w-10 h-10 bg-purple-700 rounded-full flex items-center justify-center text-white">
                            <NotebookPen size={18} />
                         </div>
                      </div>
                      <div className="flex flex-col justify-between">
                         <h5 className="text-[11px] font-bold text-gray-800 leading-tight line-clamp-3">
                            {item.title}
                         </h5>
                         <span className="text-[10px] font-bold text-blue-600 mt-2 uppercase">{item.category}</span>
                      </div>
                   </Link>
                 ))}
              </div>
           </div>
        </section>

        {/* === ARTIKEL LAINNYA (Grid Bawah) === */}
        <section id="artikel-lainnya" className="pb-10">
          <div className="flex items-center gap-3 mb-6">
             <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <Newspaper size={20}/>
             </div>
             <h2 className="text-xl md:text-2xl font-bold text-gray-800 whitespace-nowrap">Artikel Lainnya</h2>
             <div className="h-[2px] bg-gray-200 w-full mt-1"></div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            <button className="px-6 py-2 rounded-full text-sm font-bold bg-blue-600 text-white shadow-lg shadow-blue-200 transition-transform active:scale-95">
               Semua
            </button>
            {['Berita Dinas', 'Pengumuman', 'Artikel Guru', 'PGRI'].map((cat) => (
              <button key={cat} className="px-6 py-2 rounded-full text-sm font-bold bg-white text-gray-600 border border-gray-200 hover:border-blue-400 hover:text-blue-600 transition-all">
                {cat}
              </button>
            ))}
          </div>

          {/* Grid Kartu Artikel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {allArticles?.map((item: any) => (
              <Link href={`/berita/${item.slug}`} key={item._id} className="group flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
                {/* Gambar */}
                <div className="relative overflow-hidden h-44 bg-gray-100">
                   {item.mainImage ? (
                     <img 
                        src={urlFor(item.mainImage).url()} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                     />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-gray-300">No Image</div>
                   )}
                   <div className="absolute bottom-3 left-3">
                     <span className="bg-white/90 backdrop-blur-sm text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm uppercase">
                       {item.category || 'Umum'}
                     </span>
                   </div>
                </div>
                
                {/* Konten */}
                <div className="p-5 flex flex-col flex-1">
                   <h4 className="font-bold text-[#002040] leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-4 text-[15px]">
                      {item.title}
                   </h4>
                   
                   <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400">
                      <div className="flex items-center gap-1.5">
                        <span>{new Date(item.publishedAt).toLocaleDateString('id-ID')}</span>
                      </div>
                      <span>{item.views || 0} kali dilihat</span>
                   </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </main>
    </div>
  );
}