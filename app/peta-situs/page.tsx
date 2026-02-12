import React from 'react';
import Link from 'next/link';
import { Network, ChevronRight } from 'lucide-react';

export default function PetaSitusPage() {
  const sitemapData = [
    {
      group: "Profil Kantor",
      links: [
        { name: "Visi & Misi", href: "/profil/visi-misi" },
        { name: "Struktur Organisasi", href: "/profil/struktur" },
        { name: "Data Satuan Pendidikan", href: "/sekolah" },
      ]
    },
    {
      group: "Pusat Informasi",
      links: [
        { name: "Kabar Berita Dinas", href: "/berita" },
        { name: "Pusat Pengumuman", href: "/pengumuman" },
        { name: "Artikel Guru & Pendidikan", href: "/artikel" },
      ]
    },
    {
      group: "Organisasi & Kegiatan",
      links: [
        { name: "Portal PGRI Barat", href: "/pgri" },
        { name: "Kegiatan Kepramukaan", href: "/pramuka" },
      ]
    },
    {
      group: "Layanan Dokumen",
      links: [
        { name: "Arsip Surat Edaran", href: "/dokumen/se" },
        { name: "Pusat Unduhan File", href: "/dokumen/unduhan" },
      ]
    }
  ];

  return (
    <main className="max-w-5xl mx-auto px-4 py-16 min-h-screen bg-white">
      <div className="flex items-center gap-4 mb-12 border-b-4 border-yellow-500 pb-6 text-[#002040]">
        <Network size={40} className="text-blue-600" />
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Peta Situs</h1>
          <p className="text-gray-500 text-sm font-medium">Struktur Navigasi Portal Korwilcam Purwokerto Barat</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {sitemapData.map((item, idx) => (
          <div key={idx} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-black text-blue-700 mb-6 uppercase tracking-widest border-b pb-2 inline-block">
              {item.group}
            </h2>
            <ul className="grid gap-3">
              {item.links.map((link, lIdx) => (
                <li key={lIdx}>
                  <Link 
                    href={link.href} 
                    className="group flex items-center justify-between p-3 bg-white rounded-xl hover:bg-blue-600 transition-all shadow-sm border border-transparent hover:border-blue-700"
                  >
                    <span className="text-sm font-bold text-gray-700 group-hover:text-white transition-colors">
                      {link.name}
                    </span>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-white" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center text-gray-400 text-xs italic">
        Sitemap ini diperbarui secara otomatis sesuai dengan struktur folder website terbaru.
      </div>
    </main>
  );
}