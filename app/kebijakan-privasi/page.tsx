import React from 'react';
import { ShieldCheck, Lock, Eye } from 'lucide-react';

export default function KebijakanPrivasiPage() {
  const sections = [
    {
      title: "Informasi yang Kami Kumpulkan",
      icon: <Eye className="text-blue-600" />,
      content: "Kami mengumpulkan informasi statistik pengunjung seperti jumlah kunjungan dan durasi membaca untuk meningkatkan kualitas layanan informasi pendidikan di wilayah Purwokerto Barat."
    },
    {
      title: "Keamanan Data",
      icon: <Lock className="text-blue-600" />,
      content: "Kami menggunakan enkripsi standar untuk memastikan setiap data dokumen surat edaran dan pengumuman yang Anda unduh aman dari modifikasi pihak yang tidak bertanggung jawab."
    },
    {
      title: "Penggunaan Cookies",
      icon: <ShieldCheck className="text-blue-600" />,
      content: "Website ini menggunakan cookies fungsional untuk menyimpan preferensi pencarian Anda agar pengalaman akses informasi menjadi lebih cepat dan efisien."
    }
  ];

  return (
    <main className="max-w-4xl mx-auto px-4 py-16 min-h-screen bg-white">
      <div className="border-b-4 border-blue-600 pb-6 mb-12">
        <h1 className="text-4xl font-black text-[#002040] uppercase tracking-tight">Kebijakan Privasi</h1>
        <p className="text-gray-500 mt-2 font-medium italic">Terakhir diperbarui: 12 Februari 2026</p>
      </div>

      <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
        <p className="mb-8 text-lg">
          Selamat datang di Portal Resmi Korwilcam Dindik Purwokerto Barat. Privasi Anda adalah prioritas kami. Halaman ini menjelaskan komitmen kami dalam melindungi data pribadi pengunjung selama mengakses informasi pendidikan kami.
        </p>

        <div className="grid gap-8 mt-12">
          {sections.map((sec, i) => (
            <div key={i} className="flex gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
              <div className="shrink-0 bg-white p-3 rounded-xl shadow-sm h-fit">
                {sec.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#002040] mb-2">{sec.title}</h2>
                <p className="text-sm leading-loose">{sec.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-blue-900 text-white rounded-3xl shadow-xl">
          <h3 className="text-xl font-bold mb-4">Persetujuan</h3>
          <p className="text-sm opacity-90 leading-relaxed">
            Dengan terus menggunakan layanan website Korwilcam Dindik Purwokerto Barat, Anda dianggap telah memahami dan menyetujui seluruh butir kebijakan privasi yang berlaku demi kenyamanan bersama dalam mengakses data pendidikan daerah.
          </p>
        </div>
      </div>
    </main>
  );
}