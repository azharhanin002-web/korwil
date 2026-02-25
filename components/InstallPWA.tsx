'use client';

import { useState, useEffect } from 'react';
import { Smartphone, X, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Cek apakah sudah mode standalone
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
    // Container utama melayang di bawah
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[999] p-5 animate-in slide-in-from-bottom duration-700">
      
      {/* Kotak Pop-up Utama */}
      <div className="relative bg-gradient-to-b from-[#002040] to-[#001a33] text-white rounded-[2.5rem] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)] border-t-[6px] border-yellow-500 p-6 overflow-hidden ring-1 ring-white/10 backdrop-blur-xl">
        
        {/* Dekorasi Background (Watermark) */}
        <div className="absolute -right-10 -top-10 opacity-5 pointer-events-none transform rotate-12">
          <ShieldCheck size={150} strokeWidth={1} />
        </div>
        
        {/* Tombol Close (X) di pojok kanan atas */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-2 text-blue-300 hover:text-white transition-colors z-20 bg-[#002040]/50 rounded-full backdrop-blur-md"
        >
          <X size={20} />
        </button>

        {/* BAGIAN ATAS: Identitas & Teks */}
        <div className="relative z-10 flex items-start gap-5 mb-6">
          {/* Ikon HP dengan Centang */}
          <div className="relative shrink-0">
            <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 p-4 rounded-3xl text-[#002040] shadow-lg shadow-yellow-500/30">
              <Smartphone size={28} strokeWidth={2} />
            </div>
            <div className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-full p-1 border-2 border-[#002040] shadow-sm">
              <CheckCircle2 size={12} fill="currentColor" className="text-white" />
            </div>
          </div>

          {/* Teks Deskripsi */}
          <div className="pt-1">
            <div className="inline-flex items-center gap-2 mb-2 bg-blue-900/50 px-3 py-1 rounded-full border border-blue-800/30 backdrop-blur-sm">
              <ShieldCheck size={12} className="text-yellow-400" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200">
                Aplikasi Resmi
              </span>
            </div>
            <h3 className="text-lg font-black leading-tight uppercase tracking-tighter mb-2 text-white drop-shadow-sm">
              Portal Korwilcam Barat
            </h3>
            <p className="text-xs text-blue-200/80 font-medium leading-relaxed pr-8">
              Akses portal pelayanan pendidikan lebih cepat, aman, dan hemat kuota langsung dari layar utama.
            </p>
          </div>
        </div>

        {/* BAGIAN BAWAH: Tombol Aksi (Pojok Kanan Bawah) */}
        <div className="relative z-10 flex justify-end border-t border-white/10 pt-5 mt-5">
          <button 
            onClick={handleInstallClick}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-[#002040] px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-[0.15em] hover:from-yellow-300 hover:to-yellow-500 transition-all shadow-[0_8px_20px_-5px_rgba(234,179,8,0.5)] active:scale-95 flex items-center gap-3 ring-2 ring-yellow-400/50"
          >
            <Download size={16} strokeWidth={3} /> INSTALL SEKARANG
          </button>
        </div>

      </div>
    </div>
  );
}