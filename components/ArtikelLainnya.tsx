import Image from 'next/image';
import Link from 'next/link';
import { urlFor } from '@/sanity/lib/image';

export default function ArtikelLainnya({ posts }: { posts: any[] }) {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center gap-2 mb-6 border-b pb-2">
        <span className="text-2xl">📰</span>
        <h2 className="text-2xl font-bold text-gray-800">Artikel Lainnya</h2>
      </div>

      {/* Grid Kartu Berita */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.map((post) => (
          <Link href={`/berita/${post.slug}`} key={post._id} className="group">
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
              {/* Gambar Utama */}
              <div className="relative h-48 w-full">
                <Image
                  src={urlFor(post.mainImage).url()}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Konten Teks */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600">
                  {post.title}
                </h3>
                <div className="flex items-center text-xs text-blue-500 gap-2 mb-1">
                  <span className="font-semibold uppercase">{post.category || "Berita"}</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-500">
                    {new Date(post.publishedAt).toLocaleDateString('id-ID', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  (dilihat {post.views || 0} kali)
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}