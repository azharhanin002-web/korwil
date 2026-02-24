import { client } from "@/lib/sanity/client";
import { documentsQuery } from "@/lib/sanity/queries";
import { FileText, Download, Search, Info, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import YearFilter from "@/components/YearFilter"; 
import DocSearch from "@/components/DocSearch"; // Import pencarian

export const revalidate = 0;

export default async function DokumenPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string; page?: string; tahun?: string; q?: string }>;
}) {
  const { kategori, page, tahun, q } = await searchParams;
  
  const currentPage = parseInt(page || "1");
  const itemsPerPage = 6;

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

  // --- LOGIKA FILTERING MULTI-LEVEL ---
  let filteredDocs = allDocs || [];

  // 1. Filter Pencarian (Judul)
  if (q) {
    filteredDocs = filteredDocs.filter((doc: any) => 
      doc.title.toLowerCase().includes(q.toLowerCase())
    );
  }

  // 2. Filter Kategori
  if (kategori) {
    filteredDocs = filteredDocs.filter((doc: any) => doc.category === kategori);
  }

  // 3. Filter Tahun Ajaran (Manual + Auto Fallback)
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
      {/* HEADER */}
      <div className="bg-[#002040] text-white pt-20 pb-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-400 text-[#002040] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-lg">
            <Info size={14} /> Repository Digital
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-tighter mb-4">Pusat Dokumen</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-10">
        {/* BARIS 1: SEARCH BAR */}
        <div className="mb-6">
          <DocSearch />
        </div>

        {/* BARIS 2: CATEGORY & YEAR FILTER */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-8">
          <div className="lg:col-span-3 bg-white p-2 rounded-3xl shadow-xl border border-slate-100 overflow-x-auto no-scrollbar flex items-center gap-1">
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
                className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 ${
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

        {/* LIST DOKUMEN */}
        <div className="grid grid-cols-1 gap-4 mb-12">
          {paginatedDocs.length > 0 ? (
            paginatedDocs.map((doc: any) => (
              <div key={doc._id} className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-100 hover:shadow-md transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <FileText size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                          {doc.category || "DOKUMEN"}
                        </span>
                        <span suppressHydrationWarning className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <Calendar size={12} /> {new Date(doc.publishedAt).toLocaleDateString('id-ID')}
                        </span>
                        <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded uppercase">
                          TA {doc.tahunAjaran || (new Date(doc.publishedAt).getMonth() + 1 >= 7 ? `${new Date(doc.publishedAt).getFullYear()}/${new Date(doc.publishedAt).getFullYear() + 1}` : `${new Date(doc.publishedAt).getFullYear() - 1}/${new Date(doc.publishedAt).getFullYear()}`)}
                        </span>
                      </div>
                      <h3 className="text-lg md:text-xl font-extrabold text-slate-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-1 italic">{doc.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden md:block mr-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Size</p>
                      <p className="text-xs font-black text-slate-700">{formatBytes(doc.fileSize)}</p>
                    </div>
                    <a
                      href={`${doc.fileUrl}?dl=${doc.fileName}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg shadow-slate-200"
                    >
                      <Download size={18} /> Download
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200 shadow-inner">
              <Search size={40} className="mx-auto text-slate-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-400 uppercase tracking-tighter">Tidak ada hasil</h3>
              <p className="text-[10px] text-slate-300 mt-2 uppercase tracking-widest">Gunakan kata kunci lain atau reset filter.</p>
            </div>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2">
            <Link
              href={{ pathname: '/dokumen', query: { kategori, tahun, q, page: Math.max(1, currentPage - 1) } }}
              className={`p-3 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all ${currentPage === 1 ? 'opacity-30 pointer-events-none' : 'hover:bg-blue-600 hover:text-white'}`}
            >
              <ChevronLeft size={20} />
            </Link>
            {/* Navigasi nomor halaman... */}
            <Link
              href={{ pathname: '/dokumen', query: { kategori, tahun, q, page: Math.min(totalPages, currentPage + 1) } }}
              className={`p-3 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all ${currentPage === totalPages ? 'opacity-30 pointer-events-none' : 'hover:bg-blue-600 hover:text-white'}`}
            >
              <ChevronRight size={20} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}