import { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { postDetailQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, ArrowLeft, Info, Tag } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";

export const revalidate = 0;

// --- 1. FUNGSI GENERATE METADATA DINAMIS (Thumbnail Per Postingan) ---
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0]`, { slug });

  if (!post) return { title: "Pengumuman Tidak Ditemukan" };

  // Mengambil URL Gambar dari Sanity, jika tidak ada pakai gambar default di folder public
  const imageUrl = post.mainImage 
    ? urlFor(post.mainImage).width(1200).height(630).url() 
    : "https://korwilbarat.web.id/og-image.jpg";

  return {
    title: `${post.title} | Pengumuman Korwilcam Purwokerto Barat`,
    description: post.excerpt || "Informasi Resmi Korwilcam Purwokerto Barat",
    openGraph: {
      title: post.title,
      description: post.excerpt || "Baca selengkapnya informasi resmi dari Korwilcam Purwokerto Barat",
      url: `https://korwilbarat.web.id/pengumuman/${slug}`,
      siteName: "Korwilcam Dindik Purwokerto Barat",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "id_ID",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt || "Informasi Resmi Korwilcam Purwokerto Barat",
      images: [imageUrl],
    },
  };
}

// --- 2. KONFIGURASI PORTABLE TEXT ---
const ptComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="mb-6 leading-relaxed text-gray-700 text-lg">{children}</p>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-black mt-10 mb-4 text-slate-800 uppercase tracking-tighter border-l-4 border-yellow-500 pl-4">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-black mt-8 mb-3 text-slate-800 uppercase tracking-tight">{children}</h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-yellow-500 pl-4 italic my-8 text-gray-600 bg-yellow-50/50 py-6 rounded-r-2xl shadow-inner font-medium">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc ml-6 mb-6 space-y-2 text-gray-700 font-medium">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal ml-6 mb-6 space-y-2 text-gray-700 font-medium">{children}</ol>,
  },
};

// --- 3. KOMPONEN UTAMA HALAMAN ---
export default async function PengumumanDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const post = await client.fetch(postDetailQuery, { slug });

  if (!post) {
    return (
      <div className="container mx-auto py-40 text-center">
        <h1 className="text-3xl font-black text-slate-300 uppercase tracking-widest mb-6 italic">Pengumuman Tidak Ditemukan</h1>
        <Link href="/pengumuman" className="bg-[#002040] text-white px-8 py-3 rounded-full font-black shadow-lg hover:bg-blue-900 transition-all uppercase text-xs tracking-widest">
          Kembali ke Pengumuman
        </Link>
      </div>
    );
  }

  const currentUrl = `https://korwilbarat.web.id/pengumuman/${slug}`;

  return (
    <article className="min-h-screen bg-white pb-24 font-sans">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        
        {/* Header Pengumuman */}
        <header className="pt-16 pb-10">
          <div className="flex justify-start mb-6">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-[#002040] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-yellow-200/50">
              <Info size={14} />
              Informasi Resmi
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 leading-[1.1] mb-8 uppercase tracking-tighter">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-100 py-6">
            <div className="flex items-center gap-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
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
            
            <div className="flex items-center gap-2 bg-slate-50 px-5 py-2.5 rounded-full border border-slate-100 shadow-inner">
              <Eye size={16} className="text-yellow-600" />
              <span className="text-sm font-black text-slate-700">
                {post.views || 0} <span className="text-[10px] text-slate-400 ml-1 uppercase font-bold">Dilihat</span>
              </span>
            </div>
          </div>
        </header>

        {/* Gambar Utama */}
        {post.mainImage && (
          <div className="mb-16">
            <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white ring-1 ring-slate-100 bg-slate-50">
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

        {/* Area Konten */}
        <div className="prose prose-lg max-w-none mb-20 prose-slate prose-p:text-slate-600 prose-headings:tracking-tighter prose-strong:text-slate-900">
          <PortableText value={post.body} components={ptComponents} />
        </div>

        {/* KOMPONEN TOMBOL SHARE LENGKAP (IG, TIKTOK, FB, WA, DLL) */}
        <ShareButtons url={currentUrl} title={post.title} />

        {/* Tombol Kembali */}
        <div className="mt-20 flex justify-center">
          <Link href="/pengumuman" className="group flex items-center gap-4 text-xs font-black text-slate-400 uppercase tracking-[0.3em] hover:text-blue-600 transition-all">
            <div className="bg-slate-50 group-hover:bg-[#002040] group-hover:text-white p-4 rounded-full transition-all shadow-inner group-hover:shadow-lg group-hover:shadow-blue-900/20">
              <ArrowLeft size={20} />
            </div>
            Daftar Pengumuman
          </Link>
        </div>
      </div>
    </article>
  );
}