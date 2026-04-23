// components/YouTubePlayer.tsx
export default function YouTubePlayer({ value }: any) {
  const { url } = value;
  if (!url) return null;

  // Ambil ID video dari URL
  const id = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();

  return (
    <div className="my-10 relative aspect-video rounded-xl overflow-hidden shadow-2xl border-4 border-white ring-1 ring-slate-100">
      <iframe
        className="absolute inset-0 w-full h-full"
        src={`https://www.youtube.com/embed/${id}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}