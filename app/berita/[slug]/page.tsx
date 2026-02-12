import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";
import { Calendar, User, Clock } from "lucide-react";

export const revalidate = 0;

// Konfigurasi tampilan teks dari Sanity (SOLUSI JARAK PARAGRAF)
const ptComponents = {
  block: {
    // Memberikan jeda otomatis antar paragraf
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
      <blockquote className="border-l-4 border-blue-600 pl-4 italic my-8 text-gray-600 bg-blue-50 py-2">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc ml-6 mb-6 space-y-2 text-gray-700">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal ml-6 mb-6 space-y-2 text-gray-700">{children}</ol>,
  },
};

async function getDetailBerita(slug: string) {
  const query = `
    *[_type == "post" && slug.current == $slug][0]{
      title,
      mainImage,
      publishedAt,
      body,
      "author": author->name,
      "category": category
    }
  `;
  const data = await client.fetch(query, { slug });
  return data;
}

export default async function DetailBerita({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getDetailBerita(slug);

  if (!post) {
    return (
      <div className="text-center py-40 bg-gray-50">
        <h1 className="text-3xl font-black text-gray-300 uppercase tracking-widest animate-pulse">
          Berita tidak ditemukan.
        </h1>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-white">
      {/* Header Berita */}
      <header className="max-w-4xl mx-auto px-4 pt-12 pb-8">
        <div className="inline-block px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest mb-6 rounded">
          {post.category || "Warta Korwil"}
        </div>
        
        <h1 className="text-3xl md:text-5xl font-black text-[#002040] leading-tight mb-8 uppercase tracking-tighter">
          {post.title}
        </h1>

        <div className="flex flex-wrap items-center gap-6 text-xs font-bold text-gray-400 border-y border-gray-100 py-4 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <User size={14} className="text-blue-600" />
            <span>Admin Korwil</span>
          </div>
          <div className="flex items-center gap-2" suppressHydrationWarning>
            <Calendar size={14} className="text-blue-600" />
            <span>
              {new Date(post.publishedAt).toLocaleDateString("id-ID", {
                day: "numeric", month: "long", year: "numeric"
              })}
            </span>
          </div>
        </div>
      </header>

      {/* Gambar Utama */}
      {post.mainImage && (
        <div className="max-w-5xl mx-auto px-4 mb-12">
          <div className="relative h-[300px] md:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl">
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

      {/* Isi Berita */}
      <div className="max-w-3xl mx-auto px-4 pb-20">
        <div className="bg-white">
          <PortableText value={post.body} components={ptComponents} />
        </div>

        {/* Footer Berita */}
        <div className="mt-16 pt-8 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.3em]">
                -- Akhir Berita --
            </p>
        </div>
      </div>
    </article>
  );
}