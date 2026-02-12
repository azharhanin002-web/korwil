import { client } from "@/lib/sanity/client";
import { postDetailQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";

// PERBAIKAN: Pastikan params diterima dengan benar
export default async function PgriDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  // Tunggu params untuk mendapatkan slug
  const { slug } = await params;

  // PERBAIKAN: Masukkan variabel slug ke dalam fetch agar tidak error "not provided"
  const post = await client.fetch(postDetailQuery, { slug });

  if (!post) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold text-[#002040]">Informasi PGRI tidak ditemukan</h1>
        <Link href="/pgri" className="text-red-600 font-bold hover:underline mt-4 inline-block">
           Kembali ke List PGRI
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 bg-white min-h-screen">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 text-xs font-black px-4 py-1.5 rounded-full uppercase mb-6 tracking-widest shadow-sm">
          <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
          Kabar PGRI
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-[#002040] mb-6 leading-[1.1]">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-6 text-sm text-gray-400 font-medium pb-6 border-b border-gray-100">
           <span suppressHydrationWarning>
             📅 {new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
           </span>
           <span>👁️ {post.views || 0} kali dilihat</span>
        </div>
      </div>

      {post.mainImage && (
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-gray-200">
          <Image
            src={urlFor(post.mainImage).url()}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <div className="prose prose-red prose-lg max-w-none text-gray-700 leading-relaxed font-serif">
        <PortableText value={post.body} />
      </div>

      <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/pgri" className="bg-gray-100 hover:bg-red-600 hover:text-white text-gray-600 px-8 py-3 rounded-full font-bold transition-all duration-300 inline-flex items-center gap-2 text-sm">
          ← Kabar PGRI Lainnya
        </Link>
        <div className="text-sm text-gray-400 italic">
          Copyright © 2026 PGRI Purwokerto Barat
        </div>
      </div>
    </article>
  );
}