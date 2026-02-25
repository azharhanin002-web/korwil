'use client';

import { useState, useEffect } from 'react';
import { Smartphone, X, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. Cek mode standalone
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
      <div className="bg-[#002040] text-white rounded-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.4)] border-t-4 border-yellow-500 p-5 backdrop-blur-lg bg-opacity-95 overflow-hidden relative">
        
        {/* Dekorasi Watermark Logo (Opsional) */}
        <div className="absolute -right-6 -top-6 opacity-5 pointer-events-none">
          <ShieldCheck size={120} />
        </div>

        <div className="flex items-center justify-between gap-4 relative z-10">
          {/* Bagian Kiri: Identitas Resmi */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-3 rounded-2xl text-[#002040] shadow-lg">
                <Smartphone size={24} />
              </div>
              {/* Badge Centang Verifikasi */}
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-0.5 border-2 border-[#002040]">
                <CheckCircle2 size={12} fill="currentColor" className="text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-blue-600 px-2 py-0.5 rounded-md shadow-sm">
                  Aplikasi Resmi
                </span>
              </div>
              <p className="text-sm font-black leading-tight uppercase tracking-tighter">
                Portal Korwilcam Barat
              </p>
              <p className="text-[10px] text-blue-200 font-medium italic">
                Akses cepat, aman & hemat kuota
              </p>
            </div>
          </div>

          {/* Bagian Kanan: Tombol Aksi */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleInstallClick}
              className="bg-yellow-400 text-[#002040] px-5 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-yellow-300 transition-all shadow-[0_5px_15px_rgba(234,179,8,0.3)] active:scale-95 flex items-center gap-2"
            >
              <Download size={14} strokeWidth={3} /> Pasang
            </button>
            <button 
              onClick={() => setIsVisible(false)}
              className="w-10 h-10 flex items-center justify-center text-blue-300 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}