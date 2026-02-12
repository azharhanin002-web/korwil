import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Youtube, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#00152b] text-white pt-16 pb-8 border-t border-white/10">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Kolom 1: Profil Kantor */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/9/9c/Logo_of_Ministry_of_Education_and_Culture_of_Republic_of_Indonesia.svg" 
                alt="Logo Tut Wuri" 
                className="w-12 h-12"
              />
              <div className="leading-tight">
                <h4 className="font-bold text-lg leading-none">KORWILCAM DINDIK</h4>
                <p className="text-yellow-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">Purwokerto Barat</p>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mt-2">
              Unit pelaksana teknis dinas yang membidangi urusan pendidikan di wilayah Kecamatan Purwokerto Barat, Kabupaten Banyumas.
            </p>
          </div>

          {/* Kolom 2: Navigasi internal */}
          <div>
            <h4 className="font-bold text-white mb-6 border-b border-white/10 pb-2 inline-block">Layanan Utama</h4>
            <ul className="space-y-3 text-sm text-gray-400 font-medium">
              <li><Link href="/sekolah" className="hover:text-yellow-400 transition-colors">Data Satuan Pendidikan</Link></li>
              <li><Link href="/dokumen/se" className="hover:text-yellow-400 transition-colors">Arsip Surat Edaran</Link></li>
              <li><Link href="/pgri" className="hover:text-yellow-400 transition-colors">Informasi PGRI</Link></li>
              <li><Link href="/pramuka" className="hover:text-yellow-400 transition-colors">Kegiatan Pramuka</Link></li>
              <li><Link href="/pengumuman" className="hover:text-yellow-400 transition-colors">Pusat Pengumuman</Link></li>
            </ul>
          </div>

          {/* Kolom 3: Tautan Terkait */}
          <div>
            <h4 className="font-bold text-white mb-6 border-b border-white/10 pb-2 inline-block">Tautan Terkait</h4>
            <ul className="space-y-3 text-sm text-gray-400 font-medium">
              <li>
                <Link href="https://dindik.banyumaskab.go.id" target="_blank" className="hover:text-yellow-400 transition-colors flex items-center gap-2">
                  Dindik Banyumas <ExternalLink size={12} />
                </Link>
              </li>
              <li>
                <Link href="https://onislam.web.id" target="_blank" className="hover:text-yellow-400 transition-colors flex items-center gap-2">
                  OnIslam <ExternalLink size={12} />
                </Link>
              </li>
              <li>
                <Link href="https://guru.kemdikbud.go.id" target="_blank" className="hover:text-yellow-400 transition-colors flex items-center gap-2">
                  Platform Merdeka Mengajar <ExternalLink size={12} />
                </Link>
              </li>
              <li>
                <Link href="https://dapo.kemdikbud.go.id" target="_blank" className="hover:text-yellow-400 transition-colors flex items-center gap-2">
                  Dapodik Pusat <ExternalLink size={12} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 4: Informasi Kontak */}
          <div>
            <h4 className="font-bold text-white mb-6 border-b border-white/10 pb-2 inline-block">Hubungi Kami</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-yellow-400 shrink-0" />
                <span className="leading-relaxed">Jalan KS Tubun No. 9, Rejasari, Purwokerto Barat, Banyumas, Jawa Tengah 53137</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-yellow-400 shrink-0" />
                <span>(0281) 634230</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-yellow-400 shrink-0" />
                <span>korwilpwtbarat@gmail.com</span>
              </li>
            </ul>
            
            <div className="flex gap-4 mt-8">
              <Link href="#" className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg">
                <Facebook size={18} />
              </Link>
              <Link href="#" className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center hover:bg-pink-600 transition-all shadow-lg">
                <Instagram size={18} />
              </Link>
              <Link href="#" className="w-9 h-9 bg-white/5 rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-lg">
                <Youtube size={18} />
              </Link>
            </div>
          </div>

        </div>

        {/* Garis bawah & Copyright + Credit */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center md:text-left">
          <div className="flex flex-col gap-1">
            <p>© 2026 KORWILCAM PURWOKERTO BARAT. ALL RIGHTS RESERVED.</p>
            <p className="text-gray-600 tracking-normal">
              Didesain oleh <Link href="https://onislam.web.id" target="_blank" className="text-blue-400 hover:text-yellow-400 transition-colors">Masilham</Link>
            </p>
          </div>
          <div className="flex gap-6">
            <Link href="/kebijakan-privasi" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <Link href="/peta-situs" className="hover:text-white transition-colors">Peta Situs</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}