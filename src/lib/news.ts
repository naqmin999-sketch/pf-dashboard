import type { NewsItem } from "@/types";

// 확인된 동작 피드만 사용
const RSS_FEEDS: { url: string; source: string; category: NewsItem["category"] }[] = [
  { url: "https://www.hankyung.com/feed/realestate", source: "한국경제", category: "realestate" },
  { url: "https://www.hankyung.com/feed/finance", source: "한국경제", category: "pf" },
  { url: "https://www.hankyung.com/feed/economy", source: "한국경제", category: "construction" },
];

const PF_KEYWORDS = [
  "PF", "프로젝트파이낸싱", "브릿지론", "시행사", "시공사",
  "부동산금융", "ABCP", "유동화", "PF대출",
];

const CONSTRUCTION_KEYWORDS = [
  "건설", "시공", "착공", "분양", "준공", "공사", "건축", "아파트",
  "재건축", "재개발", "주택", "수주", "주상복합", "오피스텔",
  "도시정비", "GS건설", "현대건설", "DL이앤씨", "포스코건설",
  "HDC", "삼성물산", "롯데건설", "건설사",
];

function isPf(title: string) {
  return PF_KEYWORDS.some((k) => title.includes(k));
}
function isConstruction(title: string) {
  return CONSTRUCTION_KEYWORDS.some((k) => title.includes(k));
}

function extractField(block: string, tag: string): string {
  const m = block.match(
    new RegExp(`<${tag}(?:\\s[^>]*)?>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, "i"),
  );
  return decode(m?.[1]?.trim() ?? "");
}

function extractLink(block: string): string {
  const t = extractField(block, "link");
  if (t.startsWith("http")) return t;
  const a = block.match(/<link[^>]+href="([^"]+)"/i)?.[1];
  if (a) return a;
  const g = extractField(block, "guid");
  return g.startsWith("http") ? g : "";
}

function decode(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(Number(c)));
}

function parseItems(
  xml: string,
  source: string,
  feedCategory: NewsItem["category"],
): NewsItem[] {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) ?? [];
  const out: NewsItem[] = [];
  for (const block of blocks.slice(0, 20)) {
    const title = extractField(block, "title");
    if (!title) continue;
    // economy 피드는 건설 키워드 기사만 포함
    if (feedCategory === "construction" && !isConstruction(title)) continue;
    const category: NewsItem["category"] = isPf(title) ? "pf" : feedCategory;
    out.push({ title, link: extractLink(block), pubDate: extractField(block, "pubDate"), source, category });
  }
  return out;
}

async function fetchFeed(feed: (typeof RSS_FEEDS)[number]): Promise<NewsItem[]> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 7000);
  try {
    const res = await fetch(feed.url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "application/rss+xml, application/xml, text/xml, */*",
        "Accept-Language": "ko-KR,ko;q=0.9",
      },
    });
    if (!res.ok) return [];
    return parseItems(await res.text(), feed.source, feed.category);
  } catch {
    return [];
  } finally {
    clearTimeout(t);
  }
}

// 피드 실패 시 표시할 참고 링크 — 실제 존재하는 페이지
const FALLBACK: Record<NewsItem["category"], NewsItem[]> = {
  realestate: [
    { title: "한국경제 부동산 — 최신 부동산 뉴스 보기", link: "https://www.hankyung.com/realestate", pubDate: "", source: "한국경제", category: "realestate" },
    { title: "국토교통부 주택 정책 및 통계 현황", link: "https://www.molit.go.kr", pubDate: "", source: "국토교통부", category: "realestate" },
    { title: "한국부동산원 부동산 통계 정보시스템", link: "https://www.reb.or.kr", pubDate: "", source: "한국부동산원", category: "realestate" },
  ],
  construction: [
    { title: "한국경제 경제 섹션 — 건설·산업 동향", link: "https://www.hankyung.com/economy", pubDate: "", source: "한국경제", category: "construction" },
    { title: "대한건설협회 건설경기 모니터링 보고서", link: "https://www.cak.or.kr", pubDate: "", source: "건설협회", category: "construction" },
    { title: "국토교통부 건설공사 발주·착공 현황", link: "https://www.molit.go.kr", pubDate: "", source: "국토교통부", category: "construction" },
    { title: "한국주택협회 분양·주택 통계", link: "https://www.kha.or.kr", pubDate: "", source: "주택협회", category: "construction" },
  ],
  pf: [
    { title: "한국경제 금융 섹션 — 최신 PF·금융 뉴스", link: "https://www.hankyung.com/finance", pubDate: "", source: "한국경제", category: "pf" },
    { title: "금융감독원 부동산 PF 관련 공시 및 지침", link: "https://www.fss.or.kr", pubDate: "", source: "금융감독원", category: "pf" },
    { title: "한국은행 금융안정 보고서 — 부동산 PF 리스크", link: "https://www.bok.or.kr", pubDate: "", source: "한국은행", category: "pf" },
  ],
};

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

  for (const key of Object.keys(grouped) as NewsItem["category"][]) {
    grouped[key] = grouped[key]
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, 15);
    if (grouped[key].length === 0) grouped[key] = FALLBACK[key];
  }

  return grouped;
}
