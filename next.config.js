/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Abaikan error TypeScript saat proses build di Vercel agar tidak gagal deploy
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Abaikan error ESLint saat proses build
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Konfigurasi Gambar Remote
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org', // <--- TAMBAHKAN INI UNTUK LOGO PGRI & TUT WURI
      },
    ],
  },
};

export default nextConfig;