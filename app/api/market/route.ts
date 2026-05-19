import { NextResponse } from "next/server";
import { getMarketData } from "@/lib/market";

export const revalidate = 1800;

export async function GET() {
  try {
    const data = await getMarketData();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
