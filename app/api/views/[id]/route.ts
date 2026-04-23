import { client } from "@/lib/sanity/client";
import { NextResponse } from "next/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params; // WAJIB AWAIT di Next.js 15+

    if (!id) return NextResponse.json({ error: "ID Kosong" }, { status: 400 });

    const result = await client
      .withConfig({ 
        token: process.env.SANITY_API_TOKEN, // Pastikan token Editor ada di sini
        useCdn: false 
      })
      .patch(id)
      .setIfMissing({ views: 0 })
      .inc({ views: 1 })
      .commit();

    return NextResponse.json({ views: result.views });
  } catch (error: any) {
    console.error("View Counter Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}