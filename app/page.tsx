import { getMarketData } from "@/lib/market";
import { getNews } from "@/lib/news";
import MarketBar from "@/components/MarketBar";
import RatesPanel from "@/components/RatesPanel";
import NewsColumn from "@/components/NewsColumn";
import SummaryPanel from "@/components/SummaryPanel";

export const revalidate = 1800;

function formatKST(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function DashboardPage() {
  const [market, news] = await Promise.allSettled([getMarketData(), getNews()]);

  const marketData = market.status === "fulfilled" ? market.value : null;
  const newsData =
    news.status === "fulfilled"
      ? news.value
      : { realestate: [], construction: [], pf: [] };

  const updatedAt = marketData ? formatKST(marketData.updatedAt) : "--";

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-zinc-950">

      {/* ── Header ── */}
      <header className="bg-black border-b border-zinc-800 h-9 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-bold text-xs tracking-wider">DL이앤씨</span>
          <span className="text-zinc-800 text-[10px]">|</span>
          <span className="text-zinc-500 text-[10px] tracking-wide">재무솔루션팀 · Market Intelligence</span>
        </div>
        <span className="text-zinc-600 text-[10px] font-mono">
          {new Date().toLocaleDateString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            weekday: "short",
          })}
        </span>
      </header>

      {/* ── Ticker Bar ── */}
      <MarketBar data={marketData} updatedAt={updatedAt} />

      {/* ── Main 5-Panel Layout ── */}
      <main className="flex-1 overflow-hidden flex gap-px bg-zinc-800 min-h-0">

        {/* Panel 1 — Market Rates */}
        <aside className="w-48 bg-zinc-950 shrink-0 overflow-hidden">
          <RatesPanel data={marketData} />
        </aside>

        {/* Panels 2-4 — News Columns */}
        {(["pf", "realestate", "construction"] as const).map((cat) => (
          <section
            key={cat}
            className="flex-1 bg-zinc-950 px-3 py-3 overflow-hidden flex flex-col min-w-0"
          >
            <NewsColumn category={cat} items={newsData[cat]} />
          </section>
        ))}

        {/* Panel 5 — AI Summary */}
        <aside className="w-52 bg-zinc-950 shrink-0 px-3 py-3 overflow-hidden flex flex-col">
          <SummaryPanel />
        </aside>

      </main>

      {/* ── Footer ── */}
      <footer className="bg-black border-t border-zinc-800 h-6 px-4 shrink-0 flex items-center">
        <p className="text-zinc-700 text-[9px] font-mono">
          Yahoo Finance · RSS 뉴스 · 30분 캐시 &nbsp;|&nbsp; 투자 참고용 — 투자 결정의 책임은 본인에게 있습니다
        </p>
      </footer>

    </div>
  );
}
