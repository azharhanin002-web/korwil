import Link from "next/link";
import Image from "next/image";
import { client } from "@/lib/sanity/client";
import { getYoutubeThumb } from "@/lib/youtube"; // Path resmi sesuai instruksi
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

// 1. FUNGSI AMBIL DATA VIDEO
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
    const data = await client.fetch(query, { useCdn: false });
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
    <div className="bg-white min-h-screen pb-24">
      {/* --- HERO SECTION DENGAN BACKGROUND CAMERA.JPG --- */}
      <div className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Background Image */}
        <Image 
            src="/camera.jpg" 
            alt="Background Camera" 
            fill 
            priority
            className="object-cover object-center opacity-40 scale-105 transition-transform duration-[10s] hover:scale-100"
        />
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-white"></div>

        {/* Hero Content */}
        <div className="max-w-4xl mx-auto relative z-10 px-5 text-center pt-20">
          <div className="inline-flex items-center gap-3 bg-blue-600/20 text-blue-400 px-5 py-2.5 rounded-full border border-blue-400/30 mb-8 backdrop-blur-xl animate-fade-in">
            <MonitorPlay size={20} className="animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-[0.4em]">Sinema Pendidikan</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-8 leading-none drop-shadow-2xl">
            GALERI <span className="text-blue-500 italic">VIDEO</span>
          </h1>
          
          <p className="text-slate-200 text-sm md:text-lg max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
            Rekam jejak digital inovasi pendidikan Korwilcam Purwokerto Barat dalam bentuk audio visual premium.
          </p>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="max-w-7xl mx-auto px-5 -mt-20 relative z-20">
        {videos.length === 0 ? (
          <div className="bg-white py-40 text-center rounded-[3rem] shadow-2xl border border-slate-100">
            <Video size={64} className="mx-auto text-slate-200 mb-6" />
            <p className="text-slate-300 font-black uppercase tracking-widest italic text-xl text-shadow">
              Belum ada video dokumentasi.
            </p>
          </div>
        ) : (
          <>
            {/* GRID VIDEO SULTAN */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
              {videos.map((item: VideoPost) => (
                <Link
                  href={`/berita/${item.slug.current}`}
                  key={item._id}
                  className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 border border-slate-50 relative"
                >
                  {/* THUMBNAIL AREA */}
                  <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={getYoutubeThumb(item.videoUrl)}
                      alt={item.title}
                      fill
                      className="object-cover transition duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    />
                    
                    {/* Play Overlay Sultan */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/10 backdrop-blur-md p-6 rounded-full border border-white/30 shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:bg-blue-600 group-hover:border-blue-400">
                        <PlayCircle size={48} className="text-white fill-white/10 group-hover:fill-white/20" />
                      </div>
                    </div>

                    <div className="absolute top-5 left-5">
                       <span className="bg-blue-600 text-white text-[9px] font-black px-4 py-1.5 rounded-lg uppercase tracking-widest shadow-lg border border-blue-400">
                         DOCUMENTARY
                       </span>
                    </div>
                  </div>

                  {/* KONTEN */}
                  <div className="p-8 flex flex-col flex-1 bg-white">
                    <h2 className="text-xl font-black text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 uppercase tracking-tight leading-snug mb-8">
                      {item.title}
                    </h2>

                    <div className="mt-auto flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-6">
                      <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full">
                        <Calendar size={14} className="text-blue-600" />
                        <span suppressHydrationWarning>
                          {new Date(item.publishedAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full">
                        <Eye size={14} />
                        <span>{item.views || 0} HITS</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* --- PAGINATION SULTAN --- */}
            {totalPages > 1 && (
              <div className="mt-24 flex justify-center items-center gap-4">
                {currentPage > 1 ? (
                  <Link
                    href={`/video?page=${currentPage - 1}`}
                    className="w-16 h-16 flex items-center justify-center rounded-full bg-white border border-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white hover:shadow-xl hover:shadow-blue-200 transition-all group"
                  >
                    <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-slate-50 text-slate-200 border border-slate-100 cursor-not-allowed">
                    <ChevronLeft size={28} />
                  </div>
                )}

                <div className="flex gap-3 bg-slate-100 p-2 rounded-full border border-slate-200">
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === currentPage;
                    return (
                      <Link
                        key={pageNum}
                        href={`/video?page=${pageNum}`}
                        className={`w-12 h-12 flex items-center justify-center rounded-full text-xs font-black transition-all duration-500 ${
                          isActive
                            ? "bg-white text-blue-600 shadow-lg scale-110"
                            : "text-slate-400 hover:text-blue-600"
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
                    className="w-16 h-16 flex items-center justify-center rounded-full bg-white border border-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white hover:shadow-xl hover:shadow-blue-200 transition-all group"
                  >
                    <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-slate-50 text-slate-200 border border-slate-100 cursor-not-allowed">
                    <ChevronRight size={28} />
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