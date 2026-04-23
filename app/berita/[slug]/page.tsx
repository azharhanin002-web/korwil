import { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { postDetailQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import FacebookComments from "@/components/FacebookComments";
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
  Home
} from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import YouTubePlayer from "@/components/YouTubePlayer";
import { getYoutubeThumb } from "@/lib/youtube";

export const revalidate = 0;
export const dynamic = 'force-dynamic';

// --- 1. HELPER: GENERATE DAFTAR ISI (TOC) ---
function getTOC(body: any[]) {
  if (!body) return [];
  return body
    .filter((block: any) => block._type === "block" && block.style === "h2")
    .map((block: any) => {
      const text = block.children.map((child: any) => child.text).join("");
      return {
        text: text,
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
        <div className="my-10 overflow-hidden rounded-xl border-4 border-white shadow-md ring-1 ring-slate-100 bg-slate-50">
          <Image src={urlFor(value).url()} alt={value.alt || "Gambar Berita"} width={800} height={500} className="w-full object-cover" />
          {value.caption && <p className="bg-slate-50 py-3 text-center text-[10px] font-black uppercase tracking-widest text-slate-400">{value.caption}</p>}
        </div>
      );
    },
  },
  block: {
    h2: ({ children }: any) => {
      const id = children[0].toString().toLowerCase().replace(/\s+/g, "-");
      return <h2 id={id} className="text-2xl font-black mt-12 mb-5 text-blue-900 uppercase border-l-4 border-blue-500 pl-4 tracking-tight scroll-mt-28">{children}</h2>;
    },
    normal: ({ children }: any) => <p className="mb-6 leading-relaxed text-gray-700 text-lg">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-500 pl-6 italic my-10 text-blue-900 bg-blue-50/50 py-8 rounded-r-xl shadow-inner font-medium text-xl italic font-serif">"{children}"</blockquote>
    ),
  },
};

// --- 4. KOMPONEN UTAMA ---
export default async function DetailBeritaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  const monthName = now.toLocaleDateString('id-ID', { month: 'long' }).toUpperCase();

  const post = await client.fetch(postDetailQuery, { slug, monthStart }, { useCdn: false });

  if (!post) return <div className="py-40 text-center font-black uppercase text-slate-300 text-3xl italic">Berita tidak ditemukan.</div>;

  const currentUrl = `https://korwilbarat.web.id/berita/${slug}`;
  const isVideo = post.category === "Video";
  const toc = getTOC(post.body || []);

  return (
    <main className="min-h-screen bg-white pb-24 font-sans">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-12 md:pt-20">
        
        {/* VIEW COUNTER & HYDRATION SAFETY */}
        <ViewCounter id={post._id} />

        {/* --- BREADCRUMB (PROFESIONAL) --- */}
        <nav className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 overflow-hidden whitespace-nowrap">
          <Link href="/" className="hover:text-blue-600 transition-colors flex items-center gap-1">
            <Home size={12} /> Beranda
          </Link>
          <ChevronRight size={10} />
          <Link href="/berita" className="hover:text-blue-600 transition-colors">Berita</Link>
          <ChevronRight size={10} />
          <span className="text-slate-600 truncate">{post.title}</span>
        </nav>

        {/* HEADER SECTION */}
        <header className="mb-12 max-w-4xl">
          <div className="flex justify-start mb-6">
            <span className={`text-white text-[10px] font-black px-4 py-1.5 rounded uppercase tracking-[0.2em] shadow-lg ${isVideo ? 'bg-red-500' : 'bg-blue-600'}`}>
              {isVideo ? "🎥 Video Dokumentasi" : (post.category || "Berita")}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-8 uppercase tracking-tighter italic">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-100 py-6">
            <div className="flex items-center gap-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-2"><User size={14} className="text-blue-600" /><span>Admin Korwil</span></div>
              <div suppressHydrationWarning className="flex items-center gap-2">
                <Calendar size={14} className="text-blue-600" />
                <span>{new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-blue-50 px-5 py-2.5 rounded-full border border-blue-100 shadow-sm">
              <Eye size={16} className="text-blue-600" />
              <span suppressHydrationWarning className="text-sm font-black text-blue-900">
                {post.views || 0} <span className="text-[10px] text-blue-400 ml-1 uppercase font-bold">Dilihat</span>
              </span>
            </div>
          </div>
        </header>

        {/* --- GRID UTAMA: items-start ADALAH KUNCI STICKY --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* KOLOM KIRI (KONTEN) */}
          <div className="lg:col-span-8 w-full">
            {post.mainImage?.asset && !isVideo && (
              <div className="mb-10 relative aspect-video rounded-xl overflow-hidden shadow-2xl border-[6px] border-white ring-1 ring-slate-100 bg-slate-50">
                <Image src={urlFor(post.mainImage).url()} alt={post.title} fill className="object-cover" priority />
              </div>
            )}

            <div className="prose prose-lg max-w-none prose-slate bg-white px-2">
              <PortableText value={post.body} components={ptComponents} />
            </div>

            {/* AREA INTERAKTIF DI LUAR PROSE */}
            <div className="mt-16 pt-10 border-t border-slate-100 space-y-12">
               <div className="block w-full">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 italic">Bagikan Berita Ke Rekan Guru:</h4>
                  <div className="flex justify-start">
                    <ShareButtons url={currentUrl} title={post.title} />
                  </div>
               </div>

               {/* FITUR KOMENTAR FACEBOOK (DI BAWAH SHARE BUTTON) */}
               <FacebookComments />
            </div>
          </div>

          {/* KOLOM KANAN (SIDEBAR STICKY) */}
          <aside className="lg:col-span-4 w-full h-fit sticky top-28">
            <div className="space-y-10">
              
              {/* WIDGET 1: TOC */}
              {toc.length > 0 && (
                <div className="bg-slate-50 p-7 rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-3 mb-6 border-b border-blue-100 pb-4">
                    <List size={18} className="text-blue-600" />
                    <h4 className="font-black text-blue-900 uppercase tracking-tighter text-sm italic">Isi Berita</h4>
                  </div>
                  <nav className="space-y-3">
                    {toc.map((item: any, idx: number) => (
                      <Link key={idx} href={`#${item.id}`} className="group flex items-center gap-2 text-[13px] font-bold transition-all hover:text-blue-600 leading-tight text-slate-600">
                        <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 text-blue-500 transition-all -ml-4 group-hover:ml-0" />
                        {item.text}
                      </Link>
                    ))}
                  </nav>
                </div>
              )}

              {/* WIDGET 2: SEKOLAH TERAKTIF (SULTAN DESIGN) */}
              <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative">
                <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 flex justify-between items-center text-white">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={20} className="text-blue-200" />
                    <h4 className="font-black uppercase tracking-tighter text-sm italic">TERAKTIF {monthName}</h4>
                  </div>
                  <div className="bg-gradient-to-r from-yellow-300 via-yellow-500 to-amber-600 px-4 py-1.5 rounded-full shadow-lg border border-yellow-200 flex items-center gap-2 animate-pulse">
                    <Trophy size={12} className="text-amber-950" />
                    <span className="text-[10px] font-black text-amber-950 uppercase tracking-widest">TRENDING</span>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {post.trendingSchools?.map((school: any, idx: number) => (
                    <Link key={school._id} href={`/sekolah/${school.slug}`} className="flex items-center justify-between group p-1">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center p-2 group-hover:border-blue-500 transition-all overflow-hidden">
                             {school.logo ? <img src={urlFor(school.logo).url()} className="w-full h-full object-contain" alt={school.name} /> : <User className="text-slate-300"/>}
                          </div>
                          <div className={`absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg border-2 border-white ${idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-slate-400' : idx === 2 ? 'bg-amber-600' : 'bg-blue-600'}`}>
                             {idx + 1}
                          </div>
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[12px] font-black uppercase text-slate-800 leading-tight line-clamp-1">{school.name}</span>
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">KEC. PURWOKERTO BARAT</span>
                        </div>
                      </div>
                      <div className="bg-white border border-blue-100 shadow-sm px-4 py-2.5 rounded-xl text-center min-w-[70px] group-hover:bg-blue-600 transition-all transform group-hover:scale-105">
                         <span className="block text-xl font-black text-blue-600 leading-none group-hover:text-white transition-colors">{school.mentionCount || 0}</span>
                         <span className="text-[7px] font-black text-blue-400 uppercase tracking-widest group-hover:text-blue-100 transition-colors">WARTA</span>
                      </div>
                    </Link>
                  ))}
                </div>
                
                <div className="p-5 bg-slate-50 border-t border-slate-100 flex flex-col items-center">
                   <div className="bg-white px-4 py-1 rounded-full border border-blue-100 text-[8px] font-black text-blue-500 uppercase tracking-[0.2em] shadow-sm mb-2 italic">LIVE STATUS</div>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic text-center leading-relaxed">DATA RILIS BERITA SEKOLAH PERIODE {monthName} 2026</p>
                </div>
              </div>

              {/* WIDGET 3: HOT POSTS */}
              <div className="bg-white p-7 rounded-xl border border-slate-100 shadow-md">
                <div className="flex items-center gap-3 mb-6 border-b border-orange-50 pb-4">
                  <Flame size={20} className="text-orange-500" />
                  <h4 className="font-black text-slate-800 uppercase tracking-tighter text-sm italic">Berita Populer</h4>
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
            </div>
          </aside>
        </div>

        {/* RELATED SECTION */}
        <div className="mt-32 border-t border-slate-100 pt-16">
          <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-12 italic">Berita Terkait</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {post.related?.map((rel: any) => (
              <Link href={`/berita/${rel.slug}`} key={rel._id} className="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="relative aspect-video overflow-hidden">
                   <img src={rel.category === 'Video' ? getYoutubeThumb(rel.videoUrl) : (rel.mainImage?.asset ? urlFor(rel.mainImage).url() : "/og-image.jpg")} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt={rel.title} />
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
        <div className="mt-24 flex justify-center pb-10">
          <Link href="/berita" className="group flex items-center gap-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-blue-600 transition-all">
            <div className="bg-slate-50 group-hover:bg-blue-600 group-hover:text-white p-5 rounded-full shadow-sm border border-slate-100 group-hover:shadow-blue-200 group-hover:shadow-lg transition-all"><ArrowLeft size={20} /></div>
            KEMBALI KE BERITA
          </Link>
        </div>

      </div>
    </main>
  );
}