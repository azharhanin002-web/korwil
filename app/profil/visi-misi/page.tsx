import { Newspaper } from "lucide-react";

export default function VisiMisiPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-16 min-h-screen bg-white">
      {/* Header Halaman */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-black text-[#002040] mb-4 uppercase tracking-tight">Visi & Misi</h1>
        <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
        <p className="text-gray-500 mt-4 font-medium">Korwilcam Dinas Pendidikan Kecamatan Purwokerto Barat</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Kolom Visi */}
        <div className="bg-blue-900 text-white p-10 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-10">
            <Newspaper size={200} />
          </div>
          <h2 className="text-2xl font-bold mb-6 border-b border-white/20 pb-4 inline-block italic uppercase tracking-widest">VISI</h2>
          <p className="text-2xl md:text-3xl font-light leading-relaxed italic">
            "Mewujudkan insan pendidikan yang berakhlak mulia, cerdas, terampil, dan unggul dalam prestasi di wilayah Purwokerto Barat."
          </p>
        </div>

        {/* Kolom Misi */}
        <div>
          <h2 className="text-2xl font-bold text-[#002040] mb-8 border-l-4 border-blue-600 pl-4 uppercase tracking-widest">MISI</h2>
          <div className="space-y-6">
            {[
              "Meningkatkan mutu pelayanan administrasi pendidikan yang transparan dan akuntabel.",
              "Mendorong terciptanya tenaga pendidik yang profesional dan inovatif.",
              "Mengoptimalkan pembinaan karakter peserta didik berbasis kearifan lokal.",
              "Menjalin kerjasama yang sinergis dengan seluruh stakeholder pendidikan."
            ].map((misi, i) => (
              <div key={i} className="flex gap-4 p-5 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors border border-gray-100">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </span>
                <p className="text-gray-700 font-medium leading-relaxed">{misi}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}