// components/YouTubePlayer.tsx
import { getYoutubeID } from "@/lib/youtube";

export default function YouTubePlayer({ value }: any) {
  const url = value?.url;
  const id = getYoutubeID(url);
  if (!id) return null;

  const embedUrl = `https://www.youtube.com/embed/${id}`;

  return (
    <div className="my-10">
      <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-100 bg-slate-900">
        <iframe
          src={embedUrl}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full"
        ></iframe>
      </div>
      <p className="text-center text-[10px] text-slate-400 mt-3 uppercase tracking-widest font-black">
        🎥 Dokumentasi Video Korwilcam
      </p>
    </div>
  );
}