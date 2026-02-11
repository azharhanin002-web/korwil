import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";

// Fungsi untuk mengambil detail satu berita berdasarkan slug
async function getDetailBerita(slug: string) {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    mainImage,
    publishedAt,
    body,
    "author": author->name
  }`;
  
  const data = await client.fetch(query, { slug });
  return data;
}

export default async function DetailBerita({ params }: { params: { slug: string } }) {
  // Tunggu data dari Sanity berdasarkan slug di URL
  const post = await getDetailBerita(params.slug);

  if (!post) {
    return <div className="text-center p-10">Berita tidak ditemukan.</div>;
  }

  return (
    <article className="max-w-4xl mx-auto p-5 py-10">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-500 text-sm gap-4">
          <p>Penulis: <span className="font-semibold">{post.author || "Admin"}</span></p>
          <p>{new Date(post.publishedAt).toLocaleDateString("id-ID", { 
            day: 'numeric', month: 'long', year: 'numeric' 
          })}</p>
        </div>
      </header>

      {post.mainImage && (
        <div className="relative h-[400px] w-full mb-8 rounded-xl overflow-hidden shadow-lg">
          <Image
            src={urlFor(post.mainImage).url()}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Bagian Isi Berita (PortableText untuk merender konten dari Sanity Editor) */}
      <div className="prose prose-blue lg:prose-xl max-w-none">
        <PortableText value={post.body} />
      </div>
    </article>
  );
}