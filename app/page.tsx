import { getMarketData } from "@/lib/market";
import { getNews } from "@/lib/news";
import MarketBar from "@/components/MarketBar";
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
      {/* Header */}
      <header className="bg-black border-b border-zinc-800 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-amber-400 font-bold text-sm tracking-wider">DL이앤씨 재무솔루션팀</span>
          <span className="text-zinc-700 text-xs">|</span>
          <span className="text-zinc-500 text-xs">Market Intelligence</span>
        </div>
        <span className="text-zinc-600 text-[10px]">
          {new Date().toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric", weekday: "short" })}
        </span>
      </header>

      {/* Market Ticker Bar */}
      <MarketBar data={marketData} updatedAt={updatedAt} />

      {/* Main Grid */}
      <main className="flex-1 overflow-hidden grid grid-cols-4 gap-px bg-zinc-800">
        {/* News columns */}
        {(["pf", "realestate", "construction"] as const).map((cat) => (
          <div key={cat} className="bg-zinc-950 p-4 overflow-hidden flex flex-col">
            <NewsColumn category={cat} items={newsData[cat]} />
          </div>
        ))}

        {/* AI Summary Panel */}
        <div className="bg-zinc-950 p-4 overflow-hidden">
          <SummaryPanel />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-zinc-800 px-4 py-1 shrink-0">
        <p className="text-zinc-700 text-[10px]">
          데이터: Yahoo Finance · RSS 뉴스 | 30분마다 자동 갱신 | 투자 참고용 — 투자 결정의 책임은 본인에게 있습니다.
        </p>
      </footer>
    </div>
  );
}
