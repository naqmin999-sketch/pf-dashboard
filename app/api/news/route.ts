import { NextResponse } from "next/server";
import { getNews } from "@/lib/news";

export const revalidate = 1800;

export async function GET() {
  try {
    const data = await getNews();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
