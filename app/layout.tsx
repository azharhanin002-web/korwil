import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// --- IMPORT KOMPONEN ---
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer"; 
import InstallPWA from "../components/InstallPWA";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#002040",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  // 1. Metadata Dasar
  metadataBase: new URL("https://www.korwilbarat.web.id"),
  title: {
    default: "Korwilcam Dindik Purwokerto Barat | Portal Resmi Pendidikan",
    template: "%s | Korwilcam Purwokerto Barat"
  },
  description: "Portal resmi pelayanan pendidikan Korwilcam Dinas Pendidikan Kecamatan Purwokerto Barat, Kabupaten Banyumas. Informasi guru, sekolah dasar, dan kegiatan kepramukaan terupdate.",
  keywords: [
    "Korwilcam Purwokerto Barat", 
    "Dindik Banyumas", 
    "Dinas Pendidikan Purwokerto", 
    "Info Guru Purwokerto", 
    "SD Negeri Purwokerto Barat", 
    "Pendidikan Banyumas",
    "PGRI Purwokerto Barat",
    "Kwarran Purwokerto Barat"
  ],
  authors: [{ name: "Admin Korwilcam Purwokerto Barat" }],
  creator: "Korwilcam Dindik Purwokerto Barat",
  
  // 2. Verifikasi & Kanonikal (PENTING UNTUK SEARCH CONSOLE)
  alternates: {
    canonical: "https://www.korwilbarat.web.id",
  },
  verification: {
    // Masukkan kode verifikasi dari Google Search Console di sini nanti
    google: "MASUKKAN_KODE_VERIFIKASI_KAMU_DI_SINI",
  },

  // 3. Ikon & PWA
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png" },
    ],
  },

  // 4. Open Graph (WhatsApp, FB)
  openGraph: {
    title: "Korwilcam Dindik Purwokerto Barat - Melayani dengan Sepenuh Hati",
    description: "Pusat informasi dan pelayanan administrasi pendidikan Kecamatan Purwokerto Barat, Banyumas.",
    url: "https://www.korwilbarat.web.id",
    siteName: "Korwilcam Purwokerto Barat",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Portal Korwilcam Dindik Purwokerto Barat",
      },
    ],
    locale: "id_ID",
    type: "website",
  },

  // 5. Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Korwilcam Dindik Purwokerto Barat",
    description: "Informasi Pendidikan, PGRI, dan Pramuka Purwokerto Barat.",
    images: ["/og-image.jpg"],
  },

  // 6. Robots (Sinkron dengan sitemap.ts)
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // 7. Metadata Tambahan
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-title": "KorwilBarat",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // --- STRUCTURED DATA (JSON-LD) ---
  // Ini membantu Google memunculkan info organisasi di hasil pencarian
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    "name": "Korwilcam Dinas Pendidikan Purwokerto Barat",
    "url": "https://www.korwilbarat.web.id",
    "logo": "https://www.korwilbarat.web.id/icon-512.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+62-xxx-xxxx-xxxx", // Ganti dengan nomor telepon kantor
      "contactType": "customer service",
      "areaServed": "ID",
      "availableLanguage": "Indonesian"
    },
    "sameAs": [
      "https://facebook.com/korwilbarat", // Ganti dengan sosmed asli jika ada
      "https://instagram.com/korwilbarat"
    ]
  };

  return (
    <html lang="id">
      <head>
        {/* Injeksi Script JSON-LD untuk SEO Robot */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen antialiased selection:bg-blue-600 selection:text-white`}>
        
        <Navbar />
        
        <main className="flex-grow bg-white">
          {children}
        </main>

        <Footer />

        {/* Komponen PWA */}
        <InstallPWA />
        
      </body>
    </html>
  );
}