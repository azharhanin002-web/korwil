import { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { postDetailQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
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
  Trophy // Tambahkan icon piala
} from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import YouTubePlayer from "@/components/YouTubePlayer";
import { getYoutubeThumb } from "@/lib/youtube";

export const revalidate = 0;

// --- 1. HELPER: GENERATE DAFTAR ISI (TOC) ---
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

// --- 2. GENERATE METADATA DINAMIS ---
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0]{..., "slug": slug.current}`, { slug });
  if (!post) return { title: "Berita Tidak Ditemukan" };

  const isVideo = post.category === "Video";
  let imageUrl = "/og-image.jpg";
  if (isVideo && post.videoUrl) {
    imageUrl = getYoutubeThumb(post.videoUrl);
  } else if (post.mainImage?.asset) {
    imageUrl = urlFor(post.mainImage).width(1200).height(630).url();
  }

  return {
    title: `${post.title} | Korwilcam Purwokerto Barat`,
    openGraph: {
      title: post.title,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      type: "article",
    },
  };
}

// --- 3. KONFIGURASI PORTABLE TEXT ---
const ptComponents = {
  types: {
    youtube: YouTubePlayer,
    image: ({ value }: any) => {
      if (!value?.asset) return null;
      return (
        <div className="my-8 overflow-hidden rounded-2xl border-4 border-white shadow-md ring-1 ring-slate-100">
          <Image src={urlFor(value).url()} alt={value.alt || "Gambar Berita"} width={800} height={500} className="w-full object-cover" />
          {value.caption && <p className="bg-slate-50 py-3 text-center text-xs font-bold uppercase tracking-widest text-slate-400">{value.caption}</p>}
        </div>
      );
    },
  },
  block: {
    h2: ({ children }: any) => {
      const id = children[0].toLowerCase().replace(/\s+/g, "-");
      return <h2 id={id} className="text-2xl font-black mt-12 mb-5 text-blue-900 uppercase border-l-4 border-blue-500 pl-4 tracking-tight scroll-mt-24">{children}</h2>;
    },
    h3: ({ children }: any) => {
      const id = children[0].toLowerCase().replace(/\s+/g, "-");
      return <h3 id={id} className="text-xl font-black mt-10 mb-4 text-blue-800 uppercase tracking-tight scroll-mt-24">{children}</h3>;
    },
    normal: ({ children }: any) => <p className="mb-6 leading-relaxed text-slate-700 text-lg">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-6 italic my-10 text-blue-900 bg-blue-50/50 py-8 rounded-r-2xl shadow-inner font-medium text-xl">
        "{children}"
      </blockquote>
    ),
  },
};

// --- 4. KOMPONEN UTAMA ---
export default async function DetailBeritaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthName = now.toLocaleDateString('id-ID', { month: 'long' });

  const post = await client.fetch(postDetailQuery, { slug, monthStart });

  if (!post) return <div className="py-40 text-center font-black uppercase text-slate-300 text-3xl italic">Berita tidak ditemukan.</div>;

  const currentUrl = `https://korwilbarat.web.id/berita/${slug}`;
  const isVideo = post.category === "Video";
  const toc = getTOC(post.body || []);

  return (
    <article className="min-h-screen bg-white pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* HEADER SECTION */}
        <header className="pt-16 pb-12 max-w-4xl text-center md:text-left mx-auto md:mx-0">
          <div className="flex justify-center md:justify-start mb-6">
            <span className={`text-white text-[10px] font-black px-4 py-1.5 rounded uppercase tracking-[0.2em] shadow-lg ${isVideo ? 'bg-red-500 shadow-red-100' : 'bg-blue-600 shadow-blue-100'}`}>
              {isVideo ? "🎥 Video Dokumentasi" : (post.category || "Berita")}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-8 uppercase tracking-tighter italic">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-4 border-y border-slate-100 py-6">
            <div className="flex items-center gap-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
              <div className="flex items-center gap-2"><User size={14} className="text-blue-600" /><span>Admin Korwil</span></div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-blue-600" />
                <span suppressHydrationWarning>{new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-5 py-2.5 rounded-full border border-blue-100 shadow-sm">
              <Eye size={16} className="text-blue-600" />
              <span className="text-sm font-black text-blue-900">{post.views || 0} <span className="text-[10px] text-blue-400 ml-1 uppercase font-bold">Dilihat</span></span>
            </div>
          </div>
        </header>

        {/* --- LAYOUT 2 KOLOM --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* KOLOM KIRI (KONTEN) */}
          <div className="lg:col-span-8">
            {!isVideo && post.mainImage?.asset && (
              <div className="mb-10">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border-[6px] border-white ring-1 ring-slate-100 bg-slate-50">
                  <Image src={urlFor(post.mainImage).url()} alt={post.title} fill className="object-cover" priority />
                </div>
              </div>
            )}

            <div className="prose prose-lg max-w-none prose-slate bg-white px-2">
              <PortableText value={post.body} components={ptComponents} />
              <div className="mt-16 pt-10 border-t border-slate-100 flex justify-center md:justify-start">
                <ShareButtons url={currentUrl} title={post.title} />
              </div>
            </div>
          </div>

          {/* KOLOM KANAN (SIDEBAR STICKY) */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
              
              {/* WIDGET 1: DAFTAR ISI */}
              {toc.length > 0 && (
                <div className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 border-b border-blue-100 pb-4">
                    <List size={18} className="text-blue-600" />
                    <h4 className="font-black text-slate-800 uppercase tracking-tighter text-sm">Navigasi Artikel</h4>
                  </div>
                  <nav className="space-y-3">
                    {toc.map((item: any, idx: number) => (
                      <Link 
                        key={idx} 
                        href={`#${item.id}`} 
                        className={`group flex items-center gap-2 text-[13px] font-bold transition-all hover:text-blue-600 leading-tight ${item.level === 'h3' ? 'pl-4 text-slate-400 font-medium' : 'text-slate-600'}`}
                      >
                        <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 text-blue-500 transition-all -ml-4 group-hover:ml-0" />
                        {item.text}
                      </Link>
                    ))}
                  </nav>
                </div>
              )}

              {/* WIDGET 2: SEKOLAH TERAKTIF (ULTRA MODERN BRIGHT BLUE) */}
              <div className="bg-white rounded-2xl shadow-2xl shadow-blue-900/10 border border-blue-100 overflow-hidden relative">
                {/* Header Widget */}
                <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 text-white relative overflow-hidden">
                  <div className="absolute -right-6 -top-6 opacity-20 pointer-events-none rotate-12 scale-150">
                    <Award size={100} />
                  </div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <TrendingUp size={20} className="text-blue-200" />
                      <h4 className="font-black uppercase tracking-tighter text-sm">Teraktif {monthName}</h4>
                    </div>

                    {/* --- LENCANA TRENDING KEDAP-KEDIP KEEMASAN --- */}
                    <div className="relative group cursor-help">
                      <div className="absolute inset-0 bg-yellow-400 blur-md opacity-50 animate-pulse rounded-full"></div>
                      <span className="relative flex items-center gap-1.5 bg-gradient-to-b from-yellow-300 via-yellow-500 to-amber-600 text-amber-950 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-[0_0_15px_rgba(245,158,11,0.5)] border border-yellow-200 animate-bounce">
                        <Trophy size={10} className="fill-amber-900/20" />
                        Trending
                      </span>
                    </div>
                  </div>
                </div>

                {/* List Widget */}
                <div className="p-6 space-y-6 bg-gradient-to-b from-blue-50/30 to-white">
                  {post.trendingSchools?.map((school: any, idx: number) => (
                    <Link key={school._id} href={`/sekolah/${school.slug}`} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-11 h-11 rounded-xl bg-white flex-shrink-0 flex items-center justify-center overflow-hidden border border-blue-100 shadow-sm group-hover:border-blue-500 transition-all transform group-hover:rotate-3">
                            {school.logo ? <img src={urlFor(school.logo).url()} className="w-full h-full object-contain p-1.5" /> : <User size={16} className="text-blue-200"/>}
                          </div>
                          <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black text-white shadow-lg border-2 border-white transform group-hover:scale-110 transition-all ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-slate-400' : idx === 2 ? 'bg-amber-600' : 'bg-blue-600'}`}>
                            {idx + 1}
                          </div>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[11px] font-black uppercase tracking-tight text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">{school.name}</span>
                           <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Kec. Purwokerto Barat</span>
                        </div>
                      </div>
                      <div className="bg-white px-3 py-2 rounded-xl border border-blue-100 text-center min-w-[60px] shadow-sm group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                        <span className="block text-[14px] font-black text-blue-600 group-hover:text-white leading-none">{school.mentionCount || 0}</span>
                        <span className="text-[7px] font-bold text-blue-300 group-hover:text-blue-100 uppercase tracking-widest">Warta</span>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <div className="p-4 bg-slate-50 border-t border-slate-100 text-center relative">
                   <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 border border-slate-100 rounded-full text-[8px] font-black text-blue-500 uppercase tracking-[0.2em]">Live Status</div>
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em] mt-1 italic leading-relaxed px-4">
                    Data rilis berita sekolah periode {monthName} 2026
                  </p>
                </div>
              </div>

              {/* WIDGET 3: POSTINGAN TERPOPULER */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-md">
                <div className="flex items-center gap-3 mb-6 border-b border-orange-50 pb-4">
                  <Flame size={20} className="text-orange-500 fill-orange-50" />
                  <h4 className="font-black text-slate-800 uppercase tracking-tighter text-sm">Berita Paling Hot</h4>
                </div>
                <div className="space-y-6">
                  {post.popularPosts?.map((pop: any) => (
                    <Link key={pop._id} href={`/berita/${pop.slug}`} className="flex gap-4 group">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 relative shadow-sm border border-slate-50 transform group-hover:scale-95 transition-all">
                        <img 
                          src={pop.category === 'Video' ? getYoutubeThumb(pop.videoUrl) : (pop.mainImage?.asset ? urlFor(pop.mainImage).url() : "/og-image.jpg")} 
                          className="w-full h-full object-cover group-hover:scale-125 transition-all duration-700" 
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h5 className="text-[11px] font-extrabold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors uppercase line-clamp-2">{pop.title}</h5>
                        <div className="flex items-center gap-3 mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                           <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">
                              <Eye size={10} /> {pop.views || 0}
                           </div>
                           <span className="text-blue-400 font-black">{pop.category}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </aside>
        </div>

        {/* --- RELATED POSTS --- */}
        <div className="mt-24 border-t border-slate-100 pt-16">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-2 h-8 bg-blue-600 rounded-full shadow-lg shadow-blue-200"></div>
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Mungkin Anda Terlewat</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {post.related?.map((rel: any) => (
              <Link href={`/berita/${rel.slug}`} key={rel._id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500">
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                   <img src={rel.category === 'Video' ? getYoutubeThumb(rel.videoUrl) : (rel.mainImage?.asset ? urlFor(rel.mainImage).url() : "/og-image.jpg")} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                   {rel.category === 'Video' && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                       <PlayCircle size={36} className="text-white drop-shadow-xl" />
                     </div>
                   )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="text-[9px] font-black text-blue-600 uppercase mb-2 tracking-widest">{rel.category || "Berita"}</div>
                  <h4 className="text-[13px] font-black text-slate-800 group-hover:text-blue-600 uppercase leading-snug line-clamp-2 transition-colors">{rel.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* BACK BUTTON */}
        <div className="mt-24 flex justify-center pb-20">
          <Link href="/berita" className="group flex items-center gap-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-blue-600 transition-all">
            <div className="bg-slate-50 group-hover:bg-blue-600 group-hover:text-white p-5 rounded-full transition-all shadow-sm border border-slate-100 group-hover:shadow-blue-200 group-hover:shadow-lg">
              <ArrowLeft size={20} />
            </div>
            Jelajahi Berita Lain
          </Link>
        </div>

      </div>
    </article>
  );
}