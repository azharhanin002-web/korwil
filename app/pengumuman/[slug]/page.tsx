import { client } from "@/lib/sanity/client";
import { postDetailQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";

export default async function PengumumanDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await client.fetch(postDetailQuery, { slug });

  if (!post) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold text-[#002040]">Pengumuman tidak ditemukan</h1>
        <Link href="/pengumuman" className="text-blue-600 font-bold hover:underline mt-4 inline-block"> Kembali ke Daftar Pengumuman</Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 bg-white min-h-screen">
      {/* Header Detail */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-yellow-400 text-[#002040] text-[10px] font-black px-4 py-1.5 rounded-full uppercase mb-6 tracking-widest shadow-sm">
          Informasi Resmi
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#002040] mb-6 leading-[1.2]">
          {post.title}
        </h1>
        <div className="flex items-center gap-6 text-sm text-gray-400 font-medium pb-6 border-b border-gray-100">
           <span suppressHydrationWarning>Diterbitkan: {new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
           <span className="hidden md:inline">|</span>
           <span>Kategori: {post.category}</span>
        </div>
      </div>

      {/* Gambar jika ada */}
      {post.mainImage && (
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-12 shadow-xl">
          <Image
            src={urlFor(post.mainImage).url()}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Isi Pengumuman */}
      <div className="prose prose-blue prose-lg max-w-none text-gray-800 leading-relaxed">
        <PortableText value={post.body} />
      </div>

      {/* Footer Article */}
      <div className="mt-20 pt-10 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/pengumuman" className="bg-[#002040] hover:bg-blue-800 text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 text-sm">
          ← Kembali ke Pengumuman
        </Link>
        <div className="text-xs text-gray-400 text-center md:text-right">
          Harap diperhatikan sesuai dengan tanggal yang tertera.<br/>
          <strong>Korwilcam Purwokerto Barat</strong>
        </div>
      </div>
    </article>
  );
}