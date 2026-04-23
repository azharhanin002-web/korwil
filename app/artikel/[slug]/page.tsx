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
  Trophy, 
  TrendingUp, 
  Flame, 
  Award, 
  List, 
  ChevronRight,
  NotebookPen,
  PlayCircle,
  Home,
  Quote
} from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import YouTubePlayer from "@/components/YouTubePlayer";
import { getYoutubeThumb } from "@/lib/youtube";

export const revalidate = 0;
export const dynamic = 'force-dynamic';

// --- 1. HELPER: TOC ---
function getTOC(body: any[]) {
  if (!body) return [];
  return body
    .filter((block: any) => block._type === "block" && (block.style === "h2" || block.style === "h3"))
    .map((block: any) => {
      const text = block.children.map((child: any) => child.text).join("");
      return {
        text: text,
        level: block.style,
        id: text.toLowerCase().replace(/\s+/g, "-"),
      };
    });
}

// --- 2. METADATA DINAMIS ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0]{..., "slug": slug.current}`, { slug });
  if (!post) return { title: "Artikel Tidak Ditemukan" };

  const isVideo = post.category === "Video";
  let imageUrl = "/og-image.jpg";
  if (isVideo && post.videoUrl) {
    imageUrl = getYoutubeThumb(post.videoUrl);
  } else if (post.mainImage?.asset) {
    imageUrl = urlFor(post.mainImage).width(1200).height(630).url();
  }

  return {
    title: `${post.title} | Ruang Literasi Guru`,
    openGraph: {
      title: post.title,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      type: "article",
    },
  };
}

// --- 3. KONFIGURASI PORTABLE TEXT (JEDA PARAGRAF & QUOTE SULTAN) ---
const ptComponents = {
  types: {
    youtube: YouTubePlayer,
    image: ({ value }: any) => {
      if (!value?.asset) return null;
      return (
        <div className="my-12 overflow-hidden rounded-xl border-4 border-white shadow-xl ring-1 ring-blue-50 bg-slate-50">
          <Image 
            src={urlFor(value).url()} 
            alt={value.alt || "Gambar Artikel"} 
            width={800} 
            height={500} 
            className="w-full object-cover" 
          />
          {value.caption && <p className="bg-blue-50 py-4 text-center text-[10px] font-black uppercase tracking-widest text-blue-600 border-t border-blue-100">{value.caption}</p>}
        </div>
      );
    },
  },
  block: {
    h2: ({ children }: any) => {
      const id = children[0].toString().toLowerCase().replace(/\s+/g, "-");
      return <h2 id={id} className="text-2xl font-black mt-16 mb-8 text-blue-900 uppercase border-l-4 border-blue-500 pl-4 tracking-tight scroll-mt-28">{children}</h2>;
    },
    h3: ({ children }: any) => {
      const id = children[0].toString().toLowerCase().replace(/\s+/g, "-");
      return <h3 id={id} className="text-xl font-black mt-12 mb-6 text-slate-800 uppercase tracking-tight scroll-mt-28">{children}</h3>;
    },
    // JEDA ANTAR PARAGRAF MB-10 (40px)
    normal: ({ children }: any) => <p className="mb-10 leading-[1.8] text-slate-700 text-lg last:mb-0">{children}</p>,
    // FITUR QUOTE SULTAN MODERN
    blockquote: ({ children }: any) => (
      <div className="relative my-14 group">
        <div className="absolute -left-2 top-0 bottom-0 w-1.5 bg-blue-600 rounded-full"></div>
        <blockquote className="pl-12 pr-8 py-12 bg-blue-50/40 rounded-r-2xl shadow-inner relative overflow-hidden">
          <Quote className="absolute -top-4 -left-2 w-24 h-24 text-blue-100/60 -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          <p className="relative z-10 italic font-serif text-2xl text-blue-900 leading-relaxed">
            {children}
          </p>
          <div className="mt-6 flex items-center gap-3 relative z-10">
             <div className="w-10 h-px bg-blue-200"></div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 italic">Inspirasi Ruang Literasi</span>
          </div>
        </blockquote>
      </div>
    ),
  },
};

// --- 4. KOMPONEN UTAMA ---
export default async function ArtikelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthName = now.toLocaleDateString('id-ID', { month: 'long' });

  const post = await client.fetch(postDetailQuery, { slug, monthStart }, { useCdn: false });

  if (!post) return <div className="py-40 text-center font-black uppercase text-slate-300 text-3xl italic">Artikel tidak ditemukan.</div>;

  const currentUrl = `https://korwilbarat.web.id/artikel/${slug}`;
  const isVideo = post.category === "Video";
  const toc = getTOC(post.body || []);

  return (
    <main className="min-h-screen bg-white pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-20">
        
        {/* VIEW COUNTER & HYDRATION FIX */}
        <ViewCounter id={post._id} />

        {/* --- NAVIGASI --- */}
        <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10 overflow-hidden whitespace-nowrap">
          <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1"><Home size={12} /> Beranda</Link>
          <ChevronRight size={10} />
          <Link href="/artikel" className="hover:text-blue-600 transition-colors">Artikel</Link>
          <ChevronRight size={10} />
          <span className="text-slate-600 truncate max-w-[200px] md:max-w-none">{post.title}</span>
        </nav>

        {/* HEADER SECTION */}
        <header className="mb-16 max-w-4xl mx-auto md:mx-0">
          <div className="flex justify-start mb-6">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-[10px] font-black px-5 py-2 rounded-lg uppercase tracking-[0.2em] shadow-lg shadow-blue-200/50 border border-blue-200">
              <NotebookPen size={14} className="animate-pulse" />
              Karya Literasi Guru
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.15] mb-10 uppercase tracking-tighter italic">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-between gap-6 border-y border-slate-100 py-8">
            <div className="flex items-center gap-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-2"><User size={14} className="text-blue-600" /><span>Penulis Guru</span></div>
              <div suppressHydrationWarning className="flex items-center gap-2">
                <Calendar size={14} className="text-blue-600" />
                <span>{new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-full border border-slate-100 shadow-sm">
              <Eye size={16} className="text-blue-600" />
              <span suppressHydrationWarning className="text-sm font-black text-blue-900">
                {post.views || 0} <span className="text-[10px] text-blue-400 ml-1 uppercase">Dilihat</span>
              </span>
            </div>
          </div>
        </header>

        {/* --- GRID UTAMA --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* KOLOM KIRI (KONTEN) */}
          <div className="lg:col-span-8 w-full">
            {post.mainImage?.asset && (
              <div className="mb-14 relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl border-[6px] border-white ring-1 ring-slate-100 bg-slate-50">
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

            <div className="mt-20 pt-10 border-t border-slate-100 space-y-16">
               <div className="block w-full">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 italic text-center md:text-left">Bagikan Pengetahuan Ini:</h4>
                  <div className="flex justify-center md:justify-start">
                    <ShareButtons url={currentUrl} title={post.title} />
                  </div>
               </div>

               {/* AREA DISKUSI DENGAN ID JANGKAR AUTO-SCROLL */}
               <div id="diskusikegiatan">
                  <SupabaseComments postId={post.slug.current || post.slug} />
               </div>
            </div>
          </div>

          {/* KOLOM KANAN (SIDEBAR) */}
          <aside className="lg:col-span-4 w-full h-fit sticky top-28 space-y-12">
            
            {/* WIDGET 1: TOC */}
            {toc.length > 0 && (
              <div className="bg-slate-50 p-8 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-8 border-b border-blue-100 pb-4">
                  <List size={20} className="text-blue-600" />
                  <h4 className="font-black text-blue-900 uppercase tracking-tighter text-sm italic">Struktur Artikel</h4>
                </div>
                <nav className="space-y-4">
                  {toc.map((item: any, idx: number) => (
                    <Link key={idx} href={`#${item.id}`} className="group flex items-start gap-3 text-[13px] font-bold transition-all hover:text-blue-600 leading-tight text-slate-600">
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 text-blue-500 transition-all -ml-5 group-hover:ml-0 flex-shrink-0 mt-0.5" />
                      {item.text}
                    </Link>
                  ))}
                </nav>
              </div>
            )}

            {/* WIDGET 2: SEKOLAH TERAKTIF */}
            <div className="bg-white rounded-2xl shadow-2xl shadow-blue-900/5 border border-blue-50 overflow-hidden relative">
              <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white relative overflow-hidden">
                <div className="absolute -right-4 -top-4 opacity-20 pointer-events-none rotate-12 scale-150"><Award size={100} /></div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={22} className="text-blue-200" />
                    <h4 className="font-black uppercase tracking-tighter text-sm italic">TERAKTIF {monthName.toUpperCase()}</h4>
                  </div>
                  <div className="bg-gradient-to-b from-yellow-300 via-yellow-500 to-amber-600 text-amber-950 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl border border-yellow-200 animate-pulse">
                    <Trophy size={10} className="inline mr-1" /> Trending
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {post.trendingSchools?.map((school: any, idx: number) => (
                  <Link key={school._id} href={`/sekolah/${school.slug}`} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center overflow-hidden border border-slate-100 shadow-sm group-hover:border-blue-500 transition-all transform group-hover:scale-105">
                          {school.logo ? <img src={urlFor(school.logo).url()} className="w-full h-full object-contain p-1" alt={school.name} /> : <User size={18} className="text-blue-100"/>}
                        </div>
                        <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg border-2 border-white ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-slate-400' : 'bg-amber-600'}`}>{idx + 1}</div>
                      </div>
                      <span className="text-[11px] font-black uppercase text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">{school.name}</span>
                    </div>
                    <div className="bg-white border border-blue-50 px-4 py-2 rounded-xl text-center min-w-[65px] group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:scale-110">
                      <span className="block text-lg font-black text-blue-600 group-hover:text-white leading-none">{school.mentionCount || 0}</span>
                      <span className="text-[7px] font-bold text-blue-300 group-hover:text-blue-100 uppercase">WARTA</span>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="p-5 bg-slate-50 border-t border-slate-100 flex flex-col items-center">
                 <div className="bg-white px-4 py-1 rounded-full border border-blue-100 text-[8px] font-black text-blue-500 uppercase tracking-[0.2em] shadow-sm mb-2 italic">LIVE STATUS</div>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic text-center leading-relaxed px-4">KARYA LITERASI SEKOLAH PERIODE {monthName.toUpperCase()} 2026</p>
              </div>
            </div>

            {/* WIDGET 3: HOT POSTS */}
            <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-md">
              <div className="flex items-center gap-3 mb-8 border-b border-orange-50 pb-4">
                <Flame size={22} className="text-orange-500" />
                <h4 className="font-black text-slate-800 uppercase tracking-tighter text-sm italic">Terpopuler</h4>
              </div>
              <div className="space-y-8">
                {post.popularPosts?.map((pop: any) => (
                  <Link key={pop._id} href={`/berita/${pop.slug}`} className="flex gap-4 group">
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 relative shadow-sm border border-slate-50 transform group-hover:scale-95 transition-all">
                      <img src={pop.category === 'Video' ? getYoutubeThumb(pop.videoUrl) : (pop.mainImage?.asset ? urlFor(pop.mainImage).url() : "/og-image.jpg")} className="w-full h-full object-cover group-hover:scale-125 transition-all duration-700" alt={pop.title} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h5 className="text-[11px] font-extrabold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors uppercase line-clamp-2">{pop.title}</h5>
                      <div suppressHydrationWarning className="flex items-center gap-1.5 mt-2 bg-orange-50 w-fit px-2 py-0.5 rounded-full"><Eye size={10} className="text-orange-500" /><span className="text-[9px] font-black text-orange-600">{pop.views || 0}</span></div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* RELATED SECTION */}
        <div className="mt-32 border-t border-slate-100 pt-20">
          <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-12 italic text-center md:text-left">Karya Guru Lainnya</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {post.related?.map((rel: any) => (
              <Link href={`/artikel/${rel.slug}`} key={rel._id} className="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="relative aspect-video overflow-hidden">
                   <img src={rel.category === 'Video' ? getYoutubeThumb(rel.videoUrl) : (rel.mainImage?.asset ? urlFor(rel.mainImage).url() : "/og-image.jpg")} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={rel.title} />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-[9px] font-black text-blue-600 uppercase mb-3 tracking-widest">{rel.category || "Inovasi"}</div>
                  <h4 className="text-[13px] font-black text-slate-800 group-hover:text-blue-600 uppercase leading-snug line-clamp-2 transition-colors">{rel.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* BACK BUTTON */}
        <div className="mt-24 flex justify-center pb-10">
          <Link href="/artikel" className="group flex items-center gap-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-blue-600 transition-all">
            <div className="bg-slate-50 group-hover:bg-blue-600 group-hover:text-white p-6 rounded-full shadow-sm border border-slate-100 group-hover:shadow-blue-200 group-hover:shadow-lg transition-all active:scale-90"><ArrowLeft size={20} /></div>
            KEMBALI KE RUANG ARTIKEL
          </Link>
        </div>

      </div>
    </main>
  );
}