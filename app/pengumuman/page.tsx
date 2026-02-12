import { client } from "@/lib/sanity/client";
import { groq } from "next-sanity";
import { urlFor } from "@/lib/sanity/image";
import Image from "next/image";
import Link from "next/link";

// Query khusus mengambil kategori 'Pengumuman'
const pengumumanQuery = groq`
  *[_type == "post" && category == "Pengumuman"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    publishedAt,
    category,
    views
  }
`;

export default async function PengumumanPage() {
  const posts = await client.fetch(pengumumanQuery);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen bg-white">
      {/* Header Halaman Nuansa Formal */}
      <div className="flex items-center gap-4 mb-10 border-b-4 border-[#002040] pb-4">
        <div className="bg-yellow-400 p-3 rounded-xl shadow-md flex items-center justify-center">
          <span className="text-2xl">📢</span>
        </div>
        <div>
          <h1 className="text-3xl font-black text-[#002040] uppercase tracking-tight">Pengumuman Resmi</h1>
          <p className="text-gray-500 text-sm font-medium">Surat Edaran & Informasi Penting Korwilcam Purwokerto Barat</p>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-blue-50/50 rounded-2xl border-2 border-dashed border-blue-100">
          <p className="text-gray-400 italic text-lg font-medium">Belum ada pengumuman terbaru saat ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <Link href={`/pengumuman/${post.slug}`} key={post._id} className="group">
              <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden relative">
                
                {/* Image Section */}
                <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                  {post.mainImage ? (
                    <Image
                      src={urlFor(post.mainImage).url()}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-[#002040] to-blue-900 text-white font-bold text-xs p-10 text-center uppercase">
                      Informasi Resmi Korwilcam
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-400 text-[#002040] text-[10px] font-black px-3 py-1 rounded-md uppercase shadow-lg">
                      Penting
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-lg font-bold text-[#002040] group-hover:text-blue-600 transition-colors line-clamp-3 leading-snug mb-4">
                    {post.title}
                  </h2>
                  <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                    <span suppressHydrationWarning>
                      {new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-[#002040]">
                      Detail Info →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}