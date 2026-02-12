import { client } from "@/lib/sanity/client";
import { postDetailQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, FileDown, ShieldCheck } from "lucide-react";

export default async function UnduhanDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await client.fetch(postDetailQuery, { slug });

  if (!post) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold">File tidak ditemukan</h1>
        <Link href="/dokumen/unduhan" className="text-emerald-600 font-bold hover:underline mt-4 inline-block">
          Kembali ke Pusat Unduhan
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-12 bg-white min-h-screen">
      <div className="mb-10">
        <Link href="/dokumen/unduhan" className="inline-flex items-center gap-2 text-emerald-600 text-sm font-bold mb-6 hover:gap-3 transition-all">
          <ArrowLeft size={16} /> Kembali ke Pusat Unduhan
        </Link>
        
        <h1 className="text-3xl md:text-5xl font-black text-gray-900 leading-tight mb-6">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 font-medium pb-8 border-b">
           <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
             {post.category}
           </span>
           <span suppressHydrationWarning>📅 {new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
           <span>👁️ Dilihat {post.views || 0} kali</span>
        </div>
      </div>

      {/* Tampilan Utama: Preview File/Gambar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2">
          {post.mainImage && (
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden shadow-xl border bg-gray-50 mb-8">
              <Image
                src={urlFor(post.mainImage).url()}
                alt={post.title}
                fill
                className="object-contain p-4"
              />
            </div>
          )}
          
          <div className="prose prose-emerald prose-lg max-w-none text-gray-700">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Keterangan Dokumen:</h3>
            <PortableText value={post.body} />
          </div>
        </div>

        {/* Sidebar Download Card */}
        <div className="md:col-span-1">
          <div className="sticky top-24 bg-emerald-50 rounded-2xl p-6 border border-emerald-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-emerald-800 font-bold">
              <FileDown size={24} />
              <span>Area Unduhan</span>
            </div>
            <p className="text-xs text-emerald-700 mb-6 leading-relaxed">
              Silakan periksa isi dokumen di samping sebelum mengunduh. Pastikan koneksi stabil.
            </p>
            
            {/* Tombol Simulasi Download - Karena di Sanity Post kita belum buat field File, kita arahkan ke Gambar */}
            <a 
              href={post.mainImage ? urlFor(post.mainImage).url() : "#"} 
              target="_blank"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-200"
            >
              <DownloadCloud size={20} /> DOWNLOAD SEKARANG
            </a>

            <div className="mt-6 pt-6 border-t border-emerald-200 flex items-center gap-2 text-[10px] text-emerald-600 font-bold italic">
               <ShieldCheck size={14} /> File Bebas Virus & Malware
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}