import { client } from "@/lib/sanity/client";
import { groq } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/lib/sanity/image";
import { FileText, Calendar, Eye } from "lucide-react";

// Query khusus kategori 'Surat Edaran' atau 'Dokumen'
const seQuery = groq`
  *[_type == "post" && category == "Surat Edaran"] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    mainImage,
    publishedAt,
    category,
    views
  }
`;

export default async function SuratEdaranPage() {
  const posts = await client.fetch(seQuery);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen bg-white">
      {/* Header Halaman */}
      <div className="flex items-center gap-4 mb-10 border-b-4 border-blue-900 pb-4">
        <div className="bg-blue-900 p-3 rounded-lg shadow-md text-white">
          <FileText size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-black text-blue-900 uppercase tracking-tight">Surat Edaran</h1>
          <p className="text-gray-500 text-sm font-medium">Arsip Dokumen Resmi Korwilcam Purwokerto Barat</p>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 italic text-lg font-medium">Belum ada Surat Edaran yang diunggah.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post: any) => (
            <Link href={`/dokumen/se/${post.slug}`} key={post._id} className="group">
              <div className="flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 overflow-hidden">
                {/* Preview Thumbnail */}
                <div className="relative h-40 w-full bg-gray-100 border-b border-gray-100">
                  {post.mainImage ? (
                    <Image
                      src={urlFor(post.mainImage).url()}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:opacity-80 transition-opacity"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-blue-900/20">
                      <FileText size={64} />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase shadow-sm">
                      DOKUMEN
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h2 className="text-md font-bold text-gray-800 group-hover:text-blue-700 transition-colors line-clamp-2 leading-snug mb-4">
                    {post.title}
                  </h2>
                  <div className="mt-auto pt-4 flex justify-between items-center text-[11px] text-gray-400 border-t border-gray-50">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span suppressHydrationWarning>
                        {new Date(post.publishedAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye size={12} />
                      <span>{post.views || 0}</span>
                    </div>
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