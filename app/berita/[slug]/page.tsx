import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { PortableText } from "@portabletext/react";
import Image from "next/image";

export const revalidate = 0;

interface Post {
  title: string;
  mainImage?: any;
  publishedAt?: string;
  body: any;
  author?: string;
}

async function getDetailBerita(slug: string): Promise<Post | null> {
  const query = `
    *[_type == "post" && slug.current == $slug][0]{
      title,
      mainImage,
      publishedAt,
      body,
      "author": author->name
    }
  `;

  const data = await client.fetch(query, { slug });
  return data ?? null;
}

export default async function DetailBerita({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // ⬇️ WAJIB di Next 16
  const { slug } = await params;

  const post = await getDetailBerita(slug);

  if (!post) {
    return (
      <div className="text-center p-20">
        <h1 className="text-2xl font-bold">
          Berita tidak ditemukan.
        </h1>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto p-5 py-10">
      <h1 className="text-4xl font-bold mb-6">
        {post.title}
      </h1>

      {post.mainImage && (
        <div className="relative h-[400px] w-full mb-8">
          <Image
            src={urlFor(post.mainImage).url()}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <PortableText value={post.body} />
    </article>
  );
}
