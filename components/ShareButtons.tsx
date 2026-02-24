'use client';

import React, { useState } from 'react';
import { 
  Facebook, 
  Twitter, 
  MessageCircle, 
  Send, 
  Link as LinkIcon, 
  Check,
  Share2,
  Instagram // Pastikan lucide-react versi terbaru
} from 'lucide-react';

interface ShareProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareProps) {
  const [copied, setCopied] = useState(false);

  const shareText = encodeURIComponent(`Baca berita terbaru: ${title}`);
  const encodedUrl = encodeURIComponent(url);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 mb-20">
      <div className="flex items-center gap-3 font-bold text-slate-700 uppercase tracking-widest text-sm mb-6 justify-center md:justify-start">
        <Share2 size={20} className="text-blue-600" /> Bagikan Berita Ini
      </div>
      
      <div className="flex flex-wrap justify-center md:justify-start gap-4">
        {/* WhatsApp */}
        <a 
          href={`https://wa.me/?text=${shareText}%20${encodedUrl}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-green-200/50"
          title="Share ke WhatsApp"
        >
          <MessageCircle size={24} />
        </a>

        {/* Facebook */}
        <a 
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 bg-[#1877F2] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-blue-200/50"
          title="Share ke Facebook"
        >
          <Facebook size={24} />
        </a>

        {/* Instagram - Menjalankan fungsi Salin Link */}
        <button 
          onClick={copyToClipboard}
          className="w-12 h-12 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-pink-200/50"
          title="Salin Link untuk Instagram"
        >
          <Instagram size={24} />
        </button>

        {/* TikTok - Menjalankan fungsi Salin Link */}
        <button 
          onClick={copyToClipboard}
          className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-slate-300/50"
          title="Salin Link untuk TikTok"
        >
          {/* Custom TikTok Icon SVG karena Lucide kadang tidak ada */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
        </button>

        {/* X (Twitter) */}
        <a 
          href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${shareText}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-slate-300/50"
          title="Share ke X"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        </a>

        {/* Telegram */}
        <a 
          href={`https://t.me/share/url?url=${encodedUrl}&text=${shareText}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 bg-[#0088cc] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-blue-300/50"
          title="Share ke Telegram"
        >
          <Send size={22} />
        </a>
        
        {/* Salin Link Utama */}
        <button 
          onClick={copyToClipboard}
          className={`h-12 px-6 rounded-full flex items-center gap-2 font-bold text-xs uppercase tracking-widest transition-all shadow-lg ${copied ? 'bg-green-500 text-white' : 'bg-slate-800 text-white hover:bg-blue-600'}`}
        >
          {copied ? <Check size={18} /> : <LinkIcon size={18} />}
          {copied ? 'Berhasil Disalin' : 'Salin Link'}
        </button>
      </div>

      <div className="mt-6 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50">
        <p className="text-[10px] text-blue-700 text-center md:text-left font-medium leading-relaxed">
          <strong>Info:</strong> Khusus untuk <strong>Instagram & TikTok</strong>, silakan klik ikonnya untuk otomatis menyalin link berita, lalu tempelkan (Paste) pada Story atau Bio Anda.
        </p>
      </div>
    </div>
  );
}