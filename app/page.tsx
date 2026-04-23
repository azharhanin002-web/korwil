import React from 'react';
import Link from 'next/link';
import { 
  Newspaper, 
  NotebookPen, 
  GraduationCap, 
  Tent, 
  ArrowRight, 
  Eye, 
  PlayCircle 
} from 'lucide-react';

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

// --- HELPER: AMBIL THUMBNAIL YOUTUBE ---
function getYoutubeThumb(url: string) {
  if (!url) return "/og-image.jpg";
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  const id = (match && match[7].length === 11) ? match[7] : null;
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "/og-image.jpg";
}

// --- HELPER: LOGIKA GAMBAR AMAN ---
function getSafeImage(item: any) {
  if (item.category === "Video" && item.videoUrl) {
    return getYoutubeThumb(item.videoUrl);
  }
  if (item.mainImage?.asset) {
    return urlFor(item.mainImage).url();
  }
  return "/og-image.jpg";
}

async function getData() {
  const [sliderData, mainNews, sideNews, allArticles, artikelGuru, pgriData, pramukaData] = await Promise.all([
    client.fetch(sliderQuery),
    client.fetch(mainNewsQuery),
    client.fetch(sideNewsQuery),
    client.fetch(allArticlesQuery),
    client.fetch(`*[_type == "post" && category == "Artikel Guru"] | order(publishedAt desc)[0...4]{..., "slug": slug.current}`),
    client.fetch(`*[_type == "post" && category == "PGRI"] | order(publishedAt desc)[0...4]{..., "slug": slug.current}`),
    client.fetch(`*[_type == "post" && category == "Kepramukaan"] | order(publishedAt desc)[0...4]{..., "slug": slug.current}`),
  ]);

  return { 
    sliderData: sliderData || [], 
    mainNews: mainNews || null, 
    sideNews: sideNews || [], 
    allArticles: allArticles || [], 
    artikelGuru: artikelGuru || [], 
    pgriData: pgriData || [], 
    pramukaData: pramukaData || [] 
  };
}

export default async function Home() {
  const { sliderData, mainNews, sideNews, allArticles, artikelGuru, pgriData, pramukaData } = await getData();

  const getSlug = (item: any) => {
    if (!item) return '#';
    if (typeof item.slug === 'string') return item.slug;
    return item.slug?.current || '';
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-50/50 text-gray-900 font-sans">
      
      {/* 1. SLIDER HEADLINE */}
      <HeroSlider data={sliderData} />

      <section className="container mx-auto px-4 py-12 max-w-7xl">
        
        {/* === SECTION 1: BERITA TERKINI === */}
        <div className="flex items-center justify-between mb-10">
           <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-100">
                <Newspaper size={24}/>
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tighter">Berita Terkini</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Update harian Korwilcam</p>
              </div>
           </div>
           <Link href="/berita" className="hidden md:flex items-center gap-2 text-xs font-black text-blue-600 uppercase tracking-widest hover:gap-4 transition-all text-nowrap">
             Lihat Semua <ArrowRight size={16} />
           </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-24">
           {/* BERITA UTAMA */}
           {mainNews && (
             <Link href={`/berita/${getSlug(mainNews)}`} className="lg:col-span-2 group">
                <div className="relative overflow-hidden rounded-3xl mb-8 aspect-video shadow-2xl border-[6px] border-white bg-slate-100 ring-1 ring-slate-100">
                   <img src={getSafeImage(mainNews)} alt={mainNews.title} className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-700" />
                   {mainNews.category === "Video" && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-all">
                        <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/30"><PlayCircle size={64} className="text-white drop-shadow-2xl" /></div>
                     </div>
                   )}
                   <div className="absolute top-6 left-6">
                     <span className={`text-[10px] font-black px-4 py-1.5 rounded-lg uppercase shadow-xl tracking-widest ${mainNews.category === 'Video' ? 'bg-red-600' : 'bg-blue-600'} text-white`}>
                        {mainNews.category === 'Video' ? '🎥 VIDEO' : 'UTAMA'}
                     </span>
                   </div>
                </div>
                <h3 className="text-2xl md:text-4xl font-extrabold text-slate-800 mb-6 leading-tight group-hover:text-blue-600 transition-colors uppercase tracking-tighter italic">{mainNews.title}</h3>
                <div className="flex items-center text-[10px] font-bold text-slate-400 gap-4 uppercase tracking-widest">
                   <span className="text-blue-600">{mainNews.category || 'Berita'}</span>
                   <span>•</span>
                   <span suppressHydrationWarning>{mainNews.publishedAt ? new Date(mainNews.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</span>
                   <span>•</span>
                   <span suppressHydrationWarning className="flex items-center gap-1"><Eye size={12}/> {mainNews.views || 0} hits</span>
                </div>
             </Link>
           )}

           {/* BERITA SAMPING */}
           <div className="flex flex-col gap-8">
              {sideNews?.map((item: any) => (
                <Link href={`/berita/${getSlug(item)}`} key={item._id} className="flex gap-5 group items-center pb-8 border-b border-slate-100 last:border-0">
                   <div className="relative overflow-hidden rounded-2xl w-32 h-24 flex-shrink-0 shadow-sm bg-slate-100 ring-1 ring-slate-100">
                      <img src={getSafeImage(item)} alt={item.title} className="object-cover w-full h-full group-hover:scale-110 transition-all" />
                      {item.category === "Video" && <div className="absolute inset-0 flex items-center justify-center bg-black/10"><PlayCircle size={24} className="text-white" /></div>}
                   </div>
                   <div className="flex-1">
                      <h4 className="text-[14px] font-bold text-slate-800 leading-snug group-hover:text-blue-600 line-clamp-2 uppercase tracking-tight">{item.title}</h4>
                      <div suppressHydrationWarning className="text-[10px] text-slate-400 font-bold mt-3 uppercase tracking-widest">
                        {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
                      </div>
                   </div>
                </Link>
              ))}
           </div>
        </div>

        {/* === SECTION 2: ARTIKEL GURU (WARNA ROYAL BLUE SEPERTI GAMBAR) === */}
        <div className="mb-24">
           <div className="bg-[#1a4bbd] rounded-[3rem] p-8 md:p-12 flex flex-col lg:flex-row items-center gap-10 shadow-2xl shadow-blue-900/40">
              <div className="lg:w-64 text-center lg:text-left border-b lg:border-b-0 lg:border-r border-white/20 pb-8 lg:pb-0 lg:pr-10">
                 <h3 className="text-white text-4xl font-black uppercase leading-[0.9] tracking-tighter">ARTIKEL <br/><span className="text-[#89b3ff]">GURU</span></h3>
                 <div className="text-white/60 text-[10px] mt-4 font-bold uppercase tracking-[0.2em]">Wawasan Pendidik</div>
              </div>
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {artikelGuru?.map((item: any) => (
                   <Link href={`/berita/${getSlug(item)}`} key={item._id} className="bg-white/10 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 hover:bg-white hover:scale-105 transition-all duration-500 group">
                      <div className="w-12 h-12 bg-blue-500 group-hover:bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg transition-colors"><NotebookPen size={24} /></div>
                      <h5 className="text-[12px] font-black text-white group-hover:text-slate-900 leading-tight line-clamp-3 uppercase tracking-tight transition-colors">{item.title}</h5>
                   </Link>
                 ))}
              </div>
           </div>
        </div>

        {/* === SECTION 3: PGRI & KEPRAMUKAAN === */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
            {/* BLOK PGRI */}
            <div>
              <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                 <div className="flex items-center gap-3">
                    <div className="bg-red-600 p-2 rounded-lg text-white shadow-lg shadow-red-200"><GraduationCap size={20}/></div>
                    <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Kabar PGRI</h2>
                 </div>
                 <Link href="/berita" className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em]">Lihat Semua</Link>
              </div>
              <div className="space-y-5">
                {pgriData?.map((item: any) => (
                  <Link href={`/berita/${getSlug(item)}`} key={item._id} className="group flex gap-5 bg-white p-4 rounded-2xl hover:shadow-xl transition-all border border-slate-100">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-50">
                      <img src={getSafeImage(item)} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" alt={item.title}/>
                    </div>
                    <div className="flex flex-col justify-center">
                      <h4 className="text-sm font-bold text-slate-800 leading-tight group-hover:text-red-600 line-clamp-2 uppercase mb-2">{item.title}</h4>
                      <div suppressHydrationWarning className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('id-ID') : '-'}
                      </div>
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
                 <Link href="/berita" className="text-[10px] font-black text-orange-600 uppercase tracking-[0.2em]">Lihat Semua</Link>
              </div>
              <div className="grid grid-cols-2 gap-5">
                {pramukaData?.map((item: any) => (
                  <Link href={`/berita/${getSlug(item)}`} key={item._id} className="group relative rounded-2xl overflow-hidden aspect-square shadow-md">
                    <img src={getSafeImage(item)} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={item.title}/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90"></div>
                    <div className="absolute bottom-0 p-4">
                      <h4 className="text-[11px] font-bold text-white leading-tight uppercase line-clamp-2">{item.title}</h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
        </div>

        {/* === SECTION 4: POSTINGAN TERBARU === */}
        <div className="pb-20">
          <div className="flex items-center gap-4 mb-12">
             <div className="bg-slate-800 p-2.5 rounded-xl text-white shadow-xl shadow-slate-200"><Newspaper size={24}/></div>
             <div className="flex-grow flex items-center">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mr-6">Postingan Terbaru</h2>
                <div className="h-[2px] bg-slate-100 flex-grow"></div>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {allArticles?.map((item: any) => (
              <Link href={`/berita/${getSlug(item)}`} key={item._id} className="group flex flex-col h-full bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 overflow-hidden">
                <div className="relative overflow-hidden h-48 bg-slate-50">
                   <img src={getSafeImage(item)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={item.title}/>
                   {item.category === "Video" && <div className="absolute inset-0 flex items-center justify-center bg-black/10"><PlayCircle size={32} className="text-white" /></div>}
                   <div className="absolute top-4 left-4">
                     <span className={`text-white text-[9px] font-black px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-widest ${item.category === 'Video' ? 'bg-red-600' : 'bg-slate-800/80 backdrop-blur-md'}`}>
                       {item.category || 'Umum'}
                     </span>
                   </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                   <h4 className="font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2 mb-6 text-[14px] uppercase tracking-tight">{item.title}</h4>
                   <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                     <span suppressHydrationWarning>{item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('id-ID') : '-'}</span>
                     <div suppressHydrationWarning className="flex items-center gap-1"><Eye size={12}/> {item.views || 0}</div>
                   </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </section>
    </main>
  );
}