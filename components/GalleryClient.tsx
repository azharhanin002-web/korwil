'use client';

import { useState } from 'react';
import { urlFor } from '@/lib/sanity/image';
import { X, Calendar, Tag, Maximize2 } from 'lucide-react';
import Image from 'next/image';

export default function GalleryClient({ items }: { items: any[] }) {
  const [selectedImg, setSelectedImg] = useState<any>(null);
  const [filter, setFilter] = useState('Semua');

  const categories = ['Semua', ...Array.from(new Set(items.map((i) => i.category)))];
  const filteredItems = filter === 'Semua' ? items : items.filter((i) => i.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* FILTER BUTTONS */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
              filter === cat 
              ? "bg-blue-600 text-white shadow-xl shadow-blue-200" 
              : "bg-white text-slate-400 hover:bg-slate-100"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* GRID LAYOUT */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredItems.map((item) => (
          <div 
            key={item._id}
            onClick={() => setSelectedImg(item)}
            className="relative group cursor-zoom-in break-inside-avoid rounded-[2rem] overflow-hidden bg-white border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500"
          >
            <div className="relative overflow-hidden">
              <img
                src={urlFor(item.mainImage).width(800).url()}
                alt={item.title}
                className="w-full h-auto object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                 <div className="bg-yellow-400 text-blue-900 w-10 h-10 rounded-full flex items-center justify-center mb-4 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                    <Maximize2 size={20} />
                 </div>
                 <h3 className="text-white font-black uppercase tracking-tight text-lg leading-tight transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                    {item.title}
                 </h3>
                 <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mt-2 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                    {item.category}
                 </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LIGHTBOX MODAL */}
      {selectedImg && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#00152b]/95 backdrop-blur-xl animate-in fade-in duration-300">
          <button 
            onClick={() => setSelectedImg(null)}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
          >
            <X size={40} />
          </button>
          
          <div className="max-w-5xl w-full flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 relative aspect-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10">
              <img
                src={urlFor(selectedImg.mainImage).width(1200).url()}
                className="w-full h-full object-contain"
                alt={selectedImg.title}
              />
            </div>
            <div className="md:w-80 text-white space-y-4">
               <span className="bg-yellow-400 text-blue-900 px-3 py-1 rounded-lg text-[10px] font-black uppercase">
                 {selectedImg.category}
               </span>
               <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">
                 {selectedImg.title}
               </h2>
               <div className="flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
                 <Calendar size={14} /> {new Date(selectedImg.publishedAt).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
               </div>
               <p className="text-sm text-white/70 leading-relaxed italic border-l-2 border-white/10 pl-4">
                 {selectedImg.description || "Dokumentasi kegiatan Korwilcam Purwokerto Barat."}
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}