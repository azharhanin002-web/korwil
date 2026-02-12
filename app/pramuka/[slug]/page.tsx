import { client } from "@/lib/sanity/client";
import { postDetailQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";

export default async function PramukaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await client.fetch(postDetailQuery, { slug });

  if (!post) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold text-[#5D4037]">Berita Pramuka tidak ditemukan</h1>
        <Link href="/pramuka" className="text-orange-600 font-bold hover:underline mt-4 inline-block"> Kembali ke List Pramuka</Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 bg-white min-h-screen">
      {/* Meta Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-800 text-xs font-black px-4 py-1.5 rounded-full uppercase mb-6 tracking-widest shadow-sm border border-orange-100">
          ⚜️ Pramuka Update
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-[#3E2723] mb-6 leading-[1.1]">
          {post.title}
        </h1>
        <div className="flex items-center justify-center gap-6 text-sm text-gray-400 font-medium pb-6 border-b border-gray-100">
           <span suppressHydrationWarning>Admin Korwil • {new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
           <span className="hidden md:inline">|</span>
           <span>Dilihat {post.views || 0} kali</span>
        </div>
      </div>

      {/* Featured Image */}
      {post.mainImage && (
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-orange-900/10">
          <Image
            src={urlFor(post.mainImage).url()}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Content Body */}
      <div className="prose prose-orange prose-lg max-w-none text-gray-700 leading-relaxed font-serif">
        <PortableText value={post.body} />
      </div>

      {/* Footer Article */}
      <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/pramuka" className="bg-[#5D4037] hover:bg-[#3E2723] text-white px-8 py-3 rounded-full font-bold transition-all duration-300 inline-flex items-center gap-2 text-sm">
          ← Kegiatan Pramuka Lainnya
        </Link>
        <div className="text-sm text-gray-400 italic">
          Satyaku Kudarmakan, Darmaku Kubaktikan.
        </div>
      </div>
    </article>
  );
}