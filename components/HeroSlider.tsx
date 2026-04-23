'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, PlayCircle, Calendar } from 'lucide-react';
import Link from 'next/link';
import { urlFor } from '../lib/sanity/image'; 
import { getYoutubeThumb } from '../lib/youtube'; // Import helper sakti kita

// Definisikan Tipe Data Props
interface SliderProps {
  data: {
    _id: string;
    title: string;
    publishedAt: string;
    mainImage: any;
    slug: any; 
    category?: string; // Tambahkan kategori
    videoUrl?: string; // Tambahkan videoUrl
  }[];
}

export default function HeroSlider({ data }: SliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide setiap 5 detik
  useEffect(() => {
    if (!data || data.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === data.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [data]);

  // Jika data kosong
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[500px] bg-slate-900 flex items-center justify-center text-white">
        <p className="italic text-slate-500 text-sm">Belum ada berita headline untuk ditampilkan.</p>
      </div>
    );
  }

  // --- HELPER: AMBIL GAMBAR AMAN (Mencegah Error Resolve URL) ---
  const getSliderImage = (slide: any) => {
    // 1. Jika kategori Video, ambil thumbnail YouTube
    if (slide.category === "Video" && slide.videoUrl) {
      return getYoutubeThumb(slide.videoUrl);
    }
    // 2. Jika ada asset gambar Sanity, gunakan urlFor
    if (slide.mainImage?.asset) {
      return urlFor(slide.mainImage).width(1600).quality(90).url();
    }
    // 3. Fallback jika semua kosong
    return "/og-image.jpg";
  };

  const getSlugValue = (slide: any) => {
    if (!slide) return '';
    if (typeof slide.slug === 'string') return slide.slug;
    return slide.slug?.current || '';
  };

  const goToSlide = (index: number) => setCurrentIndex(index);
  const currentSlide = data[currentIndex];

  return (
    <div className="relative w-full h-[550px] md:h-[700px] overflow-hidden group bg-slate-900 font-sans">
      
      {/* 1. LAYER GAMBAR (BACKDROP) */}
      {data.map((slide, index) => (
        <div
          key={slide._id}
          className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform ${
            index === currentIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-110 z-0'
          }`}
        >
          <img 
            src={getSliderImage(slide)} 
            alt={slide.title} 
            className="w-full h-full object-cover"
          />
          
          {/* Efek Overlay Gradasi Cinematic */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
          
          {/* Logo Play Center Jika Video */}
          {slide.category === "Video" && index === currentIndex && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-full border border-white/20 shadow-2xl animate-pulse">
                <PlayCircle size={80} className="text-white opacity-80" />
              </div>
            </div>
          )}
        </div>
      ))}

      {/* 2. LAYER KONTEN TEKS */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 pb-24 z-20">
        <div className="container mx-auto max-w-7xl">
          <div className={`max-w-4xl text-white transition-all duration-700 transform ${data[currentIndex] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            {/* Badge Kategori & Tanggal */}
            <div className="flex items-center gap-4 mb-6" suppressHydrationWarning>
              <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-xl ${currentSlide.category === 'Video' ? 'bg-red-600' : 'bg-blue-600'}`}>
                {currentSlide.category === 'Video' ? '🎥 Video' : (currentSlide.category || 'Headline')}
              </span>
              <div className="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-300 uppercase tracking-widest">
                <Calendar size={14} className="text-blue-400" />
                {new Date(currentSlide.publishedAt).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </div>
            </div>
            
            {/* Judul Headline */}
            <h2 className="text-3xl md:text-6xl font-black leading-[0.95] mb-10 drop-shadow-2xl uppercase tracking-tighter italic">
              {currentSlide.title}
            </h2>
            
            {/* Tombol Aksi */}
            <Link 
              href={`/berita/${getSlugValue(currentSlide)}`} 
              className="inline-flex items-center gap-4 bg-white text-slate-900 px-10 py-4 rounded-full font-black text-xs hover:bg-blue-600 hover:text-white transition-all shadow-2xl hover:scale-105 active:scale-95 uppercase tracking-[0.2em]"
            >
              Eksplor Berita
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. NAVIGASI DOTS (Modern Style) */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-30">
        {data.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-500 rounded-full ${
              currentIndex === index 
                ? 'w-16 h-1.5 bg-blue-500 shadow-lg shadow-blue-500/50' 
                : 'w-3 h-1.5 bg-white/20 hover:bg-white/50'
            }`}
            aria-label={`Ke slide ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
}