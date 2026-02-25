'use client';

import { useState, useEffect } from 'react';
import { Smartphone, X, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

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
      
      {/* Card Utama: Background Cerah & Proportional Rounded */}
      <div className="relative bg-gradient-to-br from-white via-blue-50 to-yellow-50 text-slate-900 rounded-3xl shadow-[0_15px_50px_-12px_rgba(0,0,0,0.25)] border border-slate-200 p-6 overflow-hidden">
        
        {/* Dekorasi Watermark Halus */}
        <div className="absolute -right-6 -top-6 opacity-[0.03] pointer-events-none transform rotate-12 text-slate-900">
          <ShieldCheck size={140} strokeWidth={1} />
        </div>
        
        {/* Tombol Close */}
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 transition-colors z-20 bg-slate-100/50 rounded-full"
        >
          <X size={18} />
        </button>

        {/* ATAS: Konten Identitas */}
        <div className="relative z-10 flex items-start gap-4 mb-6">
          {/* Icon Box */}
          <div className="relative shrink-0">
            <div className="bg-[#002040] p-3.5 rounded-2xl text-yellow-400 shadow-md">
              <Smartphone size={24} strokeWidth={2.5} />
            </div>
            <div className="absolute -top-1.5 -right-1.5 bg-green-500 text-white rounded-full p-0.5 border-2 border-white shadow-sm">
              <CheckCircle2 size={10} fill="currentColor" />
            </div>
          </div>

          <div className="pt-0.5">
            <div className="inline-flex items-center gap-1.5 mb-1.5 bg-blue-100 px-2.5 py-1 rounded-lg">
              <ShieldCheck size={11} className="text-blue-700" />
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-700">
                Aplikasi Resmi
              </span>
            </div>
            <h3 className="text-base font-black leading-tight uppercase tracking-tighter text-slate-900">
              Portal Korwilcam Barat
            </h3>
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1 pr-6">
              Akses informasi pendidikan lebih cepat dan aman langsung dari layar utama HP Anda.
            </p>
          </div>
        </div>

        {/* BAWAH: Tombol Aksi di Pojok Kanan */}
        <div className="relative z-10 flex justify-end border-t border-slate-100 pt-4">
          <button 
            onClick={handleInstallClick}
            className="bg-[#002040] text-white px-7 py-3.5 rounded-xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-900 transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
            <Download size={14} strokeWidth={3} className="text-yellow-400" /> 
            INSTALL SEKARANG
          </button>
        </div>

      </div>
    </div>
  );
}