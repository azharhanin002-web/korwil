import { client } from "@/lib/sanity/client";
import { groq } from "next-sanity";
import { urlFor } from "@/lib/sanity/image";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Calendar, Eye, NotebookPen, ArrowRight } from "lucide-react";

export const revalidate = 60;

const artikelQuery = groq`
  *[_type == "post" && category == "Artikel Guru"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    publishedAt,
    category,
    views
  }
`;

export default async function ArtikelPage() {
  const posts = await client.fetch(artikelQuery);

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* HEADER SECTION - EDUCATORS THEME */}
      <div className="bg-[#1a4bbd] pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
           <div className="absolute -left-20 -top-20 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="bg-white p-5 rounded-[2.5rem] shadow-2xl border border-blue-100 transform -rotate-3">
             <div className="bg-blue-50 p-4 rounded-3xl">
                <NotebookPen size={50} className="text-[#1a4bbd]" />
             </div>
          </div>
          <div className="text-center md:text-left text-white">
            <div className="inline-flex items-center gap-2 bg-blue-500/30 px-4 py-1.5 rounded-full border border-blue-400/30 mb-4">
               <BookOpen size={14} className="text-blue-200" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100">Ruang Literasi</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">
              Artikel <span className="text-blue-300">Guru</span>
            </h1>
            <p className="text-blue-100/70 font-medium mt-4 max-w-2xl text-sm md:text-base">
              Wadah aspirasi, pemikiran, dan inovasi pendidikan dari para pendidik hebat Korwilcam Purwokerto Barat.
            </p>
          </div>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 pb-24 relative z-20">
        {posts.length === 0 ? (
          <div className="bg-white py-32 text-center rounded-[2rem] shadow-xl border-2 border-dashed border-blue-100">
            <BookOpen size={64} className="mx-auto text-blue-50 mb-4" />
            <p className="text-slate-300 font-black uppercase tracking-widest italic text-xl">Belum ada artikel yang diterbitkan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {posts.map((post: any) => (
              <Link href={`/artikel/${post.slug}`} key={post._id} className="group">
                <div className="flex flex-col h-full bg-white rounded-[2rem] shadow-sm hover:shadow-[0_20px_50px_rgba(26,75,189,0.15)] transition-all duration-500 border border-slate-100 overflow-hidden">
                  <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                    {post.mainImage ? (
                      <Image 
                        src={urlFor(post.mainImage).url()} 
                        alt={post.title} 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full bg-blue-50 text-blue-200 uppercase font-black text-[10px] tracking-widest">Pendidik Hebat</div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#1a4bbd] text-white text-[9px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest shadow-lg">
                        Opini Guru
                      </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-base font-black text-[#00152b] group-hover:text-blue-600 transition-colors line-clamp-3 uppercase tracking-tight leading-snug mb-6">
                      {post.title}
                    </h2>
                    
                    <div className="mt-auto pt-5 border-t border-slate-50 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-blue-500" />
                        <span suppressHydrationWarning>{new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye size={13} className="text-blue-500" />
                        <span>{post.views || 0} hits</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}