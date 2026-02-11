export default function Hero() {
  return (
    <section className="relative h-[420px]">
      
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1604152135912-04a022e23696')",
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-blue-900/70" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
        <div className="text-white max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Selamat Datang di Website Resmi
            <br />
            Korwilcam Pendidikan
          </h2>
          <p className="text-sm md:text-base opacity-90">
            Pusat informasi, publikasi, dan layanan pendidikan
            Kecamatan Purwokerto Barat.
          </p>
        </div>
      </div>

    </section>
  )
}
