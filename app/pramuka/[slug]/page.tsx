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
  Trophy
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
  if (!post) return { title: "Kegiatan Tidak Ditemukan" };

  const isVideo = post.category === "Video";
  let imageUrl = "/og-image.jpg";
  if (isVideo && post.videoUrl) {
    imageUrl = getYoutubeThumb(post.videoUrl);
  } else if (post.mainImage?.asset) {
    imageUrl = urlFor(post.mainImage).width(1200).height(630).url();
  }

  return {
    title: `${post.title} | Pramuka Purwokerto Barat`,
    openGraph: {
      title: post.title,
      images: [{ url: imageUrl, width: 1200, height: 630 }],
      type: "article",
    },
  };
}

// --- 3. KONFIGURASI PORTABLE TEXT (NUANSA PRAMUKA) ---
const ptComponents = {
  types: {
    youtube: YouTubePlayer,
    image: ({ value }: any) => {
      if (!value?.asset) return null;
      return (
        <div className="my-10 overflow-hidden rounded-2xl border-4 border-white shadow-xl ring-1 ring-orange-100 bg-slate-50">
          <Image src={urlFor(value).url()} alt={value.alt || "Gambar Pramuka"} width={800} height={500} className="w-full object-cover" />
          {value.caption && <p className="bg-orange-50 py-3 text-center text-[10px] font-black uppercase tracking-widest text-orange-600">{value.caption}</p>}
        </div>
      );
    },
  },
  block: {
    h2: ({ children }: any) => {
      const id = children[0].toLowerCase().replace(/\s+/g, "-");
      return <h2 id={id} className="text-2xl font-black mt-12 mb-5 text-[#5D4037] uppercase border-l-4 border-orange-500 pl-4 tracking-tight scroll-mt-24">{children}</h2>;
    },
    h3: ({ children }: any) => {
      const id = children[0].toLowerCase().replace(/\s+/g, "-");
      return <h3 id={id} className="text-xl font-black mt-10 mb-4 text-[#3E2723] uppercase tracking-tight scroll-mt-24">{children}</h3>;
    },
    normal: ({ children }: any) => <p className="mb-6 leading-relaxed text-slate-700 text-lg">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-[#5D4037] pl-6 italic my-10 text-[#5D4037] bg-orange-50/50 py-8 rounded-r-2xl shadow-inner font-medium text-xl">
        "{children}"
      </blockquote>
    ),
  },
};

// --- 4. KOMPONEN UTAMA ---
export default async function PramukaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Hitung Bulan untuk Trending
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthName = now.toLocaleDateString('id-ID', { month: 'long' });

  const post = await client.fetch(postDetailQuery, { slug, monthStart });

  if (!post) return <div className="py-40 text-center font-black uppercase text-slate-300 text-3xl italic">Kegiatan tidak ditemukan.</div>;

  const currentUrl = `https://korwilbarat.web.id/pramuka/${slug}`;
  const isVideo = post.category === "Video";
  const toc = getTOC(post.body || []);

  return (
    <article className="min-h-screen bg-white pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* HEADER SECTION (Bright & Professional) */}
        <header className="pt-20 pb-12 max-w-4xl mx-auto md:mx-0">
          <div className="flex justify-start mb-6">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-orange-200/50 border border-orange-200">
              <span className="animate-bounce text-xs">⚜️</span>
              Warta Pramuka
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-[#3E2723] leading-[1.1] mb-8 uppercase tracking-tighter italic">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-100 py-6">
            <div className="flex items-center gap-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
              <div className="flex items-center gap-2"><User size={14} className="text-orange-600" /><span>Admin Kwarran</span></div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-orange-600" />
                <span suppressHydrationWarning>{new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-orange-50 px-5 py-2.5 rounded-full border border-orange-100 shadow-inner">
              <Eye size={16} className="text-orange-600" />
              <span suppressHydrationWarning className="text-sm font-black text-[#5D4037]">{post.views || 0} <span className="text-[10px] text-slate-400 ml-1 uppercase font-bold">Dilihat</span></span>
            </div>
          </div>
        </header>

        {/* --- LAYOUT 2 KOLOM --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* KOLOM KIRI (KONTEN UTAMA) */}
          <div className="lg:col-span-8">
            {post.mainImage?.asset && (
              <div className="mb-10">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border-[6px] border-white ring-1 ring-slate-100 bg-slate-50">
                  <Image src={urlFor(post.mainImage).url()} alt={post.title} fill className="object-cover" priority />
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="bg-white/20 backdrop-blur-md p-5 rounded-full border border-white/30"><PlayCircle size={64} className="text-white drop-shadow-2xl" /></div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="prose prose-lg max-w-none prose-slate bg-white px-2">
              <PortableText value={post.body} components={ptComponents} />
              <div className="mt-16 pt-10 border-t border-slate-100">
                <ShareButtons url={currentUrl} title={post.title} />
              </div>
            </div>
          </div>

          {/* KOLOM KANAN (SIDEBAR STICKY) */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-28 space-y-8">
              
              {/* WIDGET 1: DAFTAR ISI */}
              {toc.length > 0 && (
                <div className="bg-slate-50 p-7 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 border-b border-orange-100 pb-4">
                    <List size={18} className="text-orange-600" />
                    <h4 className="font-black text-[#5D4037] uppercase tracking-tighter text-sm">Navigasi Kegiatan</h4>
                  </div>
                  <nav className="space-y-3">
                    {toc.map((item: any, idx: number) => (
                      <Link key={idx} href={`#${item.id}`} className="group flex items-center gap-2 text-[13px] font-bold transition-all hover:text-orange-600 leading-tight text-slate-600">
                        <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 text-orange-500 transition-all -ml-4 group-hover:ml-0" />
                        {item.text}
                      </Link>
                    ))}
                  </nav>
                </div>
              )}

              {/* WIDGET 2: SEKOLAH TERAKTIF (EMAS KEDAP-KEDIP) */}
              <div className="bg-white rounded-2xl shadow-2xl shadow-orange-900/5 border border-orange-100 overflow-hidden relative">
                <div className="bg-gradient-to-r from-[#5D4037] to-[#3E2723] p-6 text-white relative">
                  <div className="absolute -right-4 -top-4 opacity-20 pointer-events-none rotate-12 scale-150"><Award size={100} /></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <TrendingUp size={20} className="text-orange-300" />
                      <h4 className="font-black uppercase tracking-tighter text-sm">Teraktif {monthName}</h4>
                    </div>

                    {/* --- LENCANA EMAS KEDAP KEDIP --- */}
                    <div className="relative group cursor-help">
                      <div className="absolute inset-0 bg-yellow-400 blur-md opacity-70 animate-pulse rounded-full"></div>
                      <span className="relative flex items-center gap-1.5 bg-gradient-to-b from-yellow-300 via-yellow-500 to-amber-600 text-amber-950 text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xl border border-yellow-200 animate-bounce">
                        <Trophy size={10} className="fill-amber-900/20" />
                        Trending
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6 bg-gradient-to-b from-orange-50/30 to-white">
                  {post.trendingSchools?.map((school: any, idx: number) => (
                    <Link key={school._id} href={`/sekolah/${school.slug}`} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-lg border-2 border-white transform group-hover:scale-110 transition-all ${idx === 0 ? 'bg-yellow-500' : 'bg-[#5D4037]'}`}>{idx + 1}</div>
                        <span className="text-[11px] font-black uppercase tracking-tight text-slate-800 group-hover:text-orange-600 transition-colors line-clamp-1">{school.name}</span>
                      </div>
                      <div className="bg-orange-600/10 px-3 py-1.5 rounded-lg border border-orange-100 text-center min-w-[55px]">
                        <span className="block text-[12px] font-black text-orange-600 leading-none">{school.mentionCount || 0}</span>
                        <span className="text-[7px] font-bold text-orange-400 uppercase tracking-widest">Warta</span>
                      </div>
                    </Link>
                  ))}
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
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 relative shadow-sm border border-slate-50">
                        <img src={pop.category === 'Video' ? getYoutubeThumb(pop.videoUrl) : (pop.mainImage?.asset ? urlFor(pop.mainImage).url() : "/og-image.jpg")} className="w-full h-full object-cover group-hover:scale-125 transition-all duration-700" />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h5 className="text-[11px] font-extrabold text-slate-800 leading-tight group-hover:text-orange-600 transition-colors uppercase line-clamp-2">{pop.title}</h5>
                        <div suppressHydrationWarning className="flex items-center gap-3 mt-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                           <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full"><Eye size={10} /> {pop.views || 0}</div>
                           <span className="text-orange-400 font-black">{pop.category}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </aside>
        </div>

        {/* --- RELATED SECTION --- */}
        <div className="mt-24 border-t border-slate-100 pt-16">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-2 h-8 bg-orange-600 rounded-full shadow-lg shadow-orange-200"></div>
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Kegiatan Terkait</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {post.related?.map((rel: any) => (
              <Link href={`/pramuka/${rel.slug}`} key={rel._id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="relative aspect-video overflow-hidden">
                   <img src={rel.category === 'Video' ? getYoutubeThumb(rel.videoUrl) : (rel.mainImage?.asset ? urlFor(rel.mainImage).url() : "/og-image.jpg")} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="text-[9px] font-black text-orange-600 uppercase mb-2 tracking-widest">{rel.category || "Pramuka"}</div>
                  <h4 className="text-[13px] font-black text-slate-800 group-hover:text-orange-600 uppercase leading-snug line-clamp-2 transition-colors">{rel.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* BACK BUTTON */}
        <div className="mt-24 flex justify-center">
          <Link href="/pramuka" className="group flex items-center gap-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-[#5D4037] transition-all">
            <div className="bg-slate-50 group-hover:bg-[#5D4037] group-hover:text-white p-5 rounded-full transition-all shadow-sm border border-slate-100 group-hover:shadow-orange-900/20 group-hover:shadow-lg">
              <ArrowLeft size={20} />
            </div>
            Daftar Kegiatan Pramuka
          </Link>
        </div>

      </div>
    </article>
  );
}