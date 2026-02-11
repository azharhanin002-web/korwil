'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

// --- PERBAIKAN IMPORT DI SINI ---
// Mengganti '@/lib/...' menjadi '../lib/...'
import { urlFor } from '../lib/sanity/image'; 

// Definisikan Tipe Data Props
interface SliderProps {
  data: {
    _id: string;
    title: string;
    publishedAt: string;
    mainImage: any;
    slug: { current: string };
  }[];
}

export default function HeroSlider({ data }: SliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Jika data kosong atau belum ada, tampilkan placeholder
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-[500px] bg-gray-900 flex items-center justify-center text-white">
        <p>Belum ada berita headline.</p>
      </div>
    );
  }

  // Auto slide setiap 5 detik
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === data.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, data.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const currentSlide = data[currentIndex];

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden group bg-gray-900">
      
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
               src={urlFor(slide.mainImage).width(1600).url()} 
               alt={slide.title} 
               className="w-full h-full object-cover"
             />
          ) : (
             <div className="w-full h-full bg-gray-800" />
          )}
          
          {/* Overlay Gradasi Hitam */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80"></div>
        </div>
      ))}

      {/* 2. LAYER KONTEN TEKS */}
      <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 pb-20 z-20">
        <div className="container mx-auto max-w-7xl">
          <div className="max-w-4xl text-white">
            {/* Tanggal */}
            <p className="text-sm md:text-base font-medium text-yellow-400 mb-2">
               {new Date(currentSlide.publishedAt).toLocaleDateString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
               })}
            </p>
            
            {/* Judul Besar */}
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 drop-shadow-md">
              {currentSlide.title}
            </h2>
            
            {/* Tombol Baca Lebih Lanjut */}
            <a href={`/berita/${currentSlide.slug.current}`} className="inline-flex items-center gap-2 text-white font-semibold hover:text-yellow-400 transition-colors border-b-2 border-transparent hover:border-yellow-400 pb-1">
              Baca lebih lanjut
              <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* 3. NAVIGASI DOTS */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-30">
        {data.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full shadow-sm ${
              currentIndex === index 
                ? 'w-8 h-2.5 bg-yellow-400' 
                : 'w-2.5 h-2.5 bg-white/50 hover:bg-white'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

    </div>
  );
}