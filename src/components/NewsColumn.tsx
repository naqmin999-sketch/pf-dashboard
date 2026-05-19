import type { NewsItem } from "@/types";

const LABEL: Record<NewsItem["category"], string> = {
  realestate: "부동산",
  construction: "건설",
  pf: "PF · 금융",
};

const HEAD_COLOR: Record<NewsItem["category"], string> = {
  realestate: "text-sky-400 border-sky-500",
  construction: "text-amber-400 border-amber-500",
  pf: "text-violet-400 border-violet-500",
};

// 각 카테고리별 hover 시 left border 색 — 동적 클래스 생성 방지용 정적 맵
const ITEM_HOVER: Record<NewsItem["category"], string> = {
  realestate: "hover:border-l-sky-600 hover:bg-zinc-900/70",
  construction: "hover:border-l-amber-600 hover:bg-zinc-900/70",
  pf: "hover:border-l-violet-600 hover:bg-zinc-900/70",
};

function ago(pubDate: string): string {
  if (!pubDate) return "";
  const m = (Date.now() - new Date(pubDate).getTime()) / 60000;
  if (isNaN(m) || m < 0) return "";
  if (m < 60) return `${Math.floor(m)}m`;
  if (m < 1440) return `${Math.floor(m / 60)}h`;
  return `${Math.floor(m / 1440)}d`;
}

function agoColor(pubDate: string): string {
  if (!pubDate) return "text-zinc-700";
  const m = (Date.now() - new Date(pubDate).getTime()) / 60000;
  if (isNaN(m) || m < 0) return "text-zinc-700";
  if (m < 60) return "text-emerald-500";
  if (m < 360) return "text-amber-600";
  return "text-zinc-600";
}

const FALLBACK_SOURCES = new Set(["한국은행", "금융감독원", "국토교통부", "건설협회", "주택협회", "한국부동산원"]);

export default function NewsColumn({
  category,
  items,
}: {
  category: NewsItem["category"];
  items: NewsItem[];
}) {
  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Column header */}
      <div className="flex items-center gap-2 pb-2 mb-1 border-b border-zinc-800 shrink-0">
        <span className={`text-[10px] font-bold tracking-[0.15em] uppercase border-l-2 pl-2 ${HEAD_COLOR[category]}`}>
          {LABEL[category]}
        </span>
        <span className="text-zinc-700 text-[10px]">{items.length}건</span>
      </div>

      {/* News list */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {items.length === 0 && (
          <p className="text-zinc-700 text-[10px] pt-3 px-2">뉴스를 불러올 수 없습니다.</p>
        )}
        {items.map((item, i) => {
          const isFallback = FALLBACK_SOURCES.has(item.source);
          const time = ago(item.pubDate);

          const inner = (
            <>
              <div className="flex items-center gap-1 mb-[2px]">
                {time && (
                  <span className={`font-mono text-[9px] w-5 shrink-0 ${agoColor(item.pubDate)}`}>
                    {time}
                  </span>
                )}
                <span className="text-[9px] text-zinc-600 truncate">{item.source}</span>
              </div>
              <p
                className={`text-[11px] leading-snug line-clamp-2 transition-colors ${
                  isFallback
                    ? "text-zinc-600"
                    : "text-zinc-300 group-hover:text-zinc-100"
                }`}
              >
                {item.title}
              </p>
            </>
          );

          const base = `group block py-[5px] px-2 border-l-2 border-l-transparent transition-all ${ITEM_HOVER[category]}`;

          return item.link ? (
            <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className={base}>
              {inner}
            </a>
          ) : (
            <div key={i} className="block py-[5px] px-2 border-l-2 border-l-transparent">
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
