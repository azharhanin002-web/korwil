import Link from "next/link";
import Image from "next/image";
import { client } from "@/lib/sanity/client";
import { getYoutubeThumb } from "@/lib/youtube";
import { 
  Video, 
  PlayCircle, 
  Calendar, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  MonitorPlay,
  Film
} from "lucide-react";
import { Metadata } from "next";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Galeri Video | Korwilcam Purwokerto Barat",
  description: "Rekam jejak digital dokumentasi kegiatan pendidikan di wilayah Purwokerto Barat."
};

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
    const data = await client.fetch(query, {}, { useCdn: false });
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
      {/* --- HERO SECTION --- */}
      <div className="relative h-[450px] md:h-[550px] flex items-center justify-center overflow-hidden bg-slate-900">
        <Image 
            src="/camera.jpg" 
            alt="Background Camera" 
            fill 
            priority
            className="object-cover object-center opacity-40 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-slate-900/20 to-white"></div>

        <div className="max-w-4xl mx-auto relative z-10 px-5 text-center">
          <div className="inline-flex items-center gap-3 bg-blue-600/20 text-blue-400 px-6 py-2 rounded-full border border-blue-400/30 mb-8 backdrop-blur-md">
            <MonitorPlay size={18} className="animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Sinema Pendidikan</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black text-white uppercase tracking-tighter mb-6 leading-none drop-shadow-2xl">
            WARTA <span className="text-blue-500 italic">VISUAL</span>
          </h1>
          
          <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto font-medium leading-relaxed uppercase tracking-widest opacity-80">
            Dokumentasi Inovasi & Kegiatan Terkini Purwokerto Barat
          </p>
        </div>
      </div>

      {/* --- CONTENT AREA --- */}
      <div className="max-w-7xl mx-auto px-5 -mt-16 relative z-20">
        {videos.length === 0 ? (
          <div className="bg-white py-32 text-center rounded-2xl shadow-xl border border-slate-100">
            <Video size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest italic">Belum ada video dokumentasi</p>
          </div>
        ) : (
          <>
            {/* GRID VIDEO */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {videos.map((item: VideoPost) => (
                <Link
                  href={`/berita/${item.slug.current}`}
                  key={item._id}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100 relative"
                >
                  <div className="relative aspect-video w-full bg-slate-800 overflow-hidden">
                    <Image
                      src={getYoutubeThumb(item.videoUrl)}
                      alt={item.title}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white/10 backdrop-blur-md p-5 rounded-full border border-white/20 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-blue-600">
                        <PlayCircle size={40} className="text-white fill-white/10" />
                      </div>
                    </div>

                    <div className="absolute top-4 left-4">
                       <span className="bg-blue-600 text-white text-[8px] font-black px-3 py-1 rounded uppercase tracking-widest shadow-lg">
                         HD CONTENT
                       </span>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h2 className="text-lg font-black text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-2 uppercase tracking-tight leading-tight mb-6">
                      {item.title}
                    </h2>

                    <div className="mt-auto flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest border-t border-slate-50 pt-5">
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-blue-600" />
                        <span suppressHydrationWarning>
                          {new Date(item.publishedAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                        <Eye size={12} />
                        <span>{item.views || 0} VIEWS</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* --- PAGINATION --- */}
            {totalPages > 1 && (
              <div className="mt-20 flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="flex items-center gap-3">
                  {currentPage > 1 ? (
                    <Link
                      href={`/video?page=${currentPage - 1}`}
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-blue-600 hover:text-white transition-all group shadow-sm"
                    >
                      <ChevronLeft size={20} />
                    </Link>
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-200 border border-slate-100 cursor-not-allowed">
                      <ChevronLeft size={20} />
                    </div>
                  )}

                  <div className="flex gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                    {[...Array(totalPages)].map((_, i) => {
                      const pageNum = i + 1;
                      const isActive = pageNum === currentPage;
                      return (
                        <Link
                          key={pageNum}
                          href={`/video?page=${pageNum}`}
                          className={`w-9 h-9 flex items-center justify-center rounded-lg text-[10px] font-black transition-all ${
                            isActive
                              ? "bg-[#002040] text-white shadow-md scale-105"
                              : "text-slate-400 hover:text-blue-600 hover:bg-white"
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
                      className="w-12 h-12 flex items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      <ChevronRight size={20} />
                    </Link>
                  ) : (
                    <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-50 text-slate-200 border border-slate-100 cursor-not-allowed">
                      <ChevronRight size={20} />
                    </div>
                  )}
                </div>
                
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                  Halaman {currentPage} dari {totalPages}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* --- FOOTER DECORATION --- */}
      <div className="mt-32 flex justify-center opacity-20 grayscale">
         <Film size={40} className="text-slate-300" />
      </div>
    </div>
  );
}