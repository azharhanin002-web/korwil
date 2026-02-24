'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ChevronDown, Headset, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* CLOSE DROPDOWN SAAT KLIK DI LUAR */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    setIsOpen(false);
    setSearchQuery('');
  };

  const navigation = [
    { name: 'Beranda', href: '/' },
    { name: 'Data Sekolah', href: '/sekolah' },
    { name: 'Pengumuman', href: '/pengumuman' },
    {
      name: 'Publikasi',
      href: '#',
      children: [
        { name: 'Berita Dinas', href: '/berita' },
        { name: 'Siaran Pers', href: '/siaran-pers' },
        { name: 'Artikel Guru', href: '/artikel' },
      ],
    },
    { name: 'Galeri Foto', href: '/galeri-foto' },
    { name: 'Dokumen', href: '/dokumen' },
    { name: 'PGRI', href: '/pgri' },
    { name: 'Pramuka', href: '/pramuka' },
  ];

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <>
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <header className="w-full font-sans shadow-md sticky top-0 z-50 bg-[#002040]">
        
        {/* ================= HEADER ATAS: LOGO, PROPORSIONAL SEARCH, BUTTON ================= */}
        <div className="bg-gradient-to-r from-[#0060af] via-[#004d91] to-[#002855] text-white py-3 md:py-4">
          <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between gap-4">
            
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg"
                alt="Logo"
                className="w-10 h-10 md:w-12 md:h-12 drop-shadow-md"
              />
              <div className="leading-tight">
                <h1 className="font-black uppercase text-sm md:text-lg tracking-tight">Korwilcam Dindik</h1>
                <p className="text-[9px] md:text-xs font-bold text-yellow-400 tracking-widest uppercase">Purwokerto Barat</p>
              </div>
            </Link>

            <form onSubmit={handleSearch} className="hidden md:flex flex-1 justify-center px-8">
              <div className="relative w-full max-w-md"> {/* Search Proporsional */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari berita atau pengumuman..."
                  className="w-full px-6 py-2.5 rounded-full bg-white/10 border border-white/20 text-white placeholder-blue-100 text-xs focus:outline-none focus:bg-white focus:text-black transition-all"
                />
                <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-100 hover:text-blue-900">
                  <Search size={18} />
                </button>
              </div>
            </form>

            <Link 
              href="https://wa.me/6282134464499" 
              className="hidden lg:flex bg-yellow-500 hover:bg-yellow-400 text-[#002040] px-5 py-2.5 rounded-full text-[10px] font-black items-center gap-2 transition-all shadow-lg uppercase shrink-0"
            >
              <Headset size={16} /> Hubungi Layanan
            </Link>

            <button className="md:hidden p-2 text-white" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* ================= NAV DESKTOP (image_6c0dd4.png) ================= */}
        <div className="bg-[#002040] text-white hidden md:block border-t border-white/5 overflow-visible">
          <div className="container mx-auto px-4 lg:px-8">
            {/* FIX: Menghapus overflow-x-auto dari nav utama agar dropdown tidak terpotong */}
            <nav ref={dropdownRef} className="flex items-center gap-1">
              {navigation.map((item) => (
                <div key={item.name} className="relative shrink-0">
                  {item.children ? (
                    <div className="relative">
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className={`flex items-center gap-1 px-5 py-4 text-[11px] font-bold uppercase tracking-wider transition-all hover:text-yellow-400 ${
                          activeDropdown === item.name || pathname.includes(item.name.toLowerCase()) ? 'text-yellow-400 bg-blue-600/30' : ''
                        }`}
                      >
                        {item.name}
                        <ChevronDown size={14} className={`transition-transform duration-300 ${activeDropdown === item.name ? 'rotate-180 text-yellow-400' : ''}`} />
                      </button>

                      {/* DROPDOWN MENU: Diposisikan menempel sempurna */}
                      {activeDropdown === item.name && (
                        <div className="absolute left-0 top-full w-56 bg-[#00152b] border-t-4 border-yellow-400 shadow-2xl rounded-b-xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              onClick={() => setActiveDropdown(null)}
                              className="block px-6 py-3.5 text-[11px] font-bold text-gray-300 hover:bg-blue-600 hover:text-white transition-colors border-b border-white/5 last:border-0"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={item.href}
                      className={`px-5 py-4 text-[11px] font-bold uppercase tracking-wider transition-all hover:text-yellow-400 whitespace-nowrap block ${
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
          <div className="md:hidden bg-[#00152b] border-t border-gray-800 text-white animate-in slide-in-from-top duration-300 overflow-y-auto max-h-[85vh]">
            <div className="p-4 space-y-1">
              <form onSubmit={handleSearch} className="mb-4 relative flex items-center px-2">
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari sesuatu..." 
                    className="w-full pl-4 pr-10 py-2.5 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none"
                  />
                  <button type="submit" className="absolute right-6 text-white/50"><Search size={18} /></button>
              </form>

              {navigation.map((item) => (
                <div key={item.name}>
                  {item.children ? (
                    <>
                      <button 
                        onClick={() => toggleDropdown(item.name)}
                        className="flex items-center justify-between w-full px-4 py-4 text-xs font-black uppercase hover:bg-blue-600 rounded-lg"
                      >
                        <span className={activeDropdown === item.name ? 'text-yellow-400' : ''}>{item.name}</span>
                        <ChevronDown size={16} className={`transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      {activeDropdown === item.name && (
                        <div className="bg-black/20 rounded-lg ml-4 mb-2 overflow-hidden border-l-2 border-yellow-400/30">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              onClick={() => setIsOpen(false)}
                              className="block px-6 py-4 text-xs font-bold text-gray-400 hover:text-white hover:bg-blue-600"
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
                      className={`block px-4 py-4 text-xs font-black uppercase hover:bg-blue-600 rounded-lg ${pathname === item.href ? 'text-yellow-400 font-black' : ''}`}
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
    </>
  );
}