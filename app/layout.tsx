import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// --- PERBAIKAN IMPORT ---
// Kita menggunakan Navbar.tsx yang baru saja dibuat
import Navbar from "../components/Navbar"; 
import Footer from "../components/Footer"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Korwilcam Pendidikan Purwokerto Barat",
  description: "Portal Resmi Dinas Pendidikan Korwilcam Purwokerto Barat",
  icons: {
    icon: '/favicon.ico', // Pastikan ada icon (opsional)
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        
        {/* 1. Navbar (Menu Navigasi) */}
        <Navbar />
        
        {/* 2. Main Content (Isi Halaman) */}
        {/* flex-grow memaksa bagian ini mengisi ruang kosong agar footer terdorong ke bawah */}
        <main className="flex-grow bg-gray-50">
          {children}
        </main>

        {/* 3. Footer (Kaki Halaman) */}
        <Footer />
        
      </body>
    </html>
  );
}