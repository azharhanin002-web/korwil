'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ChevronDown, Headset, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // State untuk pencarian
  
  const pathname = usePathname();
  const router = useRouter();

  // Fungsi untuk menjalankan pencarian
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    // Arahkan ke halaman search
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false); // Tutup menu mobile jika sedang terbuka
  };

  const navigation = [
    { name: 'Beranda', href: '/' },
    { 
      name: 'Profil', 
      href: '#', 
      children: [
        { name: 'Data Sekolah', href: '/sekolah' },
        { name: 'Visi & Misi', href: '/profil' },
      ] 
    },
    { 
      name: 'Berita', 
      href: '#', 
      children: [
        { name: 'Berita Dinas', href: '/berita' },
        { name: 'Pengumuman', href: '/pengumuman' },
      ]
    },
    { 
      name: 'Dokumen', 
      href: '#', 
      children: [
        { name: 'Surat Edaran', href: '/dokumen/se' },
        { name: 'Unduhan', href: '/dokumen/unduhan' },
      ]
    },
    { name: 'Artikel', href: '/artikel' },
    { name: 'PGRI', href: '/pgri' },
    { name: 'Pramuka', href: '/pramuka' },
  ];

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <header className="w-full font-sans shadow-md sticky top-0 z-50">
      
      {/* ================= ATAS: GRADIENT LOGO & SEARCH ================= */}
      <div className="bg-gradient-to-r from-[#0060af] via-[#004d91] to-[#002855] text-white py-3 md:py-4">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* 1. Logo Section */}
            <Link href="/" className="flex items-center gap-3 shrink-0 self-start md:self-auto">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg" 
                alt="Logo Tut Wuri" 
                className="w-10 h-10 md:w-14 md:h-14 drop-shadow-md"
              />
              <div className="leading-tight">
                <h1 className="text-lg md:text-2xl font-bold tracking-wide text-white drop-shadow-sm uppercase">
                  Korwilcam Dindik
                </h1>
                <p className="text-xs md:text-sm font-medium text-yellow-400 tracking-wider uppercase">
                  Purwokerto Barat
                </p>
              </div>
            </Link>

            {/* 2. Search Bar Desktop */}
            <form 
              onSubmit={handleSearch}
              className="w-full md:max-w-xl flex-1 mx-4 hidden md:block"
            >
              <div className="relative w-full">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Pencarian Berita / Dokumen..." 
                  className="w-full pl-4 pr-10 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:bg-white focus:text-gray-900 focus:ring-2 focus:ring-yellow-400 transition-all text-sm backdrop-blur-sm"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#004d91] transition-colors">
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* 3. Branding Tags */}
            <div className="hidden lg:flex flex-col items-end shrink-0 gap-1">
               <span className="bg-white/10 border border-white/20 rounded px-2 py-0.5 text-[10px] font-bold italic text-yellow-300">
                 #MerdekaBelajar
               </span>
               <span className="bg-white/10 border border-white/20 rounded px-2 py-0.5 text-[10px] font-bold text-white flex items-center gap-1">
                 Banyumas Berbudaya
               </span>
            </div>

            {/* Tombol Menu Mobile */}
            <button 
              className="md:hidden absolute right-4 top-4 p-2 text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

          </div>
          
          {/* Search Bar Mobile */}
          <form onSubmit={handleSearch} className="mt-3 md:hidden w-full relative">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berita..." 
                className="w-full pl-4 pr-10 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:bg-white focus:text-gray-900 text-sm"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-300">
                <Search size={16} />
              </button>
          </form>
        </div>
      </div>

      {/* ================= BAWAH: NAVIGASI MENU ================= */}
      <div className="bg-[#002040] text-white border-t border-white/10 shadow-lg">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-12">
            
            <nav className="hidden md:flex items-center gap-1 flex-wrap">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  {item.children ? (
                    <>
                      <button className="flex items-center gap-1 px-3 py-3 text-sm font-medium hover:text-yellow-400 hover:bg-white/5 transition-colors rounded-t-md group-hover:bg-[#00152b]">
                        {item.name}
                        <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                      </button>
                      {/* Dropdown Desktop */}
                      <div className="absolute left-0 top-full pt-0 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="bg-[#00152b] border-t-2 border-yellow-400 shadow-xl rounded-b-md overflow-hidden py-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className="block px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 hover:text-yellow-400 transition-colors"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link 
                      href={item.href} 
                      className={`px-3 py-3 text-sm font-medium hover:text-yellow-400 hover:bg-white/5 transition-colors whitespace-nowrap ${
                        pathname === item.href ? 'text-yellow-400 border-b-2 border-yellow-400' : ''
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>

            <Link 
              href="https://wa.me/6282134464499" 
              className="hidden md:flex bg-yellow-500 text-[#002040] px-4 py-1.5 rounded-full text-xs font-bold items-center gap-2 hover:bg-yellow-400 transition-colors shadow-md"
            >
              <Headset size={14} />
              <span className="uppercase tracking-wide">Hubungi Kami</span>
            </Link>

          </div>
        </div>
      </div>

      {/* ================= MOBILE MENU OVERLAY ================= */}
      {isOpen && (
        <div className="md:hidden bg-[#00152b] border-t border-gray-700 text-white max-h-[calc(100vh-140px)] overflow-y-auto">
          <div className="flex flex-col p-4 space-y-2">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <>
                    <button 
                      onClick={() => toggleDropdown(item.name)}
                      className="flex items-center justify-between w-full px-4 py-3 text-sm font-bold uppercase hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10"
                    >
                      {item.name}
                      <ChevronDown size={16} className={`transition-transform ${activeDropdown === item.name ? 'rotate-180 text-yellow-400' : ''}`} />
                    </button>
                    {activeDropdown === item.name && (
                      <div className="bg-black/20 rounded-lg mt-1 overflow-hidden">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            onClick={() => setIsOpen(false)}
                            className="block px-8 py-3 text-sm text-gray-400 hover:text-yellow-400 hover:bg-white/5 border-l-2 border-transparent hover:border-yellow-400"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-sm font-bold uppercase hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </header>
  );
}