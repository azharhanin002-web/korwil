import { client } from "@/lib/sanity/client";
import { postDetailQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, ArrowLeft, User, Share2, Facebook, Twitter, MessageCircle } from "lucide-react";

const ptComponents = {
  block: {
    normal: ({ children }: any) => <p className="mb-6 leading-relaxed text-gray-700 text-lg">{children}</p>,
    h2: ({ children }: any) => <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-800 uppercase border-l-4 border-blue-600 pl-4">{children}</h2>,
  },
};

export default async function DetailBeritaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await client.fetch(postDetailQuery, { slug });

  if (!post) return <div className="py-40 text-center font-bold">Berita tidak ditemukan.</div>;

  const shareUrl = `https://korwilbarat.web.id/berita/${slug}`;
  const shareText = `Baca berita terbaru: ${post.title}`;

  return (
    <article className="min-h-screen bg-white pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        
        {/* 1. HEADER - Font & Warna sudah diperhalus */}
        <header className="pt-16 pb-10">
          <div className="flex justify-start mb-4">
            <span className="bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded uppercase tracking-widest">
              {post.category || "Berita"}
            </span>
          </div>

          {/* PERBAIKAN: font-black -> font-extrabold, warna -> text-slate-800 */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 leading-tight mb-8 uppercase tracking-tight">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-gray-100 py-5">
            <div className="flex items-center gap-6 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <User size={14} className="text-blue-600" />
                <span>Admin Korwil</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-blue-600" />
                <span suppressHydrationWarning>
                  {new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              <Eye size={16} className="text-blue-600" />
              <span className="text-sm font-bold text-slate-600">
                {post.views || 0} <span className="text-[10px] text-slate-400 ml-1 uppercase">Pembaca</span>
              </span>
            </div>
          </div>
        </header>

        {/* 2. GAMBAR UTAMA */}
        <div className="mb-12">
          <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-100">
            {post.mainImage ? (
              <Image 
                src={urlFor(post.mainImage).url()} 
                alt={post.title} 
                fill 
                className="object-cover" 
                priority 
              />
            ) : (
              <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-xs">Korwilcam Dindik</div>
            )}
          </div>
        </div>

        {/* 3. ISI ARTIKEL */}
        <div className="prose prose-lg max-w-none mb-16">
          <PortableText value={post.body} components={ptComponents} />
        </div>

        {/* 4. TOMBOL SHARE */}
        <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 mb-20">
          <div className="flex items-center gap-3 font-bold text-slate-700 uppercase tracking-widest text-sm">
            <Share2 size={20} className="text-blue-600" /> Bagikan Berita Ini
          </div>
          <div className="flex gap-4">
            <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"><MessageCircle size={24} /></a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" className="w-12 h-12 bg-[#1877F2] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"><Facebook size={24} /></a>
            <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${post.title}`} target="_blank" className="w-12 h-12 bg-[#1DA1F2] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg"><Twitter size={24} /></a>
          </div>
        </div>

        {/* 5. RELATED POSTS */}
        <div className="border-t border-slate-100 pt-16">
          <h3 className="text-2xl font-bold text-slate-800 uppercase tracking-tighter mb-8 flex items-center gap-3">
             <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
             Berita Terkait Lainnya
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {post.related && post.related.length > 0 ? (
              post.related.slice(0, 4).map((rel: any) => (
                <Link href={`/berita/${rel.slug}`} key={rel._id} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 border border-slate-50">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image 
                      src={urlFor(rel.mainImage).url()} 
                      alt={rel.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="text-[13px] font-bold text-slate-800 leading-snug group-hover:text-blue-600 line-clamp-2 uppercase tracking-tight">
                      {rel.title}
                    </h4>
                    <div className="mt-auto pt-3 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      <span>{new Date(rel.publishedAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="col-span-full text-slate-400 italic text-sm">Belum ada berita terkait lainnya.</p>
            )}
          </div>
        </div>

        {/* TOMBOL KEMBALI */}
        <div className="mt-16 flex justify-center">
          <Link href="/berita" className="group flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-[0.3em] hover:text-blue-600 transition-colors">
             <div className="bg-slate-100 group-hover:bg-blue-600 group-hover:text-white p-3 rounded-full transition-all">
                <ArrowLeft size={20} />
             </div>
             Kembali ke Beranda
          </Link>
        </div>

      </div>
    </article>
  );
}