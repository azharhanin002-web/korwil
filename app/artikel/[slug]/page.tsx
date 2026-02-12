import { client } from "@/lib/sanity/client";
import { postDetailQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, ArrowLeft, User } from "lucide-react";

// Konfigurasi agar paragraf dan teks memiliki jeda otomatis
const ptComponents = {
  block: {
    // MEMBERIKAN JARAK ANTAR PARAGRAF (mb-6)
    normal: ({ children }: any) => (
      <p className="mb-6 leading-relaxed text-gray-700 text-lg">{children}</p>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold mt-10 mb-4 text-[#002040] uppercase tracking-tight">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold mt-8 mb-3 text-[#002040]">{children}</h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-600 pl-4 italic my-8 text-gray-600 bg-blue-50 py-4 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc ml-6 mb-6 space-y-2 text-gray-700">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal ml-6 mb-6 space-y-2 text-gray-700">{children}</ol>,
  },
};

export default async function ArtikelDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  // 1. Await params sesuai standar Next.js 15+
  const { slug } = await params;
  
  // 2. Fetch data menggunakan kueri yang sudah kita perbaiki di queries.ts
  const post = await client.fetch(postDetailQuery, { slug });

  if (!post) {
    return (
      <div className="container mx-auto py-40 text-center">
        <h1 className="text-3xl font-black text-gray-300 uppercase tracking-widest mb-6">Artikel Tidak Ditemukan</h1>
        <Link href="/artikel" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-700 transition-all">
          Kembali ke Daftar Artikel
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Header Artikel */}
      <header className="max-w-4xl mx-auto px-4 pt-16 pb-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded uppercase tracking-widest shadow-sm">
            {post.category || "Artikel"}
          </span>
        </div>
        
        <h1 className="text-3xl md:text-5xl font-black text-[#002040] leading-[1.1] mb-8 uppercase tracking-tighter">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-gray-400 border-y border-gray-100 py-5 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <User size={14} className="text-blue-600" />
            <span>Penulis: Admin Korwil</span>
          </div>
          <div className="flex items-center gap-2" suppressHydrationWarning>
            <Calendar size={14} className="text-blue-600" />
            <span>
              {new Date(post.publishedAt).toLocaleDateString('id-ID', { 
                day: 'numeric', month: 'long', year: 'numeric' 
              })}
            </span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Eye size={14} className="text-blue-600" />
            <span>{post.views || 0} hits</span>
          </div>
        </div>
      </header>

      {/* Gambar Utama dengan Efek Shadow */}
      {post.mainImage && (
        <div className="max-w-5xl mx-auto px-4 mb-16">
          <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
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

      {/* Area Konten (SOLUSI PARAGRAF ADA DI SINI) */}
      <div className="max-w-3xl mx-auto px-4 pb-24">
        <div className="bg-white">
          <PortableText value={post.body} components={ptComponents} />
        </div>

        {/* Tombol Navigasi Bawah */}
        <div className="mt-20 pt-10 border-t border-gray-100 flex justify-between items-center">
          <Link href="/artikel" className="group flex items-center gap-3 text-sm font-black text-[#002040] hover:text-blue-600 transition-colors uppercase tracking-widest">
            <div className="bg-gray-100 group-hover:bg-blue-600 group-hover:text-white p-2 rounded-full transition-all">
              <ArrowLeft size={16} />
            </div>
            Daftar Artikel
          </Link>
          
          <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest italic">
            Korwilcam Purwokerto Barat
          </p>
        </div>
      </div>
    </article>
  );
}