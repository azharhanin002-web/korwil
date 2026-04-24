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
  Quote,
  NotebookPen
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
        id: text.toLowerCase().replace(/\s+/g, "-"),
      };
    });
}

// --- 2. GENERATE METADATA (FIX THUMBNAIL MEDSOS BESAR) ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0]{..., "slug": slug.current}`, { slug });
  if (!post) return { title: "Informasi Tidak Ditemukan" };

  const isVideo = post.category === "Video";
  let imageUrl = "https://www.korwilbarat.web.id/og-image.jpg"; // Fallback

  if (isVideo && post.videoUrl) {
    imageUrl = getYoutubeThumb(post.videoUrl);
  } else if (post.mainImage?.asset) {
    imageUrl = urlFor(post.mainImage).width(1200).height(630).url();
  }

  return {
    title: `${post.title} | PGRI Purwokerto Barat`,
    openGraph: {
      title: post.title,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      images: [imageUrl],
    },
  };
}

// --- 3. KONFIGURASI PORTABLE TEXT (FIX SPACING & SMART QUOTE) ---
const ptComponents = {
  types: {
    youtube: YouTubePlayer,
    image: ({ value }: any) => {
      if (!value?.asset) return null;
      return (
        <div className="my-12 overflow-hidden rounded-xl border-4 border-white shadow-xl ring-1 ring-red-50 bg-slate-50">
          <Image 
            src={urlFor(value).url()} 
            alt="Gambar PGRI" 
            width={1200} 
            height={675} 
            className="w-full object-cover" 
            priority
            sizes="(max-width: 768px) 100vw, 800px" 
          />
          {value.caption && <p className="bg-red-50 py-3 text-center text-[10px] font-black uppercase tracking-widest text-red-600 border-t">{value.caption}</p>}
        </div>
      );
    },
  },
  block: {
    h2: ({ children }: any) => {
      const id = children[0].toString().toLowerCase().replace(/\s+/g, "-");
      return <h2 id={id} className="text-2xl font-black mt-14 mb-6 text-slate-800 uppercase border-l-4 border-red-600 pl-4 tracking-tight scroll-mt-28">{children}</h2>;
    },
    h3: ({ children }: any) => {
      const id = children[0].toString().toLowerCase().replace(/\s+/g, "-");
      return <h3 id={id} className="text-xl font-black mt-10 mb-4 text-slate-700 uppercase tracking-tight scroll-mt-28">{children}</h3>;
    },
    // --- SMART AUTO-QUOTE & JEDA MB-7 (IDEAL) ---
    normal: ({ children }: any) => {
      const plainText = children.map((c: any) => (typeof c === 'string' ? c : '')).join("");
      const hasQuotes = plainText.includes('"') || plainText.includes('“') || plainText.includes('”');

      if (hasQuotes) {
        return (
          <p className="mb-7 leading-[1.8] text-red-900 text-lg italic font-serif bg-red-50/40 px-6 py-4 rounded-r-xl border-l-4 border-red-300 shadow-sm last:mb-0">
            {children}
          </p>
        );
      }
      return <p className="mb-7 leading-[1.75] text-slate-700 text-lg last:mb-0">{children}</p>;
    },
    blockquote: ({ children }: any) => (
      <div className="relative my-12 group">
        <div className="absolute -left-2 top-0 bottom-0 w-1.5 bg-red-600 rounded-full"></div>
        <blockquote className="pl-10 pr-8 py-10 bg-red-50/50 rounded-r-2xl shadow-inner relative overflow-hidden">
          <Quote className="absolute -top-4 -left-2 w-20 h-20 text-red-100/50 -rotate-12" />
          <p className="relative z-10 italic font-serif text-2xl text-red-900 leading-relaxed">{children}</p>
        </blockquote>
      </div>
    ),
  },
};

// --- 4. KOMPONEN UTAMA ---
export default async function PgriDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthName = now.toLocaleDateString('id-ID', { month: 'long' });

  const post = await client.fetch(postDetailQuery, { slug, monthStart }, { useCdn: false });

  if (!post) return <div className="py-40 text-center font-black uppercase text-slate-300 text-3xl italic">Data tidak ditemukan.</div>;

  const currentUrl = `https://www.korwilbarat.web.id/pgri/${slug}`;
  const isVideo = post.category === "Video";
  const toc = getTOC(post.body || []);

  return (
    <main className="min-h-screen bg-white pb-24 font-sans pt-12 md:pt-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6" suppressHydrationWarning>
        
        {/* 1. NAVIGASI (BREADCRUMB) - HARUS JADI ANAK PERTAMA */}
        <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-10 overflow-hidden whitespace-nowrap">
          <Link href="/" className="hover:text-red-600 transition-colors flex items-center gap-1"><Home size={12} /> Beranda</Link>
          <ChevronRight size={10} />
          <Link href="/pgri" className="hover:text-red-600 transition-colors">PGRI</Link>
          <ChevronRight size={10} />
          <span className="text-slate-600 truncate max-w-[200px] md:max-w-none">{post.title}</span>
        </nav>

        {/* 2. HEADER SECTION */}
        <header className="mb-16 max-w-4xl">
          <div className="flex justify-start mb-6">
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 text-[10px] font-black px-4 py-2 rounded-lg uppercase tracking-[0.2em] shadow-lg shadow-red-200/50 border border-red-200">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              Kabar PGRI Barat
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.15] mb-10 uppercase tracking-tighter italic">{post.title}</h1>
          
          <div className="flex flex-wrap items-center justify-between gap-6 border-y border-slate-100 py-8">
            <div className="flex items-center gap-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-2"><User size={14} className="text-red-600" /><span>Admin PGRI</span></div>
              <div suppressHydrationWarning className="flex items-center gap-2">
                <Calendar size={14} className="text-red-600" />
                <span>{new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-full border border-slate-100 shadow-sm" suppressHydrationWarning>
              <Eye size={16} className="text-red-600" />
              <span className="text-sm font-black text-blue-900">
                {post.views || 0} <span className="text-[10px] text-slate-400 ml-1 uppercase">Pembaca</span>
              </span>
            </div>
          </div>
        </header>

        {/* 3. GRID UTAMA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-8 w-full">
            {!isVideo && post.mainImage?.asset && (
              <div className="mb-14 relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl border-[6px] border-white ring-1 ring-slate-100 bg-slate-50">
                <Image src={urlFor(post.mainImage).url()} alt={post.title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, 800px" />
              </div>
            )}

            <div className="max-w-none bg-white px-2">
              <PortableText value={post.body} components={ptComponents} />
            </div>

            <div className="mt-20 pt-10 border-t border-slate-100 space-y-16">
               <div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 italic text-center md:text-left">Bagikan Kabar PGRI:</h4>
                  <div className="flex justify-center md:justify-start"><ShareButtons url={currentUrl} title={post.title} /></div>
               </div>
               <div id="diskusikegiatan"><SupabaseComments postId={post.slug.current || post.slug} /></div>
            </div>
          </div>

          {/* SIDEBAR LENGKAP */}
          <aside className="lg:col-span-4 w-full h-fit sticky top-28 space-y-12">
            {toc.length > 0 && (
              <div className="bg-slate-50 p-8 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-8 border-b border-red-100 pb-4">
                  <List size={20} className="text-red-600" /><h4 className="font-black text-slate-800 uppercase tracking-tighter text-sm italic">Daftar Isi</h4>
                </div>
                <nav className="space-y-4">
                  {toc.map((item: any, idx: number) => (
                    <Link key={idx} href={`#${item.id}`} className="group flex items-start gap-3 text-[13px] font-bold transition-all hover:text-red-600 text-slate-600 leading-tight">
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 text-red-500 transition-all -ml-5 group-hover:ml-0 flex-shrink-0 mt-0.5" />
                      {item.text}
                    </Link>
                  ))}
                </nav>
              </div>
            )}

            {/* WIDGET TRENDING */}
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative">
              <div className="bg-gradient-to-r from-red-800 to-red-600 p-6 flex justify-between items-center text-white">
                <div className="flex items-center gap-3"><TrendingUp size={22} className="text-red-100" /><h4 className="font-black uppercase tracking-tighter text-sm italic">TERAKTIF {monthName.toUpperCase()}</h4></div>
                <div className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 px-4 py-1.5 rounded-full shadow-lg border border-yellow-200 animate-pulse">
                  <Trophy size={12} className="text-amber-950" /><span className="text-[10px] font-black text-amber-950">TRENDING</span>
                </div>
              </div>
              <div className="p-5 space-y-5">
                {post.trendingSchools?.map((school: any, idx: number) => (
                  <Link key={school._id} href={`/sekolah/${school.slug}`} className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 rounded-xl bg-white border border-slate-100 flex items-center justify-center p-1.5 group-hover:border-red-500 transition-all overflow-hidden shadow-sm">
                          {school.logo ? <img src={urlFor(school.logo).url()} className="w-full h-full object-contain p-1" alt={school.name} /> : <User size={20} className="text-slate-200"/>}
                        </div>
                        <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg border-2 border-white ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-slate-400' : idx === 2 ? 'bg-amber-600' : 'bg-red-600'}`}>{idx + 1}</div>
                      </div>
                      <div className="flex flex-col"><span className="text-[11px] font-black uppercase text-slate-800 line-clamp-1 group-hover:text-red-600 transition-colors">{school.name}</span><span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Anggota PGRI</span></div>
                    </div>
                    <div className="bg-white border border-slate-100 px-4 py-2 rounded-xl text-center min-w-[65px] group-hover:bg-red-600 group-hover:text-white transition-all shadow-sm"><span className="block text-lg font-black text-red-600 group-hover:text-white leading-none">{school.mentionCount || 0}</span><span className="text-[7px] font-bold uppercase group-hover:text-red-100 transition-colors">KABAR</span></div>
                  </Link>
                ))}
              </div>
            </div>

            {/* WIDGET POPULER (HOT POSTS) */}
            <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-md">
              <div className="flex items-center gap-3 mb-8 border-b border-orange-50 pb-4">
                <Flame size={22} className="text-orange-500" />
                <h4 className="font-black text-slate-800 uppercase tracking-tighter text-sm italic">Terpopuler Pekan Ini</h4>
              </div>
              <div className="space-y-8">
                {post.popularPosts?.map((pop: any) => (
                  <Link key={pop._id} href={`/pgri/${pop.slug}`} className="flex gap-4 group">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 relative shadow-sm border border-slate-50 transform group-hover:scale-95 transition-all">
                      <img src={pop.category === 'Video' ? getYoutubeThumb(pop.videoUrl) : (pop.mainImage?.asset ? urlFor(pop.mainImage).url() : "/og-image.jpg")} className="w-full h-full object-cover group-hover:scale-125 transition-all duration-700" alt={pop.title} />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h5 className="text-[11px] font-extrabold text-slate-800 leading-tight group-hover:text-red-600 transition-colors uppercase line-clamp-2">{pop.title}</h5>
                      <div suppressHydrationWarning className="flex items-center gap-1.5 mt-2 bg-red-50 w-fit px-2 py-0.5 rounded-full"><Eye size={10} className="text-red-500" /><span className="text-[9px] font-black text-red-600">{pop.views || 0}</span></div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* 4. RELATED SECTION */}
        <div className="mt-32 border-t border-slate-100 pt-20">
          <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-12 italic text-center md:text-left">Informasi PGRI Terkait</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {post.related?.map((rel: any) => (
              <Link href={`/pgri/${rel.slug}`} key={rel._id} className="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="relative aspect-video overflow-hidden">
                   <img src={rel.category === 'Video' ? getYoutubeThumb(rel.videoUrl) : (rel.mainImage?.asset ? urlFor(rel.mainImage).url() : "/og-image.jpg")} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={rel.title} /><div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-[9px] font-black text-red-600 uppercase mb-3 tracking-widest">{rel.category || "PGRI"}</div>
                  <h4 className="text-[13px] font-black text-slate-800 group-hover:text-red-600 uppercase leading-snug line-clamp-2 transition-colors">{rel.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-24 flex justify-center pb-10">
          <Link href="/pgri" className="group flex items-center gap-8 text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-red-600 transition-all"><div className="bg-slate-50 group-hover:bg-red-600 group-hover:text-white p-6 rounded-full shadow-sm border border-slate-100 transition-all active:scale-90"><ArrowLeft size={20} /></div>KEMBALI KE PORTAL PGRI</Link>
        </div>
      </div>

      {/* 5. VIEW COUNTER (HIDDEN) - FIX HYDRATION */}
      <div className="hidden pointer-events-none opacity-0"><ViewCounter id={post._id} /></div>
    </main>
  );
}