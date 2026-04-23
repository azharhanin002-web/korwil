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
  Award
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
        <div className="my-8 overflow-hidden rounded-2xl border-4 border-white shadow-lg ring-1 ring-slate-100">
          <Image src={urlFor(value).url()} alt={value.alt || "Gambar"} width={800} height={500} className="w-full object-cover" />
          {value.caption && <p className="bg-slate-50 py-3 text-center text-xs font-bold uppercase tracking-widest text-slate-400">{value.caption}</p>}
        </div>
      );
    },
  },
  block: {
    h2: ({ children }: any) => {
      const id = children[0].toLowerCase().replace(/\s+/g, "-");
      return <h2 id={id} className="text-2xl font-black mt-12 mb-5 text-slate-800 uppercase border-l-4 border-blue-600 pl-4 tracking-tight scroll-mt-24">{children}</h2>;
    },
    h3: ({ children }: any) => {
      const id = children[0].toLowerCase().replace(/\s+/g, "-");
      return <h3 id={id} className="text-xl font-black mt-10 mb-4 text-slate-800 uppercase tracking-tight scroll-mt-24">{children}</h3>;
    },
    normal: ({ children }: any) => <p className="mb-6 leading-relaxed text-gray-700 text-lg">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-600 pl-6 italic my-10 text-gray-600 bg-slate-50 py-8 rounded-r-2xl shadow-inner font-medium text-xl">
        "{children}"
      </blockquote>
    ),
  },
};

// --- 4. KOMPONEN UTAMA ---
export default async function DetailBeritaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Logika Waktu untuk Trending Bulanan
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthName = now.toLocaleDateString('id-ID', { month: 'long' });

  const post = await client.fetch(postDetailQuery, { slug, monthStart });

  if (!post) return <div className="py-40 text-center font-black uppercase text-slate-300 text-3xl italic">Berita tidak ditemukan.</div>;

  const currentUrl = `https://korwilbarat.web.id/berita/${slug}`;
  const isVideo = post.category === "Video";
  const toc = getTOC(post.body || []);

  return (
    <article className="min-h-screen bg-slate-50/50 pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* HEADER */}
        <header className="pt-16 pb-12 max-w-4xl">
          <div className="flex justify-start mb-6">
            <span className={`text-white text-[10px] font-black px-4 py-1.5 rounded-md uppercase tracking-[0.2em] shadow-lg ${isVideo ? 'bg-red-600 shadow-red-100' : 'bg-blue-600 shadow-blue-100'}`}>
              {isVideo ? "🎥 Video Dokumentasi" : (post.category || "Berita")}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-800 leading-[1.1] mb-8 uppercase tracking-tighter italic">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-gray-200 py-6">
            <div className="flex items-center gap-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
              <div className="flex items-center gap-2"><User size={14} className="text-blue-600" /><span>Admin Korwil</span></div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-blue-600" />
                <span suppressHydrationWarning>{new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm">
              <Eye size={16} className="text-blue-600" />
              <span className="text-sm font-black text-slate-700">{post.views || 0} <span className="text-[10px] text-slate-400 ml-1 uppercase font-bold">Hits</span></span>
            </div>
          </div>
        </header>

        {/* --- LAYOUT 2 KOLOM --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* KOLOM KIRI (KONTEN UTAMA) */}
          <div className="lg:col-span-8">
            {!isVideo && post.mainImage?.asset && (
              <div className="mb-10">
                <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl border-[6px] border-white ring-1 ring-slate-200 bg-white">
                  <Image src={urlFor(post.mainImage).url()} alt={post.title} fill className="object-cover" priority />
                </div>
              </div>
            )}

            <div className="prose prose-lg max-w-none prose-slate bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-sm shadow-blue-900/5">
              <PortableText value={post.body} components={ptComponents} />
              <div className="mt-16 pt-10 border-t border-slate-100 text-center md:text-left">
                <ShareButtons url={currentUrl} title={post.title} />
              </div>
            </div>
          </div>

          {/* KOLOM KANAN (SIDEBAR STICKY) */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-24 space-y-8">
              
              {/* WIDGET 1: DAFTAR ISI (TOC) */}
              {toc.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                    <List size={18} className="text-blue-600" />
                    <h4 className="font-black text-slate-800 uppercase tracking-tighter text-sm">Daftar Isi</h4>
                  </div>
                  <nav className="space-y-3">
                    {toc.map((item: any, idx: number) => (
                      <Link 
                        key={idx} 
                        href={`#${item.id}`} 
                        className={`block text-[13px] font-bold transition-all hover:text-blue-600 leading-tight ${item.level === 'h3' ? 'pl-4 text-slate-400' : 'text-slate-600'}`}
                      >
                        {item.text}
                      </Link>
                    ))}
                  </nav>
                </div>
              )}

              {/* WIDGET 2: SEKOLAH TERAKTIF (NAVY STYLE) */}
              <div className="bg-[#00152b] p-6 rounded-2xl shadow-xl text-white relative overflow-hidden">
                {/* Ikon Latar Belakang */}
                <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none">
                    <Award size={140} />
                </div>
                
                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-blue-400" />
                    <h4 className="font-black uppercase tracking-tighter text-sm">Teraktif {monthName}</h4>
                  </div>
                  <span className="bg-blue-600 text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-lg">Trending</span>
                </div>

                <div className="space-y-5 relative z-10">
                  {post.trendingSchools?.map((school: any, idx: number) => (
                    <Link key={school._id} href={`/sekolah/${school.slug}`} className="flex items-center justify-between group">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/20 group-hover:border-blue-400 transition-all">
                            {school.logo ? <img src={urlFor(school.logo).url()} className="w-full h-full object-contain" /> : <div className="text-[10px] font-black">{idx + 1}</div>}
                          </div>
                          {/* Badge Ranking */}
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-[8px] font-black shadow-lg shadow-blue-900">{idx + 1}</div>
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-tight group-hover:text-blue-400 transition-colors line-clamp-1">{school.name}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[11px] font-black text-blue-400">{school.mentionCount || 0}</span>
                        <span className="text-[7px] font-bold text-slate-500 uppercase tracking-widest">Post</span>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <p className="mt-8 text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em] text-center border-t border-white/5 pt-4 italic">Update Realtime Bulan {monthName}</p>
              </div>

              {/* WIDGET 3: POSTINGAN TERPOPULER */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                  <Flame size={18} className="text-orange-500" />
                  <h4 className="font-black text-slate-800 uppercase tracking-tighter text-sm">Paling Hot</h4>
                </div>
                <div className="space-y-6">
                  {post.popularPosts?.map((pop: any) => (
                    <Link key={pop._id} href={`/berita/${pop.slug}`} className="flex gap-4 group">
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 relative">
                        <img 
                          src={pop.category === 'Video' ? getYoutubeThumb(pop.videoUrl) : (pop.mainImage?.asset ? urlFor(pop.mainImage).url() : "/og-image.jpg")} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" 
                        />
                      </div>
                      <div className="flex flex-col justify-center">
                        <h5 className="text-[11px] font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors uppercase line-clamp-2">{pop.title}</h5>
                        <div className="flex items-center gap-2 mt-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                           <Eye size={10} className="text-blue-500" /> {pop.views || 0} hits
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </aside>
        </div>

        {/* RELATED POSTS (Tampil di Bawah) */}
        <div className="mt-20 border-t border-slate-200 pt-16">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
            <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">Berita Terkait</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {post.related?.map((rel: any) => (
              <Link href={`/berita/${rel.slug}`} key={rel._id} className="group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                   <img src={rel.category === 'Video' ? getYoutubeThumb(rel.videoUrl) : (rel.mainImage?.asset ? urlFor(rel.mainImage).url() : "/og-image.jpg")} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" />
                   {rel.category === 'Video' && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                       <PlayCircle size={32} className="text-white" />
                     </div>
                   )}
                </div>
                <div className="p-5 flex flex-col h-full">
                  <div className="text-[9px] font-black text-blue-600 uppercase mb-2 tracking-widest">{rel.category || "Umum"}</div>
                  <h4 className="text-[12px] font-black text-slate-800 group-hover:text-blue-600 uppercase leading-tight line-clamp-2 transition-colors">{rel.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* TOMBOL KEMBALI */}
        <div className="mt-24 flex justify-center">
          <Link href="/berita" className="group flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-blue-600 transition-all">
            <div className="bg-white group-hover:bg-blue-600 group-hover:text-white p-4 rounded-full transition-all shadow-md border border-slate-100">
              <ArrowLeft size={18} />
            </div>
            Kembali ke Berita
          </Link>
        </div>

      </div>
    </article>
  );
}