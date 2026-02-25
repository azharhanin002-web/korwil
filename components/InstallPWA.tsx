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
      
      {/* Card Utama: Gradasi Abu-abu Cerah ke Hitam */}
      <div className="relative bg-gradient-to-br from-slate-100 via-slate-800 to-black text-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)] border border-white/10 p-6 overflow-hidden">
        
        {/* CORAK BATIK OVERLAY */}
        <div 
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{ 
            backgroundImage: `url('https://www.transparenttextures.com/patterns/batik-extra.png')`,
            backgroundRepeat: 'repeat'
          }}
        ></div>
        
        {/* Dekorasi Watermark Perisai */}
        <div className="absolute -right-6 -top-6 opacity-10 pointer-events-none transform rotate-12">
          <ShieldCheck size={160} strokeWidth={1} />
        </div>
        
        {/* Tombol Close */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white transition-colors z-20 bg-black/20 rounded-full backdrop-blur-md"
        >
          <X size={20} />
        </button>

        {/* ATAS: Konten Identitas */}
        <div className="relative z-10 flex items-start gap-5 mb-6">
          {/* Ikon Gambar hp.png - LEBIH BESAR */}
          <div className="relative shrink-0">
            <div className="bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 shadow-2xl">
              <div className="relative w-20 h-20 overflow-hidden rounded-xl">
                <Image 
                  src="/hp.png" 
                  alt="Aplikasi Korwil" 
                  fill 
                  className="object-contain"
                />
              </div>
            </div>
            {/* Badge Centang */}
            <div className="absolute -top-2 -right-2 bg-yellow-600 text-white rounded-full p-1 border-2 border-slate-800 shadow-sm">
              <CheckCircle2 size={12} fill="currentColor" />
            </div>
          </div>

          <div className="pt-1">
            <div className="inline-flex items-center gap-1.5 mb-2 bg-yellow-500/10 px-2.5 py-1 rounded-lg border border-yellow-500/20">
              <ShieldCheck size={12} className="text-yellow-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-yellow-500">
                Sistem Resmi Terverifikasi
              </span>
            </div>
            <h3 className="text-xl font-black leading-tight uppercase tracking-tighter text-white drop-shadow-lg">
              Portal Korwilcam <br/> Purwokerto Barat
            </h3>
            <p className="text-[11px] text-slate-300 font-medium leading-relaxed mt-2 pr-4 opacity-90 italic">
              Akses cepat, aman, dan tanpa hambatan.
            </p>
          </div>
        </div>

        {/* BAWAH: Tombol Aksi - Dark Gold */}
        <div className="relative z-10 flex justify-end border-t border-white/10 pt-5">
          <button 
            onClick={handleInstallClick}
            className="bg-gradient-to-r from-yellow-700 via-yellow-600 to-yellow-800 text-white px-10 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:brightness-110 transition-all shadow-xl shadow-black/40 active:scale-95 flex items-center gap-3 border border-yellow-500/20"
          >
            <Download size={16} strokeWidth={3} /> 
            INSTALL SEKARANG
          </button>
        </div>

      </div>
    </div>
  );
}