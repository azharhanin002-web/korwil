import { client } from "@/lib/sanity/client";
import { postDetailQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";

export default async function ArtikelDetailPage({ params }: { params: { slug: string } }) {
  const post = await client.fetch(postDetailQuery, { slug: params.slug });

  if (!post) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold">Artikel tidak ditemukan</h1>
        <Link href="/artikel" className="text-blue-600 underline mt-4 inline-block">Kembali ke Daftar Artikel</Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
          {post.category}
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#002040] mt-4 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 border-b pb-6">
          <span>📅 {new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <span>👁️ {post.views || 0} kali dilihat</span>
        </div>
      </div>

      {/* Gambar Utama */}
      {post.mainImage && (
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-10 shadow-lg">
          <Image
            src={urlFor(post.mainImage).url()}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Konten Utama */}
      <div className="prose prose-blue prose-lg max-w-none text-gray-700 leading-relaxed">
        <PortableText value={post.body} />
      </div>

      {/* Tombol Kembali */}
      <div className="mt-16 pt-8 border-t">
        <Link href="/artikel" className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-full font-bold transition-all inline-flex items-center gap-2">
          ← Kembali ke Daftar Artikel
        </Link>
      </div>
    </article>
  );
}