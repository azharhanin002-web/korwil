import React from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Headset } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full font-sans shadow-md">
      {/* ================= ATAS: GRADIENT LOGO & SEARCH ================= */}
      {/* Gradient disesuaikan dengan warna biru Kemendikdasmen */}
      <div className="bg-gradient-to-r from-[#0060af] via-[#004d91] to-[#002855] text-white py-3 md:py-5">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">
            
            {/* 1. Logo Section */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Logo Tut Wuri Handayani (Gunakan Image Next.js jika ada file lokal) */}
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg" 
                alt="Logo Kemendikdasmen" 
                className="w-12 h-12 md:w-14 md:h-14 drop-shadow-md"
              />
              <div className="leading-tight">
                {/* Teks dimiripkan dengan gambar */}
                <h1 className="text-xl md:text-2xl font-bold tracking-wide text-yellow-400 drop-shadow-sm">
                  Kemendikdasmen
                </h1>
              </div>
            </div>

            {/* 2. Search Bar Section (Lebar penuh di mobile, fleksibel di desktop) */}
            <div className="w-full md:max-w-3xl flex-1">
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="Pencarian Kata Kunci" 
                  className="w-full pl-5 pr-12 py-2.5 rounded-md bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-sm"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-600 hover:text-blue-700 transition-colors">
                  <Search size={20} />
                </button>
              </div>
            </div>

            {/* 3. Right Side Branding (Campaigns) */}
            <div className="hidden lg:flex items-center gap-4 shrink-0">
               {/* Mockup untuk gambar branding kanan atas */}
               <div className="flex flex-col items-end">
                  <div className="flex gap-2">
                    {/* Placeholder visual untuk #PendidikanBermutu */}
                    <span className="bg-white/10 border border-white/20 rounded px-2 py-1 text-[10px] font-bold italic text-yellow-300">
                      #PendidikanBermutu
                    </span>
                    {/* Placeholder visual untuk Rumah Pendidikan */}
                    <span className="bg-white/10 border border-white/20 rounded px-2 py-1 text-[10px] font-bold flex items-center gap-1">
                      Rumah Pendidikan
                    </span>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>

      {/* ================= BAWAH: NAVIGASI MENU ================= */}
      <div className="bg-[#002040] text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-12">
            
            {/* Menu Links */}
            <nav className="flex items-center gap-6 md:gap-8 text-sm font-medium overflow-x-auto no-scrollbar">
              <Link href="/" className="hover:text-yellow-400 transition-colors whitespace-nowrap">
                Beranda
              </Link>
              
              <div className="group relative flex items-center gap-1 cursor-pointer hover:text-yellow-400 whitespace-nowrap">
                <span>Profil</span>
                <ChevronDown size={14} />
                {/* Dropdown menu bisa ditambahkan di sini */}
              </div>

              <div className="group relative flex items-center gap-1 cursor-pointer hover:text-yellow-400 whitespace-nowrap">
                <span>Publikasi</span>
                <ChevronDown size={14} />
              </div>

              <Link href="#" className="hover:text-yellow-400 transition-colors whitespace-nowrap">
                PPID
              </Link>
            </nav>

            {/* Tombol Hubungi Kami */}
            <Link 
              href="https://wa.me/6282134464499" 
              className="hidden md:flex bg-white text-[#002040] px-4 py-1.5 rounded text-xs md:text-sm font-bold items-center gap-2 hover:bg-gray-100 transition-colors shadow-sm"
            >
              <Headset size={16} />
              Hubungi Kami
            </Link>

          </div>
        </div>
      </div>
    </header>
  );
}