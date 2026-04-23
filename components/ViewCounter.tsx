'use client';

import { useEffect, useRef } from 'react';

export default function ViewCounter({ id }: { id: string }) {
  // useRef untuk memastikan proses fetch tidak diduplikasi oleh React
  const hasCalled = useRef(false);

  useEffect(() => {
    // 1. Validasi: Jangan jalan kalau ID tidak ada atau sudah pernah dipanggil di sesi ini
    if (!id || hasCalled.current) return;

    // 2. Cek Session Storage: Mencegah +1 views saat user cuma sekadar refresh halaman
    const viewedPosts = JSON.parse(sessionStorage.getItem('viewed_posts') || '[]');
    
    if (viewedPosts.includes(id)) {
      return; // Sudah pernah lihat berita ini di sesi sekarang, batalkan update
    }

    // 3. Proses Update Views
    const updateViews = async () => {
      try {
        hasCalled.current = true; // Tandai sudah dipanggil (pengaman Strict Mode)

        const res = await fetch(`/api/views/${id}`, { 
          method: 'POST',
          cache: 'no-store' 
        });

        if (res.ok) {
          // 4. Tandai di sessionStorage agar refresh tidak nambah angka lagi
          const updatedHistory = [...viewedPosts, id];
          sessionStorage.setItem('viewed_posts', JSON.stringify(updatedHistory));
          console.log(`✅ View updated for: ${id}`);
        }
      } catch (error) {
        console.error("❌ ViewCounter Error:", error);
      }
    };

    updateViews();
  }, [id]);

  return null;
}