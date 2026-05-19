"use client";

import type { MarketData, Ticker } from "@/types";

function TickerItem({ ticker }: { ticker: Ticker }) {
  const isUp = ticker.change >= 0;
  const color = isUp ? "text-emerald-400" : "text-red-400";
  const arrow = isUp ? "▲" : "▼";

  return (
    <div className="flex items-center gap-3 px-6 border-r border-zinc-700 last:border-0">
      <span className="text-zinc-400 text-xs font-medium tracking-wider uppercase">
        {ticker.label}
      </span>
      <span className="text-white font-mono text-sm font-semibold">
        {ticker.value.toLocaleString("ko-KR", { maximumFractionDigits: 2 })}
      </span>
      <span className={`${color} font-mono text-xs`}>
        {arrow} {Math.abs(ticker.change).toFixed(2)} ({Math.abs(ticker.changePct).toFixed(2)}%)
      </span>
    </div>
  );
}

export default function MarketBar({
  data,
  updatedAt,
}: {
  data: MarketData | null;
  updatedAt: string;
}) {
  if (!data) {
    return (
      <div className="bg-zinc-900 border-b border-zinc-700 h-11 flex items-center px-4">
        <span className="text-zinc-500 text-xs">시세 로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border-b border-zinc-700 h-11 flex items-center justify-between">
      <div className="flex items-center h-full">
        <TickerItem ticker={data.kospi} />
        <TickerItem ticker={data.usdKrw} />
        <TickerItem ticker={data.us10y} />
      </div>
      <span className="text-zinc-600 text-xs pr-4 font-mono">
        {updatedAt}
      </span>
    </div>
  );
}
