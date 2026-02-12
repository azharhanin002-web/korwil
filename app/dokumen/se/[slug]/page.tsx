import { client } from "@/lib/sanity/client";
import { postDetailQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { FileText, ArrowLeft, Download } from "lucide-react";

export default async function SuratEdaranDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await client.fetch(postDetailQuery, { slug });

  if (!post) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-800">Dokumen tidak ditemukan</h1>
        <Link href="/dokumen/se" className="text-blue-600 font-bold hover:underline mt-4 inline-block">
          Kembali ke Arsip
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 bg-white min-h-screen">
      {/* Meta Header */}
      <div className="mb-8 border-b pb-8">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest mb-4">
          <FileText size={16} /> Surat Edaran Resmi
        </div>
        <h1 className="text-2xl md:text-4xl font-black text-gray-900 leading-tight mb-4">
          {post.title}
        </h1>
        <p className="text-gray-500 text-sm italic" suppressHydrationWarning>
          Dipublikasikan pada: {new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Featured Image/Scan Surat */}
      {post.mainImage && (
        <div className="relative aspect-[3/4] md:aspect-video w-full rounded-xl overflow-hidden mb-10 shadow-inner border bg-gray-50">
          <Image
            src={urlFor(post.mainImage).url()}
            alt={post.title}
            fill
            className="object-contain p-2"
            priority
          />
        </div>
      )}

      {/* Konten Keterangan */}
      <div className="prose prose-blue prose-sm md:prose-base max-w-none text-gray-700">
        <PortableText value={post.body} />
      </div>

      {/* Footer Info */}
      <div className="mt-16 pt-8 border-t flex flex-col md:flex-row gap-4 justify-between items-center">
        <Link href="/dokumen/se" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold transition-all">
          <ArrowLeft size={18} /> Kembali ke Daftar
        </Link>
        
        <div className="text-xs text-gray-400 bg-gray-50 px-4 py-2 rounded-lg border">
          Pastikan untuk mengunduh dokumen resmi hanya melalui portal ini.
        </div>
      </div>
    </article>
  );
}