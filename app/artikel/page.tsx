import Link from "next/image";
import NextLink from "next/link";
import { client } from "@/lib/sanity/client";
import { groq } from "next-sanity";
import { urlFor } from "@/lib/sanity/image";
import Image from "next/image";

// Query khusus mengambil kategori 'Artikel Guru'
const artikelQuery = groq`
  *[_type == "post" && category == "Artikel Guru"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    publishedAt,
    category,
    views
  }
`;

export default async function ArtikelPage() {
  const posts = await client.fetch(artikelQuery);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
      <div className="flex items-center gap-3 mb-8 border-b-2 border-blue-600 pb-2">
        <h1 className="text-3xl font-bold text-gray-800">Artikel Guru</h1>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl">
          <p className="text-gray-500 italic text-lg">Belum ada artikel guru yang diterbitkan.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {posts.map((post: any) => (
            <NextLink href={`/artikel/${post.slug}`} key={post._id} className="group">
              <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  {post.mainImage ? (
                    <Image
                      src={urlFor(post.mainImage).url()}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-xs font-bold text-blue-600 uppercase mb-2">
                    {post.category}
                  </span>
                  <h2 className="text-lg font-bold text-[#002040] group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <div className="mt-auto pt-4 flex justify-between items-center text-[11px] text-gray-400">
                    <span>{new Date(post.publishedAt).toLocaleDateString('id-ID')}</span>
                    <span>{post.views || 0} dilihat</span>
                  </div>
                </div>
              </div>
            </NextLink>
          ))}
        </div>
      )}
    </div>
  );
}