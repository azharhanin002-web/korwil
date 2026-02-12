import { client } from "@/lib/sanity/client";
import { searchNewsQuery } from "@/lib/sanity/queries";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity/image";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  // Ambil kata kunci dari URL
  const { q: searchTerm } = await searchParams;

  // Jalankan kueri ke Sanity
  const results = await client.fetch(searchNewsQuery, { searchTerm: searchTerm || "" });

  return (
    <main className="container mx-auto px-4 py-10 max-w-7xl min-h-screen">
      <div className="mb-10 border-b pb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Hasil Pencarian: <span className="text-blue-600">"{searchTerm}"</span>
        </h1>
        <p className="text-sm text-gray-500 mt-2">Ditemukan {results.length} berita terkait.</p>
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {results.map((post: any) => (
            <Link href={`/berita/${post.slug}`} key={post._id} className="group border rounded-xl overflow-hidden bg-white hover:shadow-lg transition">
              <div className="relative h-48 w-full bg-gray-100">
                {post.mainImage && (
                  <Image
                    src={urlFor(post.mainImage).url()}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                  />
                )}
              </div>
              <div className="p-4">
                <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">
                  {post.category || 'Berita'}
                </span>
                <h2 className="font-bold text-[#002040] mt-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {post.title}
                </h2>
                <div className="mt-4 pt-4 border-t flex justify-between items-center text-[10px] text-gray-400">
                   <span suppressHydrationWarning>{new Date(post.publishedAt).toLocaleDateString('id-ID')}</span>
                   <span>{post.views || 0} hits</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed">
          <p className="text-gray-400 italic text-lg">Maaf, berita yang Anda cari tidak ditemukan.</p>
          <Link href="/" className="text-blue-600 font-bold mt-4 inline-block hover:underline">
            Kembali ke Beranda
          </Link>
        </div>
      )}
    </main>
  );
}