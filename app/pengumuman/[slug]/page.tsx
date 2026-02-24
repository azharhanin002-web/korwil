import { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { postDetailQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, ArrowLeft, Info, Tag, Share2, Facebook, Twitter, MessageCircle } from "lucide-react";

// --- 1. FUNGSI GENERATE METADATA DINAMIS (Thumbnail Unik WA/FB) ---
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0]`, { slug });

  if (!post) return { title: "Pengumuman Tidak Ditemukan" };

  const imageUrl = post.mainImage ? urlFor(post.mainImage).url() : "/og-image.jpg";

  return {
    title: post.title,
    description: post.excerpt || "Informasi Resmi Korwilcam Purwokerto Barat",
    openGraph: {
      title: post.title,
      description: post.excerpt || "Portal Resmi Korwilcam Purwokerto Barat",
      url: `https://korwilbarat.web.id/pengumuman/${slug}`,
      siteName: "Korwilcam Purwokerto Barat",
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
      images: [imageUrl],
    },
  };
}

// --- 2. KONFIGURASI PORTABLE TEXT (Jarak Paragraf Otomatis) ---
const ptComponents = {
  block: {
    normal: ({ children }: any) => (
      <p className="mb-6 leading-relaxed text-gray-700 text-lg">{children}</p>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold mt-10 mb-4 text-slate-800 uppercase tracking-tight border-l-4 border-yellow-500 pl-4">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-bold mt-8 mb-3 text-slate-800">{children}</h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-yellow-500 pl-4 italic my-8 text-gray-600 bg-yellow-50 py-4 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc ml-6 mb-6 space-y-2 text-gray-700">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal ml-6 mb-6 space-y-2 text-gray-700">{children}</ol>,
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
        <h1 className="text-3xl font-bold text-slate-300 uppercase tracking-widest mb-6 italic">Pengumuman Tidak Ditemukan</h1>
        <Link href="/pengumuman" className="bg-[#002040] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-900 transition-all">
          Kembali ke Pengumuman
        </Link>
      </div>
    );
  }

  const shareUrl = `https://korwilbarat.web.id/pengumuman/${slug}`;
  const shareText = `Pengumuman Resmi: ${post.title}`;

  return (
    <article className="min-h-screen bg-white pb-24">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        
        {/* Header Pengumuman */}
        <header className="pt-16 pb-10">
          <div className="flex justify-start mb-6">
            <div className="inline-flex items-center gap-2 bg-yellow-400 text-[#002040] text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-sm">
              <Info size={14} />
              Informasi Resmi
            </div>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-800 mb-8 leading-tight uppercase tracking-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-100 py-5">
            <div className="flex items-center gap-6 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
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
            
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              <Eye size={16} className="text-yellow-600" />
              <span className="text-sm font-bold text-slate-600">
                {post.views || 0} <span className="text-[10px] text-slate-400 ml-1 uppercase">Dilihat</span>
              </span>
            </div>
          </div>
        </header>

        {/* Gambar Utama Sejajar */}
        {post.mainImage && (
          <div className="mb-12">
            <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-100">
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
        <div className="prose prose-lg max-w-none mb-16">
          <PortableText value={post.body} components={ptComponents} />
        </div>

        {/* Tombol Share Warna-Warni */}
        <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6 mb-20">
          <div className="flex items-center gap-3 font-bold text-slate-700 uppercase tracking-widest text-sm">
            <Share2 size={20} className="text-blue-600" /> Bagikan Pengumuman
          </div>
          <div className="flex gap-4">
            <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-green-200/50">
              <MessageCircle size={24} />
            </a>
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" className="w-12 h-12 bg-[#1877F2] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-blue-200/50">
              <Facebook size={24} />
            </a>
            <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${post.title}`} target="_blank" className="w-12 h-12 bg-[#1DA1F2] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-blue-100/50">
              <Twitter size={24} />
            </a>
          </div>
        </div>

        {/* Tombol Kembali */}
        <div className="mt-20 flex justify-center">
          <Link href="/pengumuman" className="group flex items-center gap-3 text-xs font-bold text-slate-500 uppercase tracking-[0.3em] hover:text-blue-600 transition-colors">
            <div className="bg-slate-100 group-hover:bg-[#002040] group-hover:text-white p-3 rounded-full transition-all">
              <ArrowLeft size={16} />
            </div>
            Daftar Pengumuman
          </Link>
        </div>
      </div>
    </article>
  );
}