import { NextResponse } from "next/server";
import { getNews } from "@/lib/news";
import { summarizeNews } from "@/lib/claude";

export async function POST() {
  try {
    const news = await getNews();
    const allNews = [...news.pf, ...news.realestate, ...news.construction];
    const result = await summarizeNews(allNews);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
