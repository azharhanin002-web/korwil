import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // Ambil path tujuan (misal balik ke berita), default ke home
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const cookieStore = await cookies() // Wajib await di Next.js terbaru
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            // Kita bungkus try-catch agar tidak crash di beberapa kondisi edge-case
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // Jika dipanggil dari Server Component yang tidak mengizinkan set cookie
            }
          },
          remove(name: string, options: CookieOptions) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // Jika dipanggil dari Server Component
            }
          },
        },
      }
    )

    // Tukar kode dari Google dengan Sesi Login Supabase
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // TIPS SULTAN: Pastikan redirect menggunakan origin yang lengkap
      // Ini akan otomatis menangani apakah user pakai WWW atau tidak
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Jika gagal (kode expired atau salah), lempar ke halaman error atau home
  console.error("Auth Callback Error: Code tidak valid atau expired");
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}