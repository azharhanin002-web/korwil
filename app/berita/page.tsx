import Link from "next/link";
import Image from "next/image";
import { client } from "@/lib/sanity/client";
import { urlFor } from "@/lib/sanity/image";
import { getYoutubeThumb } from "@/lib/youtube";
import { 
  PlayCircle, 
  Newspaper, 
  Calendar, 
  Eye, 
  ChevronLeft, 
  ChevronRight 
} from "lucide-react";

// --- KONFIGURASI ---
const POSTS_PER_PAGE = 6; // Ubah angka ini sesuai selera gaes

interface Post {
  _id: string;
  title: string;
  slug: { current: string };
  mainImage?: any;
  videoUrl?: string;
  publishedAt?: string;
  category?: string;
  views?: number;
}

// 1. FUNGSI AMBIL DATA DENGAN PAGINATION
async function getBerita(page: number) {
  const start = (page - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  const query = `{
    "posts": *[_type == "post" && defined(slug.current)] | order(publishedAt desc) [${start}...${end}] {
      _id,
      title,
      slug,
      mainImage,
      videoUrl,
      publishedAt,
      category,
      views
    },
    "total": count(*[_type == "post" && defined(slug.current)])
  }`;

  try {
    const data = await client.fetch(query);
    return data;
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return { posts: [], total: 0 };
  }
}

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // Ambil halaman saat ini dari URL, default ke 1
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1"));
  
  const { posts, total } = await getBerita(currentPage);
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  const getSafeImage = (post: Post) => {
    if (post.category === "Video" && post.videoUrl) {
      return getYoutubeThumb(post.videoUrl);
    }
    if (post.mainImage?.asset) {
      return urlFor(post.mainImage).url();
    }
    return "/og-image.jpg"; 
  };

  return (
    <div className="bg-gray-50/50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto p-5">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pt-10">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-xl shadow-blue-100">
              <Newspaper size={28} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-tighter">
                Berita & Artikel
              </h1>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">
                Halaman {currentPage} dari {totalPages}
              </p>
            </div>
          </div>
        </div>

        {posts.length === 0 ? (
          <div className="py-40 text-center border-2 border-dashed border-slate-200 rounded-[3rem] bg-white">
            <p className="text-slate-300 font-black uppercase tracking-widest italic text-xl">
              Belum ada berita di halaman ini.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post: Post) => {
                const isVideo = post.category === "Video";
                return (
                  <Link
                    href={`/berita/${post.slug.current}`}
                    key={post._id}
                    className="group flex flex-col h-full bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100"
                  >
                    <div className="relative h-56 w-full bg-slate-200 overflow-hidden">
                      <Image
                        src={getSafeImage(post)}
                        alt={post.title}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-5 left-5">
                        <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase shadow-lg tracking-widest text-white ${isVideo ? 'bg-red-600' : 'bg-blue-600'}`}>
                          {post.category || 'Umum'}
                        </span>
                      </div>
                      {isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-all">
                          <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 shadow-2xl">
                            <PlayCircle size={40} className="text-white fill-white/20" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-7 flex flex-col flex-1">
                      <h2 className="text-xl font-extrabold text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 uppercase tracking-tight leading-snug mb-6">
                        {post.title}
                      </h2>
                      <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-blue-600" />
                          <span suppressHydrationWarning>
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }) : '-'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Eye size={14} className="text-blue-600" />
                          <span>{post.views || 0} hits</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* --- NAVIGASI PAGINATION --- */}
            <div className="mt-16 flex justify-center items-center gap-2">
              {/* Tombol Sebelumnya */}
              {currentPage > 1 ? (
                <Link
                  href={`/berita?page=${currentPage - 1}`}
                  className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                >
                  <ChevronLeft size={20} />
                </Link>
              ) : (
                <div className="p-4 rounded-2xl bg-gray-100 text-gray-300 border border-gray-200 cursor-not-allowed">
                  <ChevronLeft size={20} />
                </div>
              )}

              {/* Nomor Halaman */}
              <div className="flex gap-2 mx-4">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = pageNum === currentPage;

                  return (
                    <Link
                      key={pageNum}
                      href={`/berita?page=${pageNum}`}
                      className={`w-12 h-12 flex items-center justify-center rounded-2xl font-black transition-all ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                          : "bg-white border border-slate-200 text-slate-400 hover:border-blue-600 hover:text-blue-600"
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>

              {/* Tombol Berikutnya */}
              {currentPage < totalPages ? (
                <Link
                  href={`/berita?page=${currentPage + 1}`}
                  className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                >
                  <ChevronRight size={20} />
                </Link>
              ) : (
                <div className="p-4 rounded-2xl bg-gray-100 text-gray-300 border border-gray-200 cursor-not-allowed">
                  <ChevronRight size={20} />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}