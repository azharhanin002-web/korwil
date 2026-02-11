import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Youtube, Twitter, Headset, MapPin } from 'lucide-react'; 

// Icon TikTok Custom (Karena belum ada di lucide standar)
const TiktokIcon = ({ size = 18, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#001529] text-white pt-12 pb-6 font-sans border-t-4 border-yellow-500 relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 relative z-10">
        
        {/* === SECTION ATAS: Identitas & Tombol === */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-10 pb-8 border-b border-gray-700/50">
          
          {/* Kiri: Logo & Alamat */}
          <div className="mb-8 md:mb-0 max-w-lg">
             <div className="flex items-center gap-4 mb-5">
               {/* --- PERBAIKAN DI SINI --- */}
               {/* Hapus 'brightness-0 invert' agar warna asli logo muncul */}
               <img 
                 src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg" 
                 alt="Logo Kemendikdasmen" 
                 className="w-16 h-16 object-contain" 
               />
               <div>
                 <h2 className="font-bold text-lg md:text-xl uppercase tracking-wider text-white leading-tight">
                   KEMENTERIAN PENDIDIKAN <br/> DASAR DAN MENENGAH
                 </h2>
               </div>
             </div>
             
             <div className="text-sm text-gray-400 space-y-2 pl-1">
               <p className="font-semibold text-gray-200">Kompleks Kemendikdasmen</p>
               <div className="flex items-start gap-2">
                 <MapPin size={16} className="mt-0.5 shrink-0" />
                 <p>Jl. Jenderal Sudirman, Senayan, Jakarta, 10270, Indonesia</p>
               </div>
             </div>
          </div>
          
          {/* Kanan: Tombol Hubungi */}
          <div>
            <Link href="#" className="bg-white text-[#001529] px-6 py-2.5 rounded font-bold flex items-center gap-2 hover:bg-yellow-400 hover:text-black transition-all shadow-lg text-sm">
              <Headset size={18} />
              Hubungi Kami
            </Link>
          </div>
        </div>

        {/* === SECTION TENGAH: Grid Link === */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12 text-sm">
          
          {/* Kolom 1 (Lebih lebar) */}
          <div className="md:col-span-5">
            <h3 className="text-base font-bold text-white mb-4 uppercase tracking-wide border-b border-gray-700 inline-block pb-1">
              PRANALA ESELON SATU
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li><Link href="#" className="hover:text-yellow-400 hover:underline transition-colors">Sekretariat Jenderal</Link></li>
              <li><Link href="#" className="hover:text-yellow-400 hover:underline transition-colors">Direktorat Jenderal PAUD dan Dikdasmen</Link></li>
              <li><Link href="#" className="hover:text-yellow-400 hover:underline transition-colors">Direktorat Jenderal Pendidikan Vokasi, Pendidikan Khusus, dan Pendidikan Layanan Khusus</Link></li>
              <li><Link href="#" className="hover:text-yellow-400 hover:underline transition-colors">Inspektorat Jenderal</Link></li>
            </ul>
          </div>

          {/* Kolom 2 */}
          <div className="md:col-span-4 md:pt-11"> 
            <ul className="space-y-3 text-gray-400">
              <li><Link href="#" className="hover:text-yellow-400 hover:underline transition-colors">Direktorat Jenderal Guru, Tenaga Kependidikan, dan Pendidikan Guru</Link></li>
              <li><Link href="#" className="hover:text-yellow-400 hover:underline transition-colors">Badan Pengembangan dan Pembinaan Bahasa</Link></li>
              <li><Link href="#" className="hover:text-yellow-400 hover:underline transition-colors">Badan Standar, Kurikulum, dan Asesmen Pendidikan</Link></li>
            </ul>
          </div>

          {/* Kolom 3 (Socials & Misc) */}
          <div className="md:col-span-3 md:pt-11 space-y-6">
             <ul className="space-y-3 text-gray-400">
               <li><Link href="#" className="hover:text-yellow-400 hover:underline transition-colors">GPR Komdigi</Link></li>
               <li><Link href="#" className="hover:text-yellow-400 hover:underline transition-colors">Peta Situs</Link></li>
               <li><Link href="#" className="hover:text-yellow-400 hover:underline transition-colors">Pejabat Pengelola Informasi & Dokumentasi (PPID)</Link></li>
               <li><Link href="#" className="hover:text-yellow-400 hover:underline transition-colors">JDIH</Link></li>
             </ul>
             
             {/* Social Media Icons (Bulat Transparan) */}
             <div className="flex gap-3 mt-4">
                <Link href="#" className="bg-white/10 hover:bg-white hover:text-[#001529] text-white p-2 rounded-full transition-all border border-white/20">
                    <Twitter size={16} />
                </Link>
                <Link href="#" className="bg-white/10 hover:bg-white hover:text-[#001529] text-white p-2 rounded-full transition-all border border-white/20">
                    <Instagram size={16} />
                </Link>
                <Link href="#" className="bg-white/10 hover:bg-white hover:text-[#001529] text-white p-2 rounded-full transition-all border border-white/20">
                    <Facebook size={16} />
                </Link>
                <Link href="#" className="bg-white/10 hover:bg-white hover:text-[#001529] text-white p-2 rounded-full transition-all border border-white/20">
                    <Youtube size={16} />
                </Link>
                <Link href="#" className="bg-white/10 hover:bg-white hover:text-[#001529] text-white p-2 rounded-full transition-all border border-white/20">
                    <TiktokIcon size={16} />
                </Link>
             </div>
          </div>

        </div>

        {/* === SECTION BAWAH: Copyright === */}
        <div className="text-center text-xs text-gray-500 border-t border-gray-800 pt-6 mt-4">
          <p>Hak Cipta Kementerian Pendidikan Dasar dan Menengah © 2026</p>
        </div>

      </div>
      
      {/* Floating Accessibility (Opsional) */}
      <div className="absolute bottom-6 right-6 z-20">
         <button className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-500 transition-colors" aria-label="Aksesibilitas">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
         </button>
      </div>
    </footer>
  );
}