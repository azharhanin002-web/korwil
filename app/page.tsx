import React from 'react';
import Link from 'next/link';
// --- PERBAIKAN: Menambahkan Eye ke dalam list import ---
import { Newspaper, NotebookPen, GraduationCap, Tent, ArrowRight, Eye } from 'lucide-react';

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
} from '../lib/sanity/queries';

export const revalidate = 60;

async function getData() {
  const [sliderData, mainNews, sideNews, allArticles, artikelGuru, pgriData, pramukaData] = await Promise.all([
    client.fetch(sliderQuery),
    client.fetch(mainNewsQuery),
    client.fetch(sideNewsQuery),
    client.fetch(allArticlesQuery),
    // Mengambil Artikel Guru (Filter Kategori)
    client.fetch(`*[_type == "post" && category == "Artikel Guru"] | order(publishedAt desc)[0...4]`),
    // Mengambil Kabar PGRI
    client.fetch(`*[_type == "post" && category == "PGRI"] | order(publishedAt desc)[0...4]`),
    // Mengambil Kepramukaan
    client.fetch(`*[_type == "post" && category == "Kepramukaan"] | order(publishedAt desc)[0...4]`),
  ]);

  return { sliderData, mainNews, sideNews, allArticles, artikelGuru, pgriData, pramukaData };
}

export default async function Home() {
  const { sliderData, mainNews, sideNews, allArticles, artikelGuru, pgriData, pramukaData } = await getData();

  const getSlug = (item: any) => {
    if (typeof item.slug === 'string') return item.slug;
    return item.slug?.current || '';
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50 text-gray-900 font-sans">
      
      {/* 1. SLIDER HEADLINE */}
      <HeroSlider data={sliderData} />

      <main className="container mx-auto px-4 py-10 max-w-7xl">
        
        {/* === SECTION 1: BERITA TERKINI === */}
        <div className="flex items-center justify-between mb-8">
           <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg shadow-blue-200">
                <Newspaper size={20}/>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tighter">Berita Terkini</h2>
           </div>
           <Link href="/berita" className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-widest flex items-center gap-1 transition-all">
              Lihat Semua <ArrowRight size={14} />
           </Link>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
           {/* BERITA UTAMA */}
           {mainNews && (
             <Link href={`/berita/${getSlug(mainNews)}`} className="lg:col-span-2 group">
                <div className="relative overflow-hidden rounded-[2rem] mb-6 aspect-video shadow-2xl border-4 border-white bg-slate-100">
                   {mainNews.mainImage ? (
                     <img 
                       src={urlFor(mainNews.mainImage).url()} 
                       alt={mainNews.title} 
                       className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700" 
                     />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-300 font-bold uppercase text-xs">Korwilcam Dindik</div>
                   )}
                   <div className="absolute top-6 left-6">
                     <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase shadow-xl tracking-widest">UTAMA</span>
                   </div>
                </div>
                <h3 className="text-2xl md:text-4xl font-extrabold text-slate-800 mb-4 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tighter">
                  {mainNews.title}
                </h3>
                <div className="flex items-center text-[11px] font-bold text-slate-400 gap-4 uppercase tracking-widest">
                   <span className="text-blue-600">{mainNews.category || 'Berita'}</span>
                   <span>•</span>
                   <span suppressHydrationWarning>{new Date(mainNews.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                   <span>•</span>
                   <span>{mainNews.views || 0} hits</span>
                </div>
             </Link>
           )}

           {/* BERITA SAMPING */}
           <div className="flex flex-col gap-6">
              {sideNews?.map((item: any) => (
                <Link href={`/berita/${getSlug(item)}`} key={item._id} className="flex gap-4 group items-center pb-6 border-b border-slate-100 last:border-0">
                   <div className="relative overflow-hidden rounded-2xl w-28 h-20 flex-shrink-0 shadow-sm bg-slate-100">
                      {item.mainImage && <img src={urlFor(item.mainImage).url()} alt={item.title} className="object-cover w-full h-full group-hover:scale-110 transition-all" />}
                   </div>
                   <div className="flex-1">
                      <h4 className="text-[13px] font-bold text-slate-800 leading-snug group-hover:text-blue-600 line-clamp-2 uppercase tracking-tight">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-widest">{new Date(item.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                   </div>
                </Link>
              ))}
           </div>
        </section>

        {/* === SECTION 2: ARTIKEL GURU (Widget Biru) === */}
        <section className="mb-20">
           <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-[2.5rem] p-8 md:p-10 flex flex-col lg:flex-row items-center gap-10 shadow-2xl shadow-blue-900/20">
              <div className="lg:w-48 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-white/10 pb-8 lg:pb-0 lg:pr-10">
                 <h3 className="text-white text-3xl font-black uppercase leading-[0.9] tracking-tighter">
                    ARTIKEL <br/><span className="text-blue-300">GURU</span>
                 </h3>
                 <p className="text-blue-100 text-[10px] mt-4 font-bold uppercase tracking-[0.2em] opacity-60">Wawasan Pendidik</p>
              </div>

              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                 {artikelGuru?.map((item: any) => (
                   <Link href={`/berita/${getSlug(item)}`} key={item._id} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white hover:translate-y-[-5px] transition-all duration-500 group">
                      <div className="w-10 h-10 bg-blue-500 group-hover:bg-blue-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg transition-colors">
                         <NotebookPen size={20} />
                      </div>
                      <h5 className="text-[12px] font-bold text-white group-hover:text-slate-800 leading-tight line-clamp-3 uppercase tracking-tight transition-colors">
                         {item.title}
                      </h5>
                   </Link>
                 ))}
              </div>
           </div>
        </section>

        {/* === SECTION 3: PGRI & KEPRAMUKAAN === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* BLOK PGRI */}
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                 <div className="flex items-center gap-3">
                    <div className="bg-red-600 p-2 rounded-lg text-white shadow-lg shadow-red-200"><GraduationCap size={20}/></div>
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Kabar PGRI</h2>
                 </div>
                 <Link href="/pgri" className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em]">Lihat Semua</Link>
              </div>
              <div className="space-y-4">
                {pgriData?.map((item: any) => (
                  <Link href={`/pgri/${getSlug(item)}`} key={item._id} className="group flex gap-4 bg-white p-4 rounded-2xl hover:shadow-xl transition-all border border-slate-50">
                    <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-50">
                      {item.mainImage && <img src={urlFor(item.mainImage).url()} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 leading-tight group-hover:text-red-600 line-clamp-2 uppercase mb-2">{item.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(item.publishedAt).toLocaleDateString('id-ID')}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* BLOK KEPRAMUKAAN */}
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                 <div className="flex items-center gap-3">
                    <div className="bg-orange-600 p-2 rounded-lg text-white shadow-lg shadow-orange-200"><Tent size={20}/></div>
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Kepramukaan</h2>
                 </div>
                 <Link href="/pramuka" className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">Lihat Semua</Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {pramukaData?.map((item: any) => (
                  <Link href={`/pramuka/${getSlug(item)}`} key={item._id} className="group relative rounded-2xl overflow-hidden aspect-square shadow-md">
                    {item.mainImage && <img src={urlFor(item.mainImage).url()} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723] via-transparent to-transparent opacity-90"></div>
                    <div className="absolute bottom-0 p-4">
                      <h4 className="text-[11px] font-bold text-white leading-tight uppercase line-clamp-2">{item.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
        </div>

        {/* === SECTION 4: POSTINGAN TERBARU === */}
        <section className="pb-20">
          <div className="flex items-center gap-3 mb-10">
             <div className="bg-slate-800 p-2 rounded-lg text-white shadow-xl shadow-slate-200"><Newspaper size={20}/></div>
             <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tighter">Postingan Terbaru</h2>
             <div className="h-[2px] bg-slate-100 flex-grow mt-1 ml-4"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {allArticles?.map((item: any) => (
              <Link href={`/berita/${getSlug(item)}`} key={item._id} className="group flex flex-col h-full bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 overflow-hidden">
                <div className="relative overflow-hidden h-48 bg-slate-50">
                   {item.mainImage && <img src={urlFor(item.mainImage).url()} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />}
                   <div className="absolute top-4 left-4">
                     <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[9px] font-black px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-widest">
                       {item.category || 'Umum'}
                     </span>
                   </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                   <h4 className="font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-6 text-[14px] uppercase tracking-tight">
                      {item.title}
                   </h4>
                   <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>{new Date(item.publishedAt).toLocaleDateString('id-ID')}</span>
                      <div className="flex items-center gap-1"><Eye size={12}/> {item.views || 0}</div>
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