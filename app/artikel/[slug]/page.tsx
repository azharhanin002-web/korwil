import { Metadata } from "next";
import { client } from "@/lib/sanity/client";
import { postDetailQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Eye, ArrowLeft, User } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";
import YouTubePlayer from "@/components/YouTubePlayer"; // Import komponen player YouTube

export const revalidate = 0;

// --- 1. FUNGSI GENERATE METADATA DINAMIS ---
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch(`*[_type == "post" && slug.current == $slug][0]`, { slug });

  if (!post) return { title: "Artikel Tidak Ditemukan" };

  const imageUrl = post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : "/og-image.jpg";

  return {
    title: `${post.title} | Korwilcam Purwokerto Barat`,
    description: post.excerpt || "Baca artikel selengkapnya di Korwilcam Purwokerto Barat",
    openGraph: {
      title: post.title,
      description: post.excerpt || "Portal Resmi Korwilcam Purwokerto Barat",
      url: `https://korwilbarat.web.id/artikel/${slug}`,
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

// --- 2. KONFIGURASI PORTABLE TEXT (DENGAN EMBED YOUTUBE) ---
const ptComponents = {
  types: {
    youtube: YouTubePlayer, // Menghubungkan tipe 'youtube' dari Sanity ke komponen player
    image: ({ value }: any) => (
      <div className="my-10 overflow-hidden rounded-[2rem] border-4 border-white shadow-xl ring-1 ring-slate-100">
        <Image
          src={urlFor(value).url()}
          alt={value.alt || "Gambar Artikel"}
          width={800}
          height={500}
          className="w-full object-cover"
        />
        {value.caption && (
          <p className="bg-slate-50 py-3 text-center text-xs font-bold uppercase tracking-widest text-slate-400">
            {value.caption}
          </p>
        )}
      </div>
    ),
  },
  block: {
    normal: ({ children }: any) => (
      <p className="mb-6 leading-relaxed text-gray-700 text-lg">{children}</p>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-black mt-10 mb-4 text-slate-800 uppercase border-l-4 border-blue-600 pl-4 tracking-tight">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-black mt-8 mb-3 text-slate-800 uppercase tracking-tight">{children}</h3>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-blue-600 pl-4 italic my-8 text-gray-600 bg-slate-50 py-6 rounded-r-2xl shadow-inner font-medium">
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
export default async function ArtikelDetailPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const post = await client.fetch(postDetailQuery, { slug });

  if (!post) {
    return (
      <div className="container mx-auto py-40 text-center">
        <h1 className="text-3xl font-black text-slate-300 uppercase tracking-widest mb-6">Artikel Tidak Ditemukan</h1>
        <Link href="/artikel" className="bg-blue-600 text-white px-8 py-3 rounded-full font-black shadow-lg hover:bg-blue-700 transition-all uppercase text-xs tracking-widest">
          Kembali ke Daftar Artikel
        </Link>
      </div>
    );
  }

  const currentUrl = `https://korwilbarat.web.id/artikel/${slug}`;

  return (
    <article className="min-h-screen bg-white pb-24 font-sans">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        
        {/* Header Artikel */}
        <header className="pt-16 pb-10">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded uppercase tracking-[0.2em] shadow-lg shadow-blue-100">
              {post.category || "Artikel"}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-black text-slate-800 leading-[1.1] mb-8 uppercase tracking-tighter">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 border-y border-slate-100 py-6">
            <div className="flex items-center gap-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
              <div className="flex items-center gap-2">
                <User size={14} className="text-blue-600" />
                <span>Admin Korwil</span>
              </div>
              <div className="flex items-center gap-2" suppressHydrationWarning>
                <Calendar size={14} className="text-blue-600" />
                <span>
                  {new Date(post.publishedAt).toLocaleDateString('id-ID', { 
                    day: 'numeric', month: 'long', year: 'numeric' 
                  })}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-50 px-5 py-2.5 rounded-full border border-slate-100 shadow-inner">
              <Eye size={16} className="text-blue-600" />
              <span className="text-sm font-black text-slate-600">
                {post.views || 0} <span className="text-[10px] text-slate-400 ml-1 uppercase">Dilihat</span>
              </span>
            </div>
          </div>
        </header>

        {/* Gambar Utama */}
        {post.mainImage && (
          <div className="mb-16">
            <div className="relative aspect-video w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white ring-1 ring-slate-100">
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

        {/* Isi Artikel */}
        <div className="prose prose-lg max-w-none mb-20 prose-slate prose-p:text-slate-600 prose-strong:text-slate-900 prose-headings:tracking-tighter">
          <PortableText value={post.body} components={ptComponents} />
        </div>

        {/* KOMPONEN TOMBOL SHARE */}
        <ShareButtons url={currentUrl} title={post.title} />

        {/* Related Artikel */}
        <div className="border-t border-slate-100 pt-16">
          <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-10 flex items-center gap-3">
             <span className="w-2 h-8 bg-blue-600 rounded-full shadow-lg shadow-blue-200"></span>
             Artikel Terkait
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {post.related && post.related.length > 0 ? (
              post.related.slice(0, 4).map((rel: any) => (
                <Link href={`/artikel/${rel.slug}`} key={rel._id} className="group flex flex-col h-full bg-white rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-slate-100">
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                    <Image 
                      src={urlFor(rel.mainImage).url()} 
                      alt={rel.title} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h4 className="text-[13px] font-black text-slate-800 leading-snug group-hover:text-blue-600 line-clamp-2 uppercase transition-colors">
                      {rel.title}
                    </h4>
                    <p className="mt-auto pt-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {new Date(rel.publishedAt).toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="col-span-full text-slate-400 italic text-sm py-10 bg-slate-50 rounded-2xl text-center border border-dashed border-slate-200">Tidak ada artikel terkait lainnya.</p>
            )}
          </div>
        </div>

        {/* Tombol Kembali */}
        <div className="mt-20 flex justify-center">
          <Link href="/artikel" className="group flex items-center gap-4 text-xs font-black text-slate-400 uppercase tracking-[0.3em] hover:text-blue-600 transition-all">
            <div className="bg-slate-50 group-hover:bg-blue-600 group-hover:text-white p-4 rounded-full transition-all shadow-inner group-hover:shadow-lg group-hover:shadow-blue-200">
              <ArrowLeft size={20} />
            </div>
            Daftar Artikel
          </Link>
        </div>
      </div>
    </article>
  );
}