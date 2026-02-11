import Link from "next/link";
import Image from "next/image";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: any;
  publishedAt?: string;
  category?: string;
}

// Ambil semua post yang sudah publish
async function getBerita(): Promise<Post[]> {
  const query = `
    *[_type == "post" && defined(slug.current)] 
    | order(publishedAt desc) {
      _id,
      title,
      slug,
      mainImage,
      publishedAt,
      "category": categories[0]->title
    }
  `;

  try {
    const data = await client.fetch(query);
    return data || [];
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return [];
  }
}

export default async function BeritaPage() {
  const posts = await getBerita();

  return (
    <div className="max-w-7xl mx-auto p-5">
      <h1 className="text-3xl font-bold mb-8 border-b-2 border-blue-600 pb-2">
        Berita & Artikel
      </h1>

      {posts.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-gray-500 italic">
            Belum ada berita yang diterbitkan.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              href={`/berita/${post.slug.current}`}
              key={post._id}
              className="group"
            >
              <div className="border rounded-lg overflow-hidden shadow-sm group-hover:shadow-md transition bg-white">

                {post.mainImage && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={urlFor(post.mainImage).url()}
                      alt={post.title}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="p-4">
                  {post.category && (
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                      {post.category}
                    </span>
                  )}

                  <h2 className="text-xl font-bold mt-2 group-hover:text-blue-700 line-clamp-2">
                    {post.title}
                  </h2>

                  {post.publishedAt && (
                    <p className="text-gray-500 text-sm mt-3">
                      {new Date(post.publishedAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
