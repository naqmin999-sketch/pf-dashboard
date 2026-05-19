import type { NewsItem } from "@/types";

const CATEGORY_LABEL: Record<NewsItem["category"], string> = {
  realestate: "부동산",
  construction: "건설",
  pf: "PF · 금융",
};

const CATEGORY_COLOR: Record<NewsItem["category"], string> = {
  realestate: "text-sky-400 border-sky-400",
  construction: "text-amber-400 border-amber-400",
  pf: "text-violet-400 border-violet-400",
};

function timeAgo(pubDate: string): string {
  if (!pubDate) return "";
  const diff = (Date.now() - new Date(pubDate).getTime()) / 60000;
  if (diff < 60) return `${Math.floor(diff)}분 전`;
  if (diff < 1440) return `${Math.floor(diff / 60)}시간 전`;
  return `${Math.floor(diff / 1440)}일 전`;
}

export default function NewsColumn({
  category,
  items,
}: {
  category: NewsItem["category"];
  items: NewsItem[];
}) {
  return (
    <div className="flex flex-col h-full">
      <div className={`flex items-center gap-2 pb-3 border-b border-zinc-700 mb-3`}>
        <span
          className={`text-xs font-bold tracking-widest uppercase border-l-2 pl-2 ${CATEGORY_COLOR[category]}`}
        >
          {CATEGORY_LABEL[category]}
        </span>
        <span className="text-zinc-600 text-xs">{items.length}건</span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
        {items.length === 0 && (
          <p className="text-zinc-600 text-xs pt-4">뉴스를 불러오는 중...</p>
        )}
        {items.map((item, i) => (
          <a
            key={i}
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="group block py-2 px-2 rounded hover:bg-zinc-800 transition-colors"
          >
            <p className="text-zinc-200 text-xs leading-snug group-hover:text-white line-clamp-2">
              {item.title}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-zinc-600 text-[10px]">{item.source}</span>
              <span className="text-zinc-700 text-[10px]">·</span>
              <span className="text-zinc-600 text-[10px]">{timeAgo(item.pubDate)}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
