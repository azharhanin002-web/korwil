import Link from "next/link";
import Image from "next/image";
import { client } from "@/lib/sanity/client";
import { getYoutubeThumb } from "@/lib/youtube"; // Pastikan path ini benar
import { 
  Video, 
  PlayCircle, 
  Calendar, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  MonitorPlay
} from "lucide-react";

// --- KONFIGURASI ---
const VIDEOS_PER_PAGE = 6; 

interface VideoPost {
  _id: string;
  title: string;
  slug: { current: string };
  videoUrl: string;
  publishedAt: string;
  views?: number;
  category: string;
}

// 1. FUNGSI AMBIL DATA VIDEO (Filter Kategori: Video)
async function getVideoData(page: number) {
  const start = (page - 1) * VIDEOS_PER_PAGE;
  const end = start + VIDEOS_PER_PAGE;

  const query = `{
    "videos": *[_type == "post" && category == "Video" && defined(slug.current)] | order(publishedAt desc) [${start}...${end}] {
      _id,
      title,
      slug,
      videoUrl,
      publishedAt,
      views,
      category
    },
    "total": count(*[_type == "post" && category == "Video" && defined(slug.current)])
  }`;

  try {
    const data = await client.fetch(query);
    return data;
  } catch (error) {
    console.error("Sanity fetch error:", error);
    return { videos: [], total: 0 };
  }
}

export default async function VideoPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = Math.max(1, parseInt(page || "1"));
  
  const { videos, total } = await getVideoData(currentPage);
  const totalPages = Math.ceil(total / VIDEOS_PER_PAGE);

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* --- HERO SECTION KHUSUS VIDEO --- */}
      <div className="bg-slate-900 pt-32 pb-20 px-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-3 bg-blue-600/20 text-blue-400 px-4 py-2 rounded-full border border-blue-500/30 mb-6 backdrop-blur-md">
            <MonitorPlay size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Galeri Dokumentasi</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-6 leading-none">
            VIDEO <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-8">KEGIATAN</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            Kumpulan dokumentasi visual kegiatan pendidikan, kepramukaan, dan PGRI di lingkungan Korwilcam Purwokerto Barat.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 -mt-10">
        {videos.length === 0 ? (
          <div className="bg-white py-40 text-center rounded-[3rem] shadow-xl border border-slate-100">
            <Video size={64} className="mx-auto text-slate-200 mb-6" />
            <p className="text-slate-300 font-black uppercase tracking-widest italic text-xl">
              Belum ada video dokumentasi.
            </p>
          </div>
        ) : (
          <>
            {/* GRID VIDEO */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {videos.map((item: VideoPost) => (
                <Link
                  href={`/berita/${item.slug.current}`}
                  key={item._id}
                  className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 border border-slate-100"
                >
                  {/* THUMBNAIL AREA */}
                  <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={getYoutubeThumb(item.videoUrl)}
                      alt={item.title}
                      fill
                      className="object-cover transition duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    />
                    
                    {/* Play Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-xl p-5 rounded-full border border-white/40 shadow-2xl transform transition-all duration-500 group-hover:scale-125 group-hover:bg-blue-600/90 group-hover:border-blue-400">
                        <PlayCircle size={48} className="text-white fill-white/10 group-hover:fill-white/30" />
                      </div>
                    </div>

                    <div className="absolute bottom-5 left-5 right-5 flex justify-between items-center">
                       <span className="bg-red-600 text-white text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-xl">
                          LIVE DOC
                       </span>
                    </div>
                  </div>

                  {/* KONTEN */}
                  <div className="p-8">
                    <h2 className="text-xl font-black text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 uppercase tracking-tight leading-tight mb-6">
                      {item.title}
                    </h2>

                    <div className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-6">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-blue-600" />
                        <span suppressHydrationWarning>
                          {new Date(item.publishedAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye size={14} className="text-blue-600" />
                        <span>{item.views || 0} TAYANGAN</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* --- NAVIGASI PAGINATION --- */}
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-3">
                {currentPage > 1 ? (
                  <Link
                    href={`/video?page=${currentPage - 1}`}
                    className="w-14 h-14 flex items-center justify-center rounded-3xl bg-white border border-slate-200 text-slate-600 hover:bg-blue-600 hover:text-white transition-all shadow-md group"
                  >
                    <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <div className="w-14 h-14 flex items-center justify-center rounded-3xl bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed">
                    <ChevronLeft size={24} />
                  </div>
                )}

                <div className="flex gap-3">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === currentPage;
                    return (
                      <Link
                        key={pageNum}
                        href={`/video?page=${pageNum}`}
                        className={`w-14 h-14 flex items-center justify-center rounded-3xl font-black transition-all duration-500 ${
                          isActive
                            ? "bg-blue-600 text-white shadow-2xl shadow-blue-200 scale-110"
                            : "bg-white border border-slate-200 text-slate-400 hover:border-blue-600 hover:text-blue-600"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    );
                  })}
                </div>

                {currentPage < totalPages ? (
                  <Link
                    href={`/video?page=${currentPage + 1}`}
                    className="w-14 h-14 flex items-center justify-center rounded-3xl bg-white border border-slate-200 text-slate-600 hover:bg-blue-600 hover:text-white transition-all shadow-md group"
                  >
                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <div className="w-14 h-14 flex items-center justify-center rounded-3xl bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed">
                    <ChevronRight size={24} />
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}