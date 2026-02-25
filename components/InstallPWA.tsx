'use client';

import { useState, useEffect } from 'react';
import { Smartphone, X, Download } from 'lucide-react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 1. CEK APAKAH SUDAH TERINSTAL / DIBUKA SEBAGAI APLIKASI
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
                         || (window.navigator as any).standalone 
                         || document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsVisible(false);
      return;
    }

    // 2. TAMPILKAN TOMBOL HANYA JIKA BROWSER MENDUKUNG INSTALL PWA
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    // 3. SEMBUNYIKAN OTOMATIS JIKA PROSES INSTALL BERHASIL
    const installedHandler = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  if (!isVisible) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[999] p-4 animate-in slide-in-from-bottom duration-700">
      <div className="bg-[#002040] text-white rounded-[2rem] shadow-[0_-20px_50px_rgba(0,0,0,0.3)] border border-blue-400/20 p-5 flex items-center justify-between gap-4 backdrop-blur-md bg-opacity-95">
        <div className="flex items-center gap-4">
          <div className="bg-yellow-400 p-3 rounded-2xl text-[#002040] shadow-lg shadow-yellow-400/20">
            <Smartphone size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-300 mb-0.5">Aplikasi Korwil</p>
            <p className="text-sm font-black leading-tight uppercase tracking-tighter">Install di Layar Utama</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleInstallClick}
            className="bg-yellow-400 text-[#002040] px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-yellow-300 transition-all shadow-xl active:scale-95 flex items-center gap-2"
          >
            <Download size={14} /> Install
          </button>
          <button 
            onClick={() => setIsVisible(false)}
            className="p-2 text-blue-300 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}