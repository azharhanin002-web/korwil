import { client } from "@/lib/sanity/client";
import { documentsQuery } from "@/lib/sanity/queries";
import { FileText, Download, Search, Info, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image"; 
import YearFilter from "@/components/YearFilter"; 
import DocSearch from "@/components/DocSearch";
import { Metadata } from "next"; // Tambahkan import type Metadata

export const revalidate = 0;

// FIX: Metadata Lengkap agar Thumbnail Muncul di WhatsApp/Medsos
export const metadata: Metadata = {
  title: "Pusat Dokumen & Repository Digital | Korwilcam Purwokerto Barat",
  description: "Akses resmi dokumen kedinasan, surat edaran, dan formulir pelayanan Korwilcam Dindik Purwokerto Barat.",
  openGraph: {
    title: "Pusat Dokumen & Repository Digital",
    description: "Akses resmi dokumen kedinasan, surat edaran, dan formulir pelayanan Korwilcam Dindik Purwokerto Barat.",
    url: "https://www.korwilbarat.web.id/dokumen",
    siteName: "Korwilcam Dindik Purwokerto Barat",
    images: [
      {
        url: "/dokumen.jpg", // Menggunakan gambar yang sama dengan header
        width: 1200,
        height: 630,
        alt: "Thumbnail Pusat Dokumen Korwilcam Purwokerto Barat",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pusat Dokumen & Repository Digital",
    description: "Akses resmi dokumen kedinasan, surat edaran, dan formulir pelayanan Korwilcam Dindik Purwokerto Barat.",
    images: ["/dokumen.jpg"],
  },
};

export default async function DokumenPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; page?: string; tahun?: string; q?: string }>;
}) {
  const { kategori, page, tahun, q } = await searchParams;
  
  const currentPage = parseInt(page || "1");
  const itemsPerPage = 8; 

  const allDocs = await client.fetch(documentsQuery);

  const categories = [
    { label: "Semua", value: "" },
    { label: "Surat Keputusan (SK)", value: "SK" },
    { label: "Surat Edaran (SE)", value: "SE" },
    { label: "Peraturan / Juknis", value: "Peraturan" },
    { label: "Formulir", value: "Formulir" },
    { label: "Lainnya", value: "Lainnya" },
  ];

  const schoolYears = ["2023/2024", "2024/2025", "2025/2026", "2026/2027"];

  // --- LOGIKA FILTERING ---
  let filteredDocs = allDocs || [];

  if (q) {
    filteredDocs = filteredDocs.filter((doc: any) => 
      doc.title.toLowerCase().includes(q.toLowerCase())
    );
  }

  if (kategori) {
    filteredDocs = filteredDocs.filter((doc: any) => doc.category === kategori);
  }

  if (tahun) {
    filteredDocs = filteredDocs.filter((doc: any) => {
      if (doc.tahunAjaran === tahun) return true;
      if (!doc.tahunAjaran && doc.publishedAt) {
        const date = new Date(doc.publishedAt);
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const derivedYear = m >= 7 ? `${y}/${y + 1}` : `${y - 1}/${y}`;
        return derivedYear === tahun;
      }
      return false;
    });
  }

  // LOGIKA PAGINATION
  const totalItems = filteredDocs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDocs = filteredDocs.slice(startIndex, startIndex + itemsPerPage);

  const formatBytes = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* HEADER DENGAN GAMBAR dokumen.jpg */}
      <div className="relative bg-[#002040] text-white pt-24 pb-32 px-4 overflow-hidden">
        <Image 
          src="/dokumen.jpg" 
          alt="Background Pusat Dokumen" 
          fill 
          className="object-cover opacity-20 pointer-events-none" 
          priority
        />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-[#002040] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-xl">
            <Info size={14} /> Repository Digital
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold uppercase tracking-tighter mb-4 drop-shadow-lg">
            Pusat Dokumen
          </h1>
          <p className="text-blue-100 max-w-2xl mx-auto font-medium opacity-90 text-sm md:text-base">
            Akses resmi dokumen kedinasan, surat edaran, dan formulir pelayanan Korwilcam Dindik Purwokerto Barat.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-12 relative z-20">
        <div className="mb-6 shadow-2xl rounded-3xl overflow-hidden">
          <DocSearch />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-10">
          <div className="lg:col-span-3 bg-white p-2 rounded-[2rem] shadow-xl border border-slate-100 overflow-x-auto no-scrollbar flex items-center gap-1">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={{
                  pathname: '/dokumen',
                  query: { 
                    ...(cat.value ? { kategori: cat.value } : {}),
                    ...(tahun ? { tahun } : {}),
                    ...(q ? { q } : {}),
                    page: 1 
                  }
                }}
                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
                  (kategori === cat.value || (!kategori && cat.value === ""))
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
          <YearFilter years={schoolYears} currentYear={tahun || ""} />
        </div>

        <div className="grid grid-cols-1 gap-5 mb-16">
          {paginatedDocs.length > 0 ? (
            paginatedDocs.map((doc: any) => (
              <div key={doc._id} className="bg-white rounded-[2.5rem] p-7 md:p-9 shadow-sm border border-slate-100 hover:shadow-2xl transition-all group duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-inner">
                      <FileText size={32} />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-lg">
                          {doc.category || "UMUM"}
                        </span>
                        <span suppressHydrationWarning className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                          <Calendar size={12} /> {new Date(doc.publishedAt).toLocaleDateString('id-ID')}
                        </span>
                        <span className="text-[10px] font-black text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                          TA {doc.tahunAjaran || "2025/2026"}
                        </span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-black text-slate-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2 italic leading-relaxed">
                        {doc.description || "Klik tombol download untuk mengunduh berkas ini."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 shrink-0 border-t md:border-t-0 pt-6 md:pt-0">
                    <div className="text-right hidden xl:block">
                      <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Ukuran File</p>
                      <p className="text-sm font-black text-slate-800">{formatBytes(doc.fileSize)}</p>
                    </div>
                    {doc.fileUrl ? (
                      <a
                        href={`${doc.fileUrl}?dl=${doc.fileName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 bg-[#002040] text-white px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-blue-900/10 active:scale-95"
                      >
                        <Download size={20} /> Download
                      </a>
                    ) : (
                      <div className="text-xs font-black text-red-400 uppercase italic">Berkas Kosong</div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-24 text-center bg-white rounded-[3rem] border-4 border-dashed border-slate-100 shadow-inner">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                <Search size={48} />
              </div>
              <h3 className="text-2xl font-black text-slate-400 uppercase tracking-tighter">Data Tidak Ditemukan</h3>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-8">
            <Link
              href={{ pathname: '/dokumen', query: { kategori, tahun, q, page: Math.max(1, currentPage - 1) } }}
              className={`p-4 rounded-[1.2rem] bg-white border border-slate-100 shadow-sm transition-all ${currentPage === 1 ? 'opacity-30 pointer-events-none' : 'hover:bg-blue-600 hover:text-white shadow-blue-200 shadow-lg'}`}
            >
              <ChevronLeft size={24} />
            </Link>
            
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <Link
                  key={i}
                  href={{ pathname: '/dokumen', query: { kategori, tahun, q, page: i + 1 } }}
                  className={`w-14 h-14 flex items-center justify-center rounded-[1.2rem] text-sm font-black transition-all shadow-md border ${
                    currentPage === i + 1 
                    ? "bg-blue-600 text-white border-blue-600 shadow-blue-200" 
                    : "bg-white text-slate-400 border-slate-100 hover:border-blue-600 hover:text-blue-600"
                  }`}
                >
                  {i + 1}
                </Link>
              ))}
            </div>

            <Link
              href={{ pathname: '/dokumen', query: { kategori, tahun, q, page: Math.min(totalPages, currentPage + 1) } }}
              className={`p-4 rounded-[1.2rem] bg-white border border-slate-100 shadow-sm transition-all ${currentPage === totalPages ? 'opacity-30 pointer-events-none' : 'hover:bg-blue-600 hover:text-white shadow-blue-200 shadow-lg'}`}
            >
              <ChevronRight size={24} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}