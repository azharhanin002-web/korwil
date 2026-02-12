import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// --- IMPORT KOMPONEN ---
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // 1. Metadata Dasar & metadataBase (WAJIB agar URL Gambar Absolut)
  metadataBase: new URL("https://korwilbarat.web.id"),
  title: {
    default: "Korwilcam Dindik Purwokerto Barat",
    template: "%s | Korwilcam Dindik Purwokerto Barat"
  },
  description: "Portal Resmi Pelayanan Pendidikan Korwilcam Dinas Pendidikan Kecamatan Purwokerto Barat, Kabupaten Banyumas.",
  
  // 2. Ikon (Favicon)
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  // 3. Open Graph (Kunci agar muncul di WhatsApp/FB)
  openGraph: {
    title: "Korwilcam Dindik Purwokerto Barat",
    description: "Portal Resmi Pelayanan Pendidikan Kecamatan Purwokerto Barat, Kabupaten Banyumas.",
    url: "https://korwilbarat.web.id",
    siteName: "Korwilcam Purwokerto Barat",
    images: [
      {
        url: "/og-image.jpg", // Path relatif, otomatis jadi absolut karena metadataBase
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

  // 5. Robot & Crawling (Optimasi Google)
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
        
      </body>
    </html>
  );
}