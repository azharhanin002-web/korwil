'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { urlFor } from '../lib/sanity/image'; 

// Definisikan Tipe Data Props
interface SliderProps {
  data: {
    _id: string;
    title: string;
    publishedAt: string;
    mainImage: any;
    slug: any; 
  }[];
}

export default function HeroSlider({ data }: SliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide setiap 5 detik - VERSI FIX ANTI-CRASH
  useEffect(() => {
    // Validasi agar tidak jalan jika data kosong atau hanya 1
    if (!data || data.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === data.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [data]); // Dependensi konstan

  // Jika data kosong atau belum ada, tampilkan placeholder agar tidak error render
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[500px] bg-[#00152b] flex items-center justify-center text-white">
        <div className="text-center">
          <p className="italic text-gray-500 text-sm">Belum ada berita headline (isHeadline) di Sanity.</p>
        </div>
      </div>
    );
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentSlide = data[currentIndex];

  // Helper fungsi untuk handle slug (MENCEGAH /berita/undefined)
  const getSlugValue = (slide: any) => {
    if (!slide) return '';
    // Cek jika slug sudah berbentuk string dari kueri alias
    if (typeof slide.slug === 'string') return slide.slug;
    // Cek jika slug masih berbentuk objek Sanity
    return slide.slug?.current || '';
  };

  return (
    <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden group bg-gray-900">
      
      {/* 1. LAYER GAMBAR BACKGROUND */}
      {data.map((slide, index) => (
        <div
          key={slide._id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {slide.mainImage ? (
             <img 
               src={urlFor(slide.mainImage).width(1600).quality(90).url()} 
               alt={slide.title} 
               className="w-full h-full object-cover"
             />
          ) : (
             <div className="w-full h-full bg-gradient-to-br from-[#004d91] to-[#00152b]" />
          )}
          
          {/* Overlay Gradasi Hitam (Agar teks terbaca jelas) */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#00152b] via-[#00152b]/40 to-transparent opacity-90"></div>
        </div>
      ))}

      {/* 2. LAYER KONTEN TEKS */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 pb-20 z-20">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-4xl text-white">
            
            {/* Tag / Tanggal */}
            <div className="flex items-center gap-3 mb-4" suppressHydrationWarning>
              <span className="bg-yellow-500 text-blue-900 text-[10px] font-black px-3 py-1 rounded-md uppercase tracking-widest shadow-lg">
                Headline
              </span>
              <p className="text-xs md:text-sm font-bold text-gray-300">
                {new Date(currentSlide.publishedAt).toLocaleDateString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                })}
              </p>
            </div>
            
            {/* Judul Besar */}
            <h2 className="text-2xl md:text-5xl font-black leading-[1.1] mb-8 drop-shadow-2xl uppercase tracking-tight">
              {currentSlide.title}
            </h2>
            
            {/* Tombol Baca - FIX UNDEFINED */}
            <Link 
              href={`/berita/${getSlugValue(currentSlide)}`} 
              className="inline-flex items-center gap-3 bg-white text-blue-900 px-8 py-4 rounded-full font-black text-xs hover:bg-yellow-400 hover:scale-105 transition-all shadow-2xl active:scale-95 uppercase tracking-widest"
            >
              Baca Selengkapnya
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. NAVIGASI DOTS */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {data.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-500 rounded-full shadow-lg ${
              currentIndex === index 
                ? 'w-12 h-2.5 bg-yellow-400' 
                : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
            }`}
            aria-label={`Ke slide ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
}