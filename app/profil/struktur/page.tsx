import { client } from "@/lib/sanity/client";
import { officialsQuery } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";
import Image from "next/image";

export default async function StrukturPage() {
  const officials = await client.fetch(officialsQuery);

  return (
    <main className="max-w-7xl mx-auto px-4 py-16 bg-white min-h-screen">
      <div className="text-center mb-20">
        <h1 className="text-4xl font-black text-[#002040] mb-4 uppercase tracking-tight">Struktur Organisasi</h1>
        <div className="w-24 h-1.5 bg-orange-500 mx-auto rounded-full"></div>
        <p className="text-gray-500 mt-4">Personel Kantor Korwilcam Dindik Kecamatan Purwokerto Barat</p>
      </div>

      {officials.length === 0 ? (
        <div className="text-center py-20 text-gray-400 italic">Data personel belum diunggah di Sanity Studio.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {officials.map((person: any) => (
            <div key={person._id} className="group text-center">
              <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:border-blue-500 transition-all duration-500">
                {person.image ? (
                  <Image
                    src={urlFor(person.image).url()}
                    alt={person.name}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                    No Photo
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-[#002040] uppercase tracking-wide group-hover:text-blue-600 transition-colors">
                {person.name}
              </h3>
              <p className="text-blue-600 font-bold text-xs mb-1">{person.position}</p>
              <p className="text-gray-400 text-[10px] font-medium tracking-widest">NIP. {person.nip || '-'}</p>
            </div>
          ))}
        </div>
      )}

      {/* Footer Note */}
      <div className="mt-20 p-8 bg-gray-50 rounded-3xl border border-gray-100 text-center">
        <p className="text-sm text-gray-500 leading-relaxed italic">
          "Bekerja bersama demi kemajuan pendidikan di Purwokerto Barat yang lebih baik."
        </p>
      </div>
    </main>
  );
}