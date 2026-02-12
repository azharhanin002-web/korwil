import { client } from "@/lib/sanity/client";
import { postDetailQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, ArrowLeft, Share2, Facebook, Twitter, MessageCircle } from "lucide-react";

// KONFIGURASI JARAK PARAGRAF OTOMATIS (mb-6) & TIPOGRAFI
const ptComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="mb-6 leading-relaxed text-gray-700 text-lg">{children}</p>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-800 uppercase tracking-tight border-l-4 border-orange-600 pl-4">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold mt-8 mb-3 text-slate-800">{children}</h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-orange-600 pl-4 italic my-8 text-gray-600 bg-orange-50 py-4 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc ml-6 mb-6 space-y-2 text-gray-700">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal ml-6 mb-6 space-y-2 text-gray-700">{children}</ol>,
  },
};

export default async function PramukaDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const post = await client.fetch(postDetailQuery, { slug });

  if (!post) {
    return (
      <div className="container mx-auto py-40 text-center">
        <h1 className="text-3xl font-bold text-slate-300 uppercase tracking-widest mb-6">Kegiatan Tidak Ditemukan</h1>
        <Link href="/pramuka" className="bg-[#5D4037] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#3E2723] transition-all">
          Kembali ke List Pramuka
        </Link>
      </div>
    );
  }

  const shareUrl = `https://korwilbarat.web.id/pramuka/${slug}`;
  const shareText = `Kegiatan Pramuka Terbaru: ${post.title}`;

  return (
    <article className="min-h-screen bg-white pb-24">
      {/* KONTEN UTAMA SEJAJAR (MAX-W-4XL) */}
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        
        {/* 1. Header Halaman - Font Dirampingkan & Warna Dilembutkan */}
        <header className="pt-16 pb-10">
          <div className="flex justify-start mb-6">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-sm border border-orange-200">
              <span className="animate-bounce">⚜️</span>
              Pramuka Update
            </div>
          </div>
          
          {/* PERBAIKAN: font-black -> font-extrabold, warna -> text-slate-800 */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 mb-8 leading-tight uppercase tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-100 py-5">
            <div className="flex items-center gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-orange-600" />
                <span suppressHydrationWarning>
                  {new Date(post.publishedAt).toLocaleDateString('id-ID', { 
                    day: 'numeric', month: 'long', year: 'numeric' 
                  })}
                </span>
              </div>
            </div>
            {/* ICON MATA & PEMBACA */}
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              <Eye size={16} className="text-orange-600" />
              <span className="text-sm font-bold text-slate-600">
                {post.views || 0} <span className="text-[10px] text-slate-400 ml-1 uppercase">Dilihat</span>
              </span>
            </div>
          </div>
        </header>

        {/* 2. Gambar Utama Sejajar */}
        {post.mainImage && (
          <div className="mb-12">
            <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white ring-1 ring-orange-100">
              <Image
                src={urlFor(post.mainImage).url()}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )}

        {/* 3. Area Konten */}
        <div className="prose prose-lg max-w-none mb-16">
          <PortableText value={post.body} components={ptComponents} />
        </div>

        {/* 4. Tombol Share Warna-Warni */}
        <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 mb-20">
          <div className="flex items-center gap-3 font-bold text-slate-700 uppercase tracking-widest text-sm">
            <Share2 size={20} className="text-orange-600" /> Bagikan Kegiatan
          </div>
          <div className="flex gap-4">
            <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-green-200/50">
              <MessageCircle size={24} />
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" className="w-12 h-12 bg-[#1877F2] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-blue-200/50">
              <Facebook size={24} />
            </a>
            <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${post.title}`} target="_blank" className="w-12 h-12 bg-[#1DA1F2] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-blue-100/50">
              <Twitter size={24} />
            </a>
          </div>
        </div>

        {/* 5. Related Pramuka (4 Card di Bawah) */}
        <div className="border-t border-slate-100 pt-16">
          <h3 className="text-2xl font-bold text-slate-800 uppercase tracking-tighter mb-8 flex items-center gap-3">
             <span className="w-2 h-8 bg-orange-600 rounded-full"></span>
             Kegiatan Pramuka Lainnya
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {post.related && post.related.length > 0 ? (
              post.related.slice(0, 4).map((rel: any) => (
                <Link href={`/pramuka/${rel.slug}`} key={rel._id} className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500 border border-slate-50">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image 
                      src={urlFor(rel.mainImage).url()} 
                      alt={rel.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="text-[13px] font-bold text-slate-800 leading-snug group-hover:text-orange-600 line-clamp-2 uppercase">
                      {rel.title}
                    </h4>
                    <p className="mt-auto pt-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(rel.publishedAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="col-span-full text-slate-400 italic text-sm">Belum ada kegiatan terkait.</p>
            )}
          </div>
        </div>

        {/* Tombol Kembali */}
        <div className="mt-20 flex justify-center">
          <Link href="/pramuka" className="group flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-[0.3em] hover:text-orange-600 transition-colors">
            <div className="bg-slate-100 group-hover:bg-[#5D4037] group-hover:text-white p-3 rounded-full transition-all">
              <ArrowLeft size={16} />
            </div>
            Daftar Kegiatan
          </Link>
        </div>
      </div>
    </article>
  );
}