import { client } from "@/lib/sanity/client";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    
    // Gunakan client.withConfig agar punya izin menulis (Write Token)
    const result = await client
      .withConfig({ 
        token: process.env.SANITY_WRITE_TOKEN, // Pastikan token ini ada di Vercel
        useCdn: false 
      })
      .patch(id)
      .setIfMissing({ views: 0 })
      .inc({ views: 1 })
      .commit();

    return NextResponse.json({ views: result.views });
  } catch (error) {
    console.error("View Counter Error:", error);
    return NextResponse.json({ error: "Gagal update views" }, { status: 500 });
  }
}