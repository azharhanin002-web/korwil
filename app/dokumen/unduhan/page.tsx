import { client } from "@/lib/sanity/client";
import { groq } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/image";
import { DownloadCloud, FileDown, Calendar } from "lucide-react";

// Query khusus kategori 'Unduhan'
const unduhanQuery = groq`
  *[_type == "post" && category == "Agenda"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    publishedAt,
    category,
    views
  }
`;

export default async function UnduhanPage() {
  const posts = await client.fetch(unduhanQuery);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen bg-white">
      {/* Header Halaman */}
      <div className="flex items-center gap-4 mb-10 border-b-4 border-emerald-700 pb-4">
        <div className="bg-emerald-600 p-3 rounded-lg shadow-md text-white">
          <DownloadCloud size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-emerald-800 uppercase tracking-tight">Pusat Unduhan</h1>
          <p className="text-gray-500 text-sm font-medium">Materi, Formulir, dan Aplikasi Pendidikan Korwilcam Purwokerto Barat</p>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-emerald-50/50 rounded-2xl border-2 border-dashed border-emerald-100">
          <p className="text-gray-400 italic text-lg font-medium">Belum ada file unduhan tersedia.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any) => (
            <Link href={`/dokumen/unduhan/${post.slug}`} key={post._id} className="group">
              <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                {/* Preview Image */}
                <div className="relative h-44 w-full bg-emerald-50">
                  {post.mainImage ? (
                    <Image
                      src={urlFor(post.mainImage).url()}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-emerald-200">
                      <FileDown size={64} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-emerald-600 shadow-sm">
                       <DownloadCloud size={20} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-lg font-bold text-gray-800 group-hover:text-emerald-700 transition-colors line-clamp-2 mb-4">
                    {post.title}
                  </h2>
                  <div className="mt-auto pt-4 flex justify-between items-center text-xs text-gray-400 border-t border-gray-50">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span suppressHydrationWarning>{new Date(post.publishedAt).toLocaleDateString('id-ID')}</span>
                    </div>
                    <span className="font-bold text-emerald-600">LIHAT FILE</span>
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