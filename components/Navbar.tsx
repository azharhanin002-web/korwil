'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ChevronDown, Headset, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const pathname = usePathname();
  const router = useRouter();

  // Fungsi untuk menjalankan pencarian
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false); 
    setSearchQuery(''); // Reset input setelah cari
  };

  // Navigasi yang disesuaikan dengan folder proyek
  const navigation = [
    { name: 'Beranda', href: '/' },
    { 
      name: 'Profil', 
      href: '#', 
      children: [
        { name: 'Visi & Misi', href: '/profil/visi-misi' },
        { name: 'Struktur Organisasi', href: '/profil/struktur' },
        { name: 'Data Sekolah', href: '/sekolah' },
      ] 
    },
    { 
      name: 'Informasi', 
      href: '#', 
      children: [
        { name: 'Berita Dinas', href: '/berita' },
        { name: 'Pengumuman', href: '/pengumuman' },
        { name: 'Artikel Guru', href: '/artikel' },
      ]
    },
    { 
      name: 'Dokumen', 
      href: '#', 
      children: [
        { name: 'Surat Edaran', href: '/dokumen/se' },
        { name: 'Pusat Unduhan', href: '/dokumen/unduhan' },
      ]
    },
    { name: 'PGRI', href: '/pgri' },
    { name: 'Pramuka', href: '/pramuka' },
  ];

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <header className="w-full font-sans shadow-md sticky top-0 z-50">
      
      {/* ================= ATAS: LOGO & SEARCH ================= */}
      <div className="bg-gradient-to-r from-[#0060af] via-[#004d91] to-[#002855] text-white py-3">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* 1. Logo Section */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg" 
                alt="Logo Tut Wuri" 
                className="w-10 h-10 md:w-12 md:h-12 drop-shadow-md"
              />
              <div className="leading-tight">
                <h1 className="text-lg md:text-xl font-black tracking-tight text-white uppercase">
                  Korwilcam Dindik
                </h1>
                <p className="text-[10px] md:text-xs font-bold text-yellow-400 tracking-widest uppercase">
                  Purwokerto Barat
                </p>
              </div>
            </Link>

            {/* 2. Search Bar Desktop */}
            <form 
              onSubmit={handleSearch}
              className="w-full max-w-md hidden md:block"
            >
              <div className="relative w-full">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berita, pengumuman, atau dokumen..." 
                  className="w-full pl-4 pr-10 py-2 rounded-full bg-white/10 border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:bg-white focus:text-gray-900 focus:ring-2 focus:ring-yellow-400 transition-all text-xs backdrop-blur-sm"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-900">
                  <Search size={16} />
                </button>
              </div>
            </form>

            {/* 3. Hubungi Kami */}
            <Link 
              href="https://wa.me/6282134464499" 
              className="hidden lg:flex bg-yellow-500 text-[#002040] px-4 py-2 rounded-full text-[10px] font-black items-center gap-2 hover:bg-white transition-all shadow-lg uppercase tracking-tighter"
            >
              <Headset size={14} />
              Hubungi Layanan
            </Link>

            {/* Tombol Menu Mobile */}
            <button 
              className="md:hidden p-2 text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>

          </div>
        </div>
      </div>

      {/* ================= BAWAH: NAVIGASI MENU ================= */}
      <div className="bg-[#002040] text-white border-t border-white/5 hidden md:block">
        <div className="container mx-auto px-4 lg:px-8">
          <nav className="flex items-center gap-1">
            {navigation.map((item) => (
              <div key={item.name} className="relative group">
                {item.children ? (
                  <>
                    <button className={`flex items-center gap-1 px-4 py-3 text-[11px] font-bold uppercase tracking-wider hover:text-yellow-400 transition-colors ${pathname.includes(item.name.toLowerCase()) ? 'text-yellow-400' : ''}`}>
                      {item.name}
                      <ChevronDown size={12} className="group-hover:rotate-180 transition-transform" />
                    </button>
                    {/* Dropdown */}
                    <div className="absolute left-0 top-full w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 shadow-2xl">
                      <div className="bg-[#00152b] border-t-2 border-yellow-400 py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-5 py-2 text-[11px] text-gray-300 hover:bg-blue-600 hover:text-white transition-colors"
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
                    className={`px-4 py-3 text-[11px] font-bold uppercase tracking-wider hover:text-yellow-400 transition-colors block ${
                      pathname === item.href ? 'bg-blue-600 text-white' : ''
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* ================= MOBILE MENU OVERLAY ================= */}
      {isOpen && (
        <div className="md:hidden bg-[#00152b] border-t border-gray-700 text-white animate-in slide-in-from-top duration-300">
          <div className="p-4 flex flex-col space-y-1">
            {/* Search Mobile */}
            <form onSubmit={handleSearch} className="mb-4 relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari sesuatu..." 
                  className="w-full pl-4 pr-10 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm"
                />
                <button type="submit" className="absolute right-3 top-2.5"><Search size={16} /></button>
            </form>

            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <>
                    <button 
                      onClick={() => toggleDropdown(item.name)}
                      className="flex items-center justify-between w-full px-4 py-3 text-xs font-black uppercase hover:bg-blue-600 rounded-lg"
                    >
                      {item.name}
                      <ChevronDown size={16} className={activeDropdown === item.name ? 'rotate-180 text-yellow-400' : ''} />
                    </button>
                    {activeDropdown === item.name && (
                      <div className="bg-black/20 rounded-lg ml-4 mb-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            onClick={() => setIsOpen(false)}
                            className="block px-6 py-3 text-xs text-gray-400 hover:text-white"
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
                    className="block px-4 py-3 text-xs font-black uppercase hover:bg-blue-600 rounded-lg"
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