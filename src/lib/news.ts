import Parser from "rss-parser";
import type { NewsItem } from "@/types";

const parser = new Parser({ timeout: 8000 });

const RSS_FEEDS: { url: string; source: string; category: NewsItem["category"] }[] = [
  // 부동산
  { url: "https://www.hankyung.com/feed/realestate", source: "한국경제", category: "realestate" },
  { url: "https://land.mk.co.kr/rss/S1N1.xml", source: "매일경제", category: "realestate" },
  // 건설
  { url: "https://www.hankyung.com/feed/construction", source: "한국경제", category: "construction" },
  { url: "https://www.etoday.co.kr/rss/section/estate.xml", source: "이투데이", category: "construction" },
  // PF / 금융
  { url: "https://www.hankyung.com/feed/finance", source: "한국경제", category: "pf" },
  { url: "https://news.einfomax.co.kr/rss/allnews.xml", source: "연합인포맥스", category: "pf" },
];

const PF_KEYWORDS = ["PF", "프로젝트파이낸싱", "브릿지론", "시행사", "시공사", "부동산금융", "ABCP", "유동화"];

function isPfRelated(title: string): boolean {
  return PF_KEYWORDS.some((kw) => title.includes(kw));
}

async function fetchFeed(
  feed: (typeof RSS_FEEDS)[number]
): Promise<NewsItem[]> {
  try {
    const result = await parser.parseURL(feed.url);
    return result.items.slice(0, 10).map((item) => ({
      title: item.title ?? "",
      link: item.link ?? "",
      pubDate: item.pubDate ?? item.isoDate ?? "",
      source: feed.source,
      category: isPfRelated(item.title ?? "") ? "pf" : feed.category,
    }));
  } catch {
    return [];
  }
}

export async function getNews(): Promise<Record<NewsItem["category"], NewsItem[]>> {
  const results = await Promise.all(RSS_FEEDS.map(fetchFeed));
  const all = results.flat();

  const grouped: Record<NewsItem["category"], NewsItem[]> = {
    realestate: [],
    construction: [],
    pf: [],
  };

  for (const item of all) {
    if (item.title) grouped[item.category].push(item);
  }

  // 최신순 정렬, 카테고리별 최대 15개
  for (const key of Object.keys(grouped) as NewsItem["category"][]) {
    grouped[key] = grouped[key]
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, 15);
  }

  return grouped;
}
