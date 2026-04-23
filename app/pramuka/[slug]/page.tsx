import { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { postDetailQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import SupabaseComments from "@/components/SupabaseComments";
import ViewCounter from "@/components/ViewCounter";
import Image from "next/image";
import Link from "next/link";
import { 
  Calendar, 
  Eye, 
  ArrowLeft, 
  User, 
  PlayCircle, 
  List, 
  TrendingUp, 
  Flame,
  Award,
  ChevronRight,
  Trophy,
  Home,
  MessageSquare
} from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import YouTubePlayer from "@/components/YouTubePlayer";
import { getYoutubeThumb } from "@/lib/youtube";

// Paksa data selalu fresh agar views dan komentar langsung muncul
export const revalidate = 0;
export const dynamic = 'force-dynamic';

// --- 1. HELPER: TOC (Daftar Isi Otomatis) ---
function getTOC(body: any[]) {
  if (!body) return [];
  return body
    .filter((block: any) => block._type === "block" && block.style === "h2")
    .map((block: any) => {
      const text = block.children.map((child: any) => child.text).join("");
      return { 
        text, 
        id: text.toLowerCase().replace(/\s+/g, "-") 
      };
    });
}

// --- 2. GENERATE METADATA ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0]`, { slug });
  if (!post) return { title: "Kegiatan Tidak Ditemukan" };
  const imageUrl = post.mainImage?.asset ? urlFor(post.mainImage).width(1200).url() : "/og-image.jpg";
  return {
    title: `${post.title} | Warta Pramuka`,
    openGraph: { title: post.title, images: [{ url: imageUrl }] },
  };
}

// --- 3. KONFIGURASI PORTABLE TEXT ---
const ptComponents = {
  types: {
    youtube: YouTubePlayer,
    image: ({ value }: any) => {
      if (!value?.asset) return null;
      return (
        <div className="my-10 overflow-hidden rounded-xl border-4 border-white shadow-xl ring-1 ring-orange-100 bg-slate-50">
          <Image 
            src={urlFor(value).url()} 
            alt="Gambar Artikel" 
            width={800} 
            height={500} 
            className="w-full object-cover" 
          />
          {value.caption && <p className="bg-orange-50 py-3 text-center text-[10px] font-black uppercase tracking-widest text-orange-600">{value.caption}</p>}
        </div>
      );
    },
  },
  block: {
    h2: ({ children }: any) => {
      const id = children[0].toString().toLowerCase().replace(/\s+/g, "-");
      return <h2 id={id} className="text-2xl font-black mt-12 mb-5 text-[#5D4037] uppercase border-l-4 border-orange-500 pl-4 tracking-tight scroll-mt-28">{children}</h2>;
    },
    normal: ({ children }: any) => <p className="mb-6 leading-relaxed text-slate-700 text-lg">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-[#5D4037] pl-6 italic my-10 text-[#5D4037] bg-orange-50/50 py-8 rounded-r-xl shadow-inner font-medium text-xl font-serif">"{children}"</blockquote>
    ),
  },
};

export default async function PramukaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const now = new Date();
  const monthName = now.toLocaleDateString('id-ID', { month: 'long' }).toUpperCase();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // useCdn: false agar hitung views akurat
  const post = await client.fetch(postDetailQuery, { slug, monthStart }, { useCdn: false });

  if (!post) return <div className="py-40 text-center font-black uppercase text-slate-300 italic">Data Tidak Ditemukan</div>;

  const currentUrl = `https://korwilbarat.web.id/pramuka/${slug}`;
  const isVideo = post.category === "Video";
  const toc = getTOC(post.body || []);

  return (
    <main className="min-h-screen bg-white pb-24 font-sans pt-12 md:pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* --- NAVIGASI --- */}
        <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 overflow-hidden whitespace-nowrap">
          <Link href="/" className="hover:text-orange-600 transition-colors flex items-center gap-1"><Home size={12} /> Beranda</Link>
          <ChevronRight size={10} />
          <Link href="/pramuka" className="hover:text-orange-600 transition-colors">Pramuka</Link>
          <ChevronRight size={10} />
          <span className="text-slate-600 truncate max-w-[200px] md:max-w-none">{post.title}</span>
        </nav>

        {/* View Counter dipanggil di level atas agar urutan DOM konsisten */}
        <ViewCounter id={post._id} />

        {/* HEADER SECTION */}
        <header className="mb-12 max-w-4xl mx-auto md:mx-0">
          <div className="flex justify-start mb-6">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-[10px] font-black px-4 py-1.5 rounded-lg uppercase tracking-[0.2em] shadow-lg border border-orange-200">
              <span className="animate-bounce text-xs">⚜️</span> Warta Pramuka
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-[#3E2723] leading-[1.1] mb-8 uppercase tracking-tighter italic">{post.title}</h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-100 py-6">
            <div className="flex items-center gap-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-2"><User size={14} className="text-orange-600" /><span>Admin Kwarran</span></div>
              <div suppressHydrationWarning className="flex items-center gap-2">
                <Calendar size={14} className="text-orange-600" />
                <span>{new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-orange-50 px-5 py-2.5 rounded-full border border-orange-100 shadow-sm">
              <Eye size={16} className="text-orange-600" />
              <span suppressHydrationWarning className="text-sm font-black text-[#5D4037]">
                {post.views || 0} <span className="text-[10px] text-slate-400 ml-1 uppercase font-bold">Dilihat</span>
              </span>
            </div>
          </div>
        </header>

        {/* --- GRID UTAMA (Sticky Sidebar) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* KOLOM KIRI (KONTEN) */}
          <div className="lg:col-span-8 w-full">
            {post.mainImage?.asset && (
              <div className="mb-10 relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl border-[6px] border-white ring-1 ring-slate-100 bg-slate-50">
                 <Image 
                    src={urlFor(post.mainImage).url()} 
                    alt={post.title} 
                    fill 
                    className="object-cover" 
                    priority 
                    sizes="(max-width: 768px) 100vw, 800px" 
                 />
                 {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="bg-white/20 backdrop-blur-md p-5 rounded-full border border-white/30">
                          <PlayCircle size={64} className="text-white drop-shadow-2xl" />
                        </div>
                    </div>
                  )}
              </div>
            )}

            <div className="prose prose-lg max-w-none prose-slate bg-white px-2">
              <PortableText value={post.body} components={ptComponents} />
            </div>

            {/* AREA DISKUSI DAN SHARE */}
            <div className="mt-16 pt-10 border-t border-slate-100 space-y-12">
               <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 italic">Bagikan Kegiatan:</h4>
                  <ShareButtons url={currentUrl} title={post.title} />
               </div>
               <SupabaseComments postId={post.slug.current} />
            </div>
          </div>

          {/* SIDEBAR KANAN */}
          <aside className="lg:col-span-4 w-full h-fit sticky top-28 space-y-10">
            
            {/* WIDGET 1: TOC (Daftar Isi) */}
            {toc.length > 0 && (
              <div className="bg-slate-50 p-7 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-orange-100 pb-4">
                  <List size={18} className="text-orange-600" />
                  <h4 className="font-black text-[#5D4037] uppercase tracking-tighter text-sm italic">Isi Kegiatan</h4>
                </div>
                <nav className="space-y-3">
                  {toc.map((item: any, idx: number) => (
                    <Link key={idx} href={`#${item.id}`} className="group flex items-center gap-2 text-[13px] font-bold transition-all hover:text-orange-600 leading-tight text-slate-600">
                      <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 text-blue-500 transition-all -ml-4 group-hover:ml-0" />
                      {item.text}
                    </Link>
                  ))}
                </nav>
              </div>
            )}

            {/* WIDGET 2: SEKOLAH TERAKTIF (PRESISI GAMBAR F9C129) */}
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative">
              <div className="bg-gradient-to-r from-[#5D4037] to-[#3E2723] p-6 flex justify-between items-center text-white">
                <div className="flex items-center gap-3">
                  <TrendingUp size={20} className="text-orange-300" />
                  <h4 className="font-black uppercase tracking-tighter text-sm italic">TERAKTIF {monthName}</h4>
                </div>
                <div className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 px-4 py-1.5 rounded-full shadow-lg border border-yellow-200 flex items-center gap-2 animate-pulse">
                  <Trophy size={12} className="text-amber-950" /> <span className="text-[10px] font-black text-amber-950">TRENDING</span>
                </div>
              </div>
              <div className="p-4 space-y-4">
                {post.trendingSchools?.map((school: any, idx: number) => (
                  <Link key={school._id} href={`/sekolah/${school.slug}`} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-1 group-hover:border-orange-500 transition-all overflow-hidden">
                          {school.logo ? <img src={urlFor(school.logo).url()} className="w-full h-full object-contain" alt={school.name} /> : <User size={16}/>}
                        </div>
                        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg border-2 border-white ${idx === 0 ? 'bg-yellow-500' : 'bg-[#5D4037]'}`}>{idx + 1}</div>
                      </div>
                      <span className="text-[11px] font-black uppercase text-slate-800 line-clamp-1">{school.name}</span>
                    </div>
                    <div className="bg-white border border-slate-100 px-3 py-1.5 rounded-xl text-center min-w-[55px] group-hover:bg-orange-600 group-hover:text-white transition-all transform group-hover:scale-105">
                      <span className="block text-sm font-black group-hover:text-white transition-colors">{school.mentionCount || 0}</span>
                      <span className="text-[7px] font-bold uppercase group-hover:text-orange-100 transition-colors">WARTA</span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="p-5 bg-slate-50 border-t border-slate-100 flex flex-col items-center">
                 <div className="bg-white px-4 py-1 rounded-full border border-blue-100 text-[8px] font-black text-orange-500 uppercase tracking-[0.2em] shadow-sm mb-2 italic">LIVE STATUS</div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic text-center leading-relaxed">DATA UPDATE PERIODE {monthName} 2026</p>
              </div>
            </div>

            {/* WIDGET 3: POSTINGAN TERPOPULER */}
            <div className="bg-white p-7 rounded-xl border border-slate-100 shadow-md">
              <div className="flex items-center gap-3 mb-6 border-b border-orange-50 pb-4">
                <Flame size={20} className="text-orange-500" />
                <h4 className="font-black text-slate-800 uppercase tracking-tighter text-sm italic">Berita Paling Hot</h4>
              </div>
              <div className="space-y-6">
                {post.popularPosts?.map((pop: any) => (
                  <Link key={pop._id} href={`/berita/${pop.slug}`} className="flex gap-4 group">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 relative shadow-sm border border-slate-50 transform group-hover:scale-95 transition-all">
                      <img src={pop.category === 'Video' ? getYoutubeThumb(pop.videoUrl) : (pop.mainImage?.asset ? urlFor(pop.mainImage).url() : "/og-image.jpg")} className="w-full h-full object-cover group-hover:scale-125 transition-all duration-700" alt={pop.title} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h5 className="text-[11px] font-extrabold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors uppercase line-clamp-2">{pop.title}</h5>
                      <div suppressHydrationWarning className="flex items-center gap-1 mt-1 bg-orange-50 w-fit px-2 py-0.5 rounded-full"><Eye size={10} className="text-orange-500" /><span className="text-[9px] font-black text-orange-600">{pop.views || 0}</span></div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* --- FITUR 4: RELATED POSTS (KEGIATAN TERKAIT) --- */}
        <div className="mt-32 border-t border-slate-100 pt-16">
          <h3 className="text-2xl font-black text-[#3E2723] uppercase tracking-tighter mb-10 italic">Kegiatan Terkait</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {post.related?.map((rel: any) => (
              <Link href={`/pramuka/${rel.slug}`} key={rel._id} className="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="relative aspect-video overflow-hidden">
                   <img src={rel.category === 'Video' ? getYoutubeThumb(rel.videoUrl) : (rel.mainImage?.asset ? urlFor(rel.mainImage).url() : "/og-image.jpg")} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={rel.title} />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="text-[9px] font-black text-orange-600 uppercase mb-2 tracking-widest">{rel.category || "Pramuka"}</div>
                  <h4 className="text-[13px] font-black text-slate-800 group-hover:text-orange-600 uppercase leading-snug line-clamp-2 transition-colors">{rel.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* TOMBOL KEMBALI */}
        <div className="mt-24 flex justify-center pb-20">
          <Link href="/pramuka" className="group flex items-center gap-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-[#5D4037] transition-all">
            <div className="bg-slate-50 group-hover:bg-[#5D4037] group-hover:text-white p-5 rounded-full shadow-sm border border-slate-100 transition-all active:scale-90"><ArrowLeft size={20} /></div>
            KEMBALI KE PRAMUKA
          </Link>
        </div>
      </div>
    </main>
  );
}