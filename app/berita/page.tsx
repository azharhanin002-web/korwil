import Link from "next/link";
// Perbaikan jalur import menggunakan path relatif agar terbaca oleh Vercel
import { client } from "../../sanity/lib/client"; 
import Image from "next/image";
import { urlFor } from "../../sanity/lib/image";

// Fungsi untuk mengambil data berita dengan kategori 'Berita'
async function getBerita() {
  // Query GROQ mencari kategori dengan value "Berita" (sesuai skema yang kita buat)
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
        <div className="py-20 text-center">
          <p className="text-gray-500 italic">Belum ada berita yang diterbitkan dengan kategori 'Berita'.</p>
          <p className="text-sm text-gray-400 mt-2">Pastikan Anda sudah klik "Publish" di Sanity Studio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post: any) => (
            /* Link diarahkan ke folder /berita/[slug] agar sesuai dengan struktur folder Anda */
            <Link href={`/berita/${post.slug.current}`} key={post.slug.current} className="group">
              <div className="border rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition bg-white">
                {post.mainImage && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={urlFor(post.mainImage).url()}
                      alt={post.title}
                      fill
                      className="object-cover transition group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-4">
                  <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                    {post.category}
                  </span>
                  <h2 className="text-xl font-bold mt-2 group-hover:text-blue-700 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-500 text-sm mt-3">
                    {new Date(post.publishedAt).toLocaleDateString("id-ID", {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
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