'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, PlayCircle, Calendar } from 'lucide-react';
import Link from 'next/link';
import { urlFor } from '../lib/sanity/image'; 
import { getYoutubeThumb } from '../lib/youtube'; // Pastikan path ini benar

// Definisikan Tipe Data Props
interface SliderProps {
  data: {
    _id: string;
    title: string;
    publishedAt: string;
    mainImage: any;
    slug: any; 
    category?: string;
    videoUrl?: string;
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

  // --- HELPER: AMBIL GAMBAR AMAN ---
  const getSliderImage = (slide: any) => {
    if (slide.category === "Video" && slide.videoUrl) {
      return getYoutubeThumb(slide.videoUrl);
    }
    if (slide.mainImage?.asset) {
      return urlFor(slide.mainImage).width(1600).quality(90).url();
    }
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
    <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden group bg-slate-900 font-sans">
      
      {/* 1. LAYER GAMBAR (BACKDROP) */}
      {data.map((slide, index) => (
        <div
          key={slide._id}
          className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform ${
            index === currentIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
          }`}
        >
          <img 
            src={getSliderImage(slide)} 
            alt={slide.title} 
            className="w-full h-full object-cover"
          />
          
          {/* Efek Overlay Gradasi (Dibuat sedikit lebih gelap di bawah agar teks tetap kontras) */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent"></div>
          
          {/* Logo Play Center Jika Video */}
          {slide.category === "Video" && index === currentIndex && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-full border border-white/20 shadow-2xl animate-pulse">
                <PlayCircle size={60} className="text-white opacity-80" />
              </div>
            </div>
          )}
        </div>
      ))}

      {/* 2. LAYER KONTEN TEKS */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-16 pb-20 z-20">
        <div className="container mx-auto max-w-7xl">
          <div className={`max-w-3xl text-white transition-all duration-700 transform ${data[currentIndex] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            
            {/* Badge Kategori & Tanggal */}
            <div className="flex items-center gap-4 mb-4" suppressHydrationWarning>
              <span className={`text-[9px] font-black px-3 py-1 rounded-md uppercase tracking-[0.2em] shadow-xl ${currentSlide.category === 'Video' ? 'bg-red-600' : 'bg-blue-600'}`}>
                {currentSlide.category === 'Video' ? '🎥 Video' : (currentSlide.category || 'Headline')}
              </span>
              <div className="flex items-center gap-2 text-[10px] md:text-xs font-bold text-slate-300 uppercase tracking-widest">
                <Calendar size={12} className="text-blue-400" />
                {new Date(currentSlide.publishedAt).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
              </div>
            </div>
            
            {/* Judul Headline (SUDAH DIKECILKAN) */}
            <h2 className="text-2xl md:text-4xl font-black leading-tight mb-6 drop-shadow-lg uppercase tracking-tight italic">
              {currentSlide.title}
            </h2>
            
            {/* Tombol Aksi */}
            <Link 
              href={`/berita/${getSlugValue(currentSlide)}`} 
              className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-3.5 rounded-full font-black text-[10px] hover:bg-blue-600 hover:text-white transition-all shadow-xl hover:scale-105 active:scale-95 uppercase tracking-[0.2em]"
            >
              Baca Berita
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. NAVIGASI DOTS */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-3 z-30">
        {data.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-500 rounded-full ${
              currentIndex === index 
                ? 'w-12 h-1 bg-blue-500 shadow-lg shadow-blue-500/50' 
                : 'w-2 h-1 bg-white/20 hover:bg-white/50'
            }`}
            aria-label={`Ke slide ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
}