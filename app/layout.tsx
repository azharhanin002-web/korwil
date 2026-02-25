import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// --- IMPORT KOMPONEN ---
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer"; 
import InstallPWA from "../components/InstallPWA"; // Pastikan file ini sudah dibuat di folder components

const inter = Inter({ subsets: ["latin"] });

// Pengaturan Viewport khusus untuk PWA (Theme Color)
export const viewport: Viewport = {
  themeColor: "#002040",
};

export const metadata: Metadata = {
  // 1. Metadata Dasar & metadataBase
  metadataBase: new URL("https://korwilbarat.web.id"),
  title: {
    default: "Korwilcam Dindik Purwokerto Barat",
    template: "%s | Korwilcam Dindik Purwokerto Barat"
  },
  description: "Portal Resmi Pelayanan Pendidikan Korwilcam Dinas Pendidikan Kecamatan Purwokerto Barat, Kabupaten Banyumas.",
  
  // 2. Ikon & PWA Manifest
  manifest: "/manifest.json", // Link ke file manifest PWA
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  // 3. Open Graph
  openGraph: {
    title: "Korwilcam Dindik Purwokerto Barat",
    description: "Portal Resmi Pelayanan Pendidikan Kecamatan Purwokerto Barat, Kabupaten Banyumas.",
    url: "https://korwilbarat.web.id",
    siteName: "Korwilcam Purwokerto Barat",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Logo Korwilcam Dindik Purwokerto Barat",
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

  // 5. Robot & Crawling
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // 6. Metadata Tambahan
  other: {
    "thumbnail": "/og-image.jpg",
    "mobile-web-app-capable": "yes", // Standar PWA
    "apple-mobile-web-app-status-bar-style": "black-translucent", // Standar iOS PWA
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
        
        {/* Navbar */}
        <Navbar />
        
        {/* Main Content */}
        <main className="flex-grow bg-white">
          {children}
        </main>

        {/* Footer */}
        <Footer />

        {/* --- TOMBOL INSTALL PWA (Muncul hanya di HP & jika belum terinstal) --- */}
        <InstallPWA />
        
      </body>
    </html>
  );
}