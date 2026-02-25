'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                         || (window.navigator as any).standalone;
    
    if (isStandalone) return;

    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setIsVisible(false);
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[999] p-4 animate-in slide-in-from-bottom duration-700">
      
      {/* Card Utama: Gradasi Biru Terang ke Gelap */}
      <div className="relative bg-gradient-to-br from-blue-500 via-blue-700 to-blue-900 text-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-blue-400/30 p-6 overflow-hidden">
        
        {/* Dekorasi Watermark Perisai */}
        <div className="absolute -right-6 -top-6 opacity-10 pointer-events-none transform rotate-12">
          <ShieldCheck size={140} strokeWidth={1} />
        </div>
        
        {/* Tombol Close */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-2 text-blue-200 hover:text-white transition-colors z-20 bg-white/10 rounded-full backdrop-blur-md"
        >
          <X size={18} />
        </button>

        {/* ATAS: Konten Identitas */}
        <div className="relative z-10 flex items-start gap-4 mb-6">
          {/* Ikon Gambar hp.png */}
          <div className="relative shrink-0">
            <div className="bg-white/10 backdrop-blur-md p-1 rounded-2xl border border-white/20 shadow-xl">
              <div className="relative w-14 h-14 overflow-hidden rounded-xl">
                <Image 
                  src="/hp.png" 
                  alt="Aplikasi Korwil" 
                  fill 
                  className="object-contain"
                />
              </div>
            </div>
            {/* Badge Centang */}
            <div className="absolute -top-1.5 -right-1.5 bg-yellow-500 text-[#002040] rounded-full p-0.5 border-2 border-blue-700 shadow-sm">
              <CheckCircle2 size={10} fill="currentColor" />
            </div>
          </div>

          <div className="pt-0.5">
            <div className="inline-flex items-center gap-1.5 mb-2 bg-yellow-500/20 px-2.5 py-1 rounded-lg border border-yellow-500/30">
              <ShieldCheck size={11} className="text-yellow-400" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-yellow-400">
                Aplikasi Resmi
              </span>
            </div>
            <h3 className="text-lg font-black leading-tight uppercase tracking-tighter text-white drop-shadow-md">
              Portal Korwilcam Purwokerto Barat
            </h3>
            <p className="text-[11px] text-blue-100 font-medium leading-relaxed mt-1 pr-6 opacity-90">
              Pasang aplikasi untuk akses layanan pendidikan lebih cepat dan aman.
            </p>
          </div>
        </div>

        {/* BAWAH: Tombol Aksi - Emas Gelap (Dark Gold) */}
        <div className="relative z-10 flex justify-end border-t border-white/10 pt-5">
          <button 
            onClick={handleInstallClick}
            className="bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-800 text-white px-8 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-[0.15em] hover:brightness-110 transition-all shadow-lg shadow-black/20 active:scale-95 flex items-center gap-2 border border-yellow-500/30"
          >
            <Download size={14} strokeWidth={3} /> 
            INSTALL SEKARANG
          </button>
        </div>

      </div>
    </div>
  );
}