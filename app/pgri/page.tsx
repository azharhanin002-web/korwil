import { client } from "@/lib/sanity/client";
import { groq } from "next-sanity";
import { urlFor } from "@/lib/sanity/image";
import Image from "next/image";
import Link from "next/link";

// Query khusus mengambil kategori 'PGRI'
const pgriQuery = groq`
  *[_type == "post" && category == "PGRI"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    publishedAt,
    category,
    views
  }
`;

export default async function PgriPage() {
  const posts = await client.fetch(pgriQuery);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen bg-white">
      {/* Header Halaman - Perbaikan Background Logo */}
<div className="flex items-center gap-4 mb-10 border-b-4 border-[#002040] pb-4">
  {/* Kotak Logo sekarang Putih agar gambar logo terlihat jelas */}
  <div className="bg-white p-2 rounded-xl shadow-md border border-gray-100 flex items-center justify-center">
    <Image 
      src="/logo-pgri.webp" 
      alt="Logo PGRI" 
      width={50} // Sedikit diperbesar agar makin jelas
      height={50} 
      className="object-contain"
    />
  </div>
  <div>
    <h1 className="text-3xl font-black text-[#002040] uppercase tracking-tight">Kabar PGRI</h1>
    <p className="text-gray-500 text-sm font-medium">Persatuan Guru Republik Indonesia - Kec. Purwokerto Barat</p>
  </div>
</div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 italic text-lg font-medium">Belum ada informasi terbaru dari PGRI.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <Link href={`/pgri/${post.slug}`} key={post._id} className="group">
              <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden">
                {/* Image Section */}
                <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                  {post.mainImage ? (
                    <Image
                      src={urlFor(post.mainImage).url()}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300 italic">Gambar tidak tersedia</div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase shadow-lg">
                      Update PGRI
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1">
                  <h2 className="text-xl font-bold text-[#002040] group-hover:text-red-600 transition-colors line-clamp-2 leading-snug mb-4">
                    {post.title}
                  </h2>
                  <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center text-xs text-gray-400 font-medium">
                    <span suppressHydrationWarning>
                      📅 {new Date(post.publishedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                    <span>👁️ {post.views || 0} hits</span>
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