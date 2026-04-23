import { client } from "@/lib/sanity/client";
import { groq } from "next-sanity";
import { urlFor } from "@/lib/sanity/image";
import { getYoutubeThumb } from "@/lib/youtube";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, PlayCircle, Newspaper, ArrowRight } from "lucide-react";

export const revalidate = 60;

const pgriQuery = groq`
  *[_type == "post" && category == "PGRI"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    videoUrl,
    publishedAt,
    category,
    views
  }
`;

export default async function PgriPage() {
  const posts = await client.fetch(pgriQuery);

  const getSafeImage = (post: any) => {
    if (post.category === "Video" && post.videoUrl) return getYoutubeThumb(post.videoUrl);
    if (post.mainImage?.asset) return urlFor(post.mainImage).url();
    return "/og-image.jpg";
  };

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER SECTION - MODERN & CLEAN */}
      <div className="bg-slate-50 border-b border-slate-100 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="bg-white p-4 rounded-[2rem] shadow-xl shadow-red-900/5 border border-red-50 relative group">
                <div className="absolute inset-0 bg-red-500 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-20 transition-opacity"></div>
                <Image 
                    src="/logo-pgri.webp" 
                    alt="Logo PGRI" 
                    width={80} 
                    height={80} 
                    className="object-contain relative z-10" 
                />
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="w-8 h-[2px] bg-red-600"></span>
                <span className="text-red-600 font-black uppercase tracking-[0.3em] text-[10px]">Portal Resmi</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-[#002040] uppercase tracking-tighter italic">
                Kabar <span className="text-red-600 text-shadow">PGRI</span>
              </h1>
              <p className="text-slate-500 font-medium mt-2 max-w-xl">
                Persatuan Guru Republik Indonesia Kecamatan Purwokerto Barat. 
                Satyaku Kudarmakan, Darmaku Kubaktikan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-24 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
            <Newspaper size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-black uppercase tracking-widest italic text-lg">Belum ada warta PGRI terbaru.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post: any) => {
              const isVideo = post.category === "Video";
              return (
                <Link href={`/pgri/${post.slug}`} key={post._id} className="group flex flex-col h-full">
                  <div className="relative aspect-video rounded-2xl overflow-hidden shadow-lg mb-6 border-[5px] border-white ring-1 ring-slate-100">
                    <Image 
                      src={getSafeImage(post)} 
                      alt={post.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    
                    {isVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-all">
                        <PlayCircle size={48} className="text-white drop-shadow-2xl" />
                      </div>
                    )}
                    
                    <div className="absolute top-4 left-4">
                      <span className="bg-red-600 text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg">
                        Update PGRI
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 px-2">
                    <h2 className="text-xl font-black text-[#002040] group-hover:text-red-600 transition-colors line-clamp-2 uppercase tracking-tight leading-tight mb-4">
                      {post.title}
                    </h2>
                    
                    <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-red-600" />
                        <span suppressHydrationWarning>
                          {new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye size={14} className="text-red-600" />
                        <span>{post.views || 0} hits</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}