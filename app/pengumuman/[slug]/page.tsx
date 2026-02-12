import { client } from "@/lib/sanity/client";
import { postDetailQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Tag, ArrowLeft, Info } from "lucide-react";

// KONFIGURASI JARAK PARAGRAF OTOMATIS (mb-6) & TIPOGRAFI FORMAL
const ptComponents = {
  block: {
    // MEMBERIKAN JEDA ANTAR PARAGRAF
    normal: ({ children }: any) => (
      <p className="mb-6 leading-relaxed text-gray-700 text-lg">{children}</p>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold mt-10 mb-4 text-[#002040] uppercase tracking-tight border-l-4 border-yellow-400 pl-4">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold mt-8 mb-3 text-[#002040]">{children}</h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-yellow-400 pl-4 italic my-8 text-gray-600 bg-yellow-50 py-4 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc ml-6 mb-6 space-y-2 text-gray-700">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal ml-6 mb-6 space-y-2 text-gray-700">{children}</ol>,
  },
};

export default async function PengumumanDetailPage({ 
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
        <h1 className="text-3xl font-black text-gray-300 uppercase tracking-widest mb-6">Pengumuman Tidak Ditemukan</h1>
        <Link href="/pengumuman" className="bg-[#002040] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-900 transition-all">
          Kembali ke Pengumuman
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Header Pengumuman - Formal Style */}
      <header className="max-w-4xl mx-auto px-4 pt-16 pb-10">
        <div className="flex justify-center md:justify-start mb-6">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-[#002040] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-sm">
            <Info size={14} />
            Informasi Resmi
          </div>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-black text-[#002040] mb-8 leading-[1.1] uppercase tracking-tighter">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-gray-400 border-y border-gray-100 py-5 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-yellow-600" />
            <span suppressHydrationWarning>
              {new Date(post.publishedAt).toLocaleDateString('id-ID', { 
                day: 'numeric', month: 'long', year: 'numeric' 
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-yellow-600" />
            <span>Kategori: {post.category || "Umum"}</span>
          </div>
        </div>
      </header>

      {/* Gambar jika ada */}
      {post.mainImage && (
        <div className="max-w-5xl mx-auto px-4 mb-16">
          <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border-8 border-gray-50">
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

      {/* Isi Pengumuman (Fix Jarak Paragraf Otomatis) */}
      <div className="max-w-3xl mx-auto px-4 pb-24">
        <div className="bg-white">
          <PortableText value={post.body} components={ptComponents} />
        </div>

        {/* Footer & Semboyan Instansi */}
        <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/pengumuman" className="group flex items-center gap-3 text-sm font-black text-[#002040] hover:text-blue-700 transition-colors uppercase tracking-widest">
            <div className="bg-gray-100 group-hover:bg-[#002040] group-hover:text-white p-3 rounded-full transition-all">
              <ArrowLeft size={18} />
            </div>
            Daftar Pengumuman
          </Link>
          
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] text-center md:text-right leading-relaxed">
            Diterbitkan secara resmi oleh<br/>
            <span className="text-gray-600">Korwilcam Dindik Purwokerto Barat</span>
          </div>
        </div>
      </div>
    </article>
  );
}