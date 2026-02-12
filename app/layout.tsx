import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// --- IMPORT KOMPONEN ---
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // 1. Metadata Dasar
  title: {
    default: "Korwilcam Dindik Purwokerto Barat",
    template: "%s | Korwilcam Dindik Purwokerto Barat"
  },
  description: "Portal Resmi Pelayanan Pendidikan Korwilcam Dinas Pendidikan Kecamatan Purwokerto Barat, Kabupaten Banyumas.",
  metadataBase: new URL("https://korwilbarat.web.id"), // Ganti dengan domain asli jika sudah online
  
  // 2. Ikon (Favicon)
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png", // Opsional jika ada
  },

  // 3. Open Graph (Kunci agar muncul di WhatsApp/FB)
  openGraph: {
    title: "Korwilcam Dindik Purwokerto Barat",
    description: "Portal Resmi Pelayanan Pendidikan Kecamatan Purwokerto Barat, Banyumas.",
    url: "https://korwilbarat.web.id",
    siteName: "Korwilcam Dindik Purwokerto Barat",
    images: [
      {
        url: "/og-image.jpg", // WAJIB: Simpan file og-image.jpg di folder /public
        width: 1200,
        height: 630,
        alt: "Thumbnail Korwilcam Dindik Purwokerto Barat",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  // 4. Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Korwilcam Dindik Purwokerto Barat",
    description: "Portal Resmi Pelayanan Pendidikan Purwokerto Barat.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} flex flex-col min-h-screen antialiased`}>
        
        {/* 1. Navbar (Menu Navigasi) */}
        <Navbar />
        
        {/* 2. Main Content */}
        {/* flex-grow memastikan footer tetap di bawah jika konten halaman sedikit */}
        <main className="flex-grow bg-white">
          {children}
        </main>

        {/* 3. Footer (Kaki Halaman) */}
        <Footer />
        
      </body>
    </html>
  );
}