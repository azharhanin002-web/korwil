import { client } from "@/lib/sanity/client";
import { groq } from "next-sanity";
import { urlFor } from "@/lib/sanity/image";
import { getYoutubeThumb } from "@/lib/youtube"; // Gunakan helper yang sudah kita buat
import Image from "next/image";
import Link from "next/link";
import { PlayCircle, Calendar, Eye, Tent } from "lucide-react";

export const revalidate = 60;

const pramukaQuery = groq`
  *[_type == "post" && category == "Kepramukaan"] | order(publishedAt desc) {
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

export default async function PramukaPage() {
  const posts = await client.fetch(pramukaQuery);

  const getSafeImage = (post: any) => {
    if (post.category === "Video" && post.videoUrl) return getYoutubeThumb(post.videoUrl);
    if (post.mainImage?.asset) return urlFor(post.mainImage).url();
    return "/og-image.jpg";
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* HEADER KHUSUS PRAMUKA */}
      <div className="bg-[#5D4037] pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-400 via-transparent to-transparent"></div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="bg-white p-4 rounded-[2rem] shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <Image src="/pramuka.png" alt="Logo Pramuka" width={80} height={80} className="object-contain" />
          </div>
          <div className="text-center md:text-left text-white">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Info <span className="text-orange-400">Kepramukaan</span></h1>
            <p className="text-orange-200/70 font-bold uppercase tracking-[0.3em] text-xs mt-2">Kwarran Purwokerto Barat • Tunas Kelapa Dokumentasi</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 pb-20">
        {posts.length === 0 ? (
          <div className="bg-white py-32 text-center rounded-3xl shadow-xl border border-dashed border-orange-200">
            <Tent size={64} className="mx-auto text-orange-100 mb-4" />
            <p className="text-slate-300 font-black uppercase tracking-widest italic text-xl">Belum ada warta Pramuka.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => {
              const isVideo = post.category === "Video";
              return (
                <Link href={`/pramuka/${post.slug}`} key={post._id} className="group">
                  <div className="flex flex-col h-full bg-white rounded-3xl shadow-sm hover:shadow-[0_20px_50px_rgba(93,64,55,0.15)] transition-all duration-500 border border-slate-100 overflow-hidden">
                    <div className="relative h-60 w-full overflow-hidden bg-slate-200">
                      <Image src={getSafeImage(post)} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      {isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40">
                          <PlayCircle size={48} className="text-white drop-shadow-2xl" />
                        </div>
                      )}
                      <div className="absolute top-4 left-4">
                        <span className="bg-[#5D4037] text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg border border-orange-500/50">
                          Tunas Kelapa
                        </span>
                      </div>
                    </div>

                    <div className="p-8 flex flex-col flex-1">
                      <h2 className="text-xl font-black text-[#3E2723] group-hover:text-orange-600 transition-colors line-clamp-2 uppercase tracking-tight leading-snug mb-6">
                        {post.title}
                      </h2>
                      <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                           <Calendar size={14} className="text-orange-600" />
                           <span suppressHydrationWarning>{new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Eye size={14} className="text-orange-600" />
                           <span>{post.views || 0} hits</span>
                        </div>
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