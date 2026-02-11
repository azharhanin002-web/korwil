import Link from "next/link";
import { client } from "@/sanity/lib/client"; // Sesuaikan path ini dengan folder lib Anda
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";

// Fungsi untuk mengambil data berita dengan kategori 'Berita'
async function getBerita() {
  const query = `*[_type == "post" && categories[0]->value == "Berita"] | order(_createdAt desc) {
    title,
    slug,
    mainImage,
    publishedAt,
    "category": categories[0]->title
  }`;
  
  const data = await client.fetch(query);
  return data;
}

export default async function BeritaPage() {
  const posts = await getBerita();

  return (
    <div className="max-w-7xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-8 border-b-2 border-blue-600 pb-2">Berita & Artikel</h1>
      
      {posts.length === 0 ? (
        <p className="text-gray-500 italic">Belum ada berita yang diterbitkan.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post: any) => (
            <Link href={`/post/${post.slug.current}`} key={post.slug.current} className="group">
              <div className="border rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition">
                {post.mainImage && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={urlFor(post.mainImage).url()}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <span className="text-xs font-semibold text-blue-600 uppercase">{post.category}</span>
                  <h2 className="text-xl font-bold mt-2 group-hover:text-blue-700">{post.title}</h2>
                  <p className="text-gray-500 text-sm mt-2">
                    {new Date(post.publishedAt).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
