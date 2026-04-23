// lib/sanity/youtube.ts
export const getYoutubeID = (url: string) => {
  if (!url) return null;
  // Regex sakti untuk menangkap ID dari link pendek (youtu.be) atau link panjang (?v=)
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : null;
};

export const getYoutubeThumb = (url: string) => {
  const id = getYoutubeID(url);
  // Gunakan hqdefault agar gambar PASTI muncul dan tidak abu-abu lagi
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : "/og-image.jpg";
};