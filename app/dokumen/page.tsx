import { client } from "@/lib/sanity/client";
import { documentsQuery } from "@/lib/sanity/queries";
import { FileText, Download, Search, Info, Calendar } from "lucide-react";
import Link from "next/link";

export const revalidate = 0;

export default async function DokumenPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;
  const allDocs = await client.fetch(documentsQuery);

  // KATEGORI (Value harus sama persis dengan yang ada di skema documentFile.ts)
  const categories = [
    { label: "Semua", value: "" },
    { label: "SK", value: "SK" },
    { label: "SE", value: "SE" },
    { label: "Peraturan", value: "Peraturan" },
    { label: "Formulir", value: "Formulir" },
    { label: "Lainnya", value: "Lainnya" },
  ];

  const filteredDocs = kategori 
    ? allDocs.filter((doc: any) => doc.category === kategori)
    : allDocs;

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
        {/* TAB FILTER */}
        <div className="bg-white p-2 rounded-[2rem] shadow-xl border border-slate-100 mb-10 overflow-x-auto no-scrollbar">
          <div className="flex items-center min-w-max gap-1">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.value ? `/dokumen?kategori=${cat.value}` : "/dokumen"}
                className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                  (kategori === cat.value || (!kategori && cat.value === ""))
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
                }`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* LIST DOKUMEN */}
        <div className="grid grid-cols-1 gap-4">
          {filteredDocs && filteredDocs.length > 0 ? (
            filteredDocs.map((doc: any) => (
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
                    {doc.fileUrl ? (
                      <a
                        href={`${doc.fileUrl}?dl=${doc.fileName}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-lg"
                      >
                        <Download size={18} /> Download
                      </a>
                    ) : (
                      <span className="text-xs font-bold text-red-500 italic">File Kosong</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
              <Search size={40} className="mx-auto text-slate-200 mb-4" />
              <h3 className="text-xl font-bold text-slate-400">Dokumen tidak ditemukan.</h3>
              <p className="text-sm text-slate-300">Cek tipe dokumen di Sanity (documentFile) dan pastikan sudah di-Publish.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}