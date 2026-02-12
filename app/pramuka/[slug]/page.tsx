import { client } from "@/lib/sanity/client";
import { postDetailQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, ArrowLeft, Trophy } from "lucide-react";

// KONFIGURASI JARAK PARAGRAF OTOMATIS (mb-6) & TIPOGRAFI
const ptComponents = {
  block: {
    // MEMBERIKAN JEDA ANTAR PARAGRAF
    normal: ({ children }: any) => (
      <p className="mb-6 leading-relaxed text-gray-700 text-lg">{children}</p>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold mt-10 mb-4 text-[#3E2723] uppercase tracking-tight border-l-4 border-orange-600 pl-4">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold mt-8 mb-3 text-[#3E2723]">{children}</h3>
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
  // 1. Ambil slug (Next.js 15+ compatible)
  const { slug } = await params;

  // 2. Fetch data
  const post = await client.fetch(postDetailQuery, { slug });

  if (!post) {
    return (
      <div className="container mx-auto py-40 text-center">
        <h1 className="text-3xl font-black text-gray-300 uppercase tracking-widest mb-6">Kegiatan Tidak Ditemukan</h1>
        <Link href="/pramuka" className="bg-[#5D4037] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-[#3E2723] transition-all">
          Kembali ke List Pramuka
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Header Halaman - Tema Cokelat & Oranye */}
      <header className="max-w-4xl mx-auto px-4 pt-16 pb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 text-[10px] font-black px-4 py-1.5 rounded-full uppercase mb-6 tracking-[0.2em] shadow-sm border border-orange-200">
          <span className="animate-bounce">⚜️</span>
          Pramuka Update
        </div>
        
        <h1 className="text-3xl md:text-5xl font-black text-[#3E2723] mb-8 leading-[1.1] uppercase tracking-tighter">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-gray-400 border-y border-gray-100 py-5 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-orange-600" />
            <span suppressHydrationWarning>
              {new Date(post.publishedAt).toLocaleDateString('id-ID', { 
                day: 'numeric', month: 'long', year: 'numeric' 
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Eye size={14} className="text-orange-600" />
            <span>{post.views || 0} Kali Dilihat</span>
          </div>
        </div>
      </header>

      {/* Gambar Utama */}
      {post.mainImage && (
        <div className="max-w-5xl mx-auto px-4 mb-16">
          <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-orange-900/10 border-8 border-orange-50/50">
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

      {/* Area Konten (Fix Jarak Paragraf Otomatis) */}
      <div className="max-w-3xl mx-auto px-4 pb-24">
        <div className="bg-white">
          <PortableText value={post.body} components={ptComponents} />
        </div>

        {/* Footer Halaman & Semboyan */}
        <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/pramuka" className="group flex items-center gap-3 text-sm font-black text-[#3E2723] hover:text-orange-600 transition-colors uppercase tracking-widest">
            <div className="bg-orange-50 group-hover:bg-[#5D4037] group-hover:text-white p-3 rounded-full transition-all">
              <ArrowLeft size={18} />
            </div>
            Kembali ke List Pramuka
          </Link>
          
          <div className="flex items-center gap-2 text-[10px] text-gray-300 font-bold uppercase tracking-[0.2em] italic text-center md:text-right">
             "Satyaku Kudarmakan, Darmaku Kubaktikan"
          </div>
        </div>
      </div>
    </article>
  );
}