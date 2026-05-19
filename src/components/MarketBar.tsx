"use client";

import type { MarketData, Ticker } from "@/types";

function Tick({ t }: { t: Ticker }) {
  const has = t.value !== 0;
  const up = t.change >= 0;
  const chColor = has ? (up ? "text-emerald-400" : "text-red-400") : "text-zinc-700";

  return (
    <div className="flex items-center gap-2 px-4 border-r border-zinc-800 last:border-0 shrink-0 h-full">
      <span className="text-[10px] text-zinc-500 tracking-wider uppercase font-medium">{t.label}</span>
      <span className="text-xs font-mono text-zinc-100">
        {has ? t.value.toLocaleString("ko-KR", { maximumFractionDigits: 2 }) : "--"}
      </span>
      {has && (
        <span className={`text-[10px] font-mono ${chColor}`}>
          {up ? "▲" : "▼"} {Math.abs(t.changePct).toFixed(2)}%
        </span>
      )}
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
  return (
    <div className="bg-black border-b border-zinc-800 h-9 flex items-center justify-between shrink-0 overflow-hidden">
      {data ? (
        <div className="flex items-center h-full overflow-x-auto">
          <Tick t={data.kospi} />
          <Tick t={data.kosdaq} />
          <Tick t={data.usdKrw} />
          <Tick t={data.jpyKrw100} />
          <Tick t={data.us10y} />
        </div>
      ) : (
        <span className="text-zinc-600 text-[10px] px-4">시세 로딩 중...</span>
      )}
      <span className="text-zinc-700 text-[10px] px-4 shrink-0 font-mono">{updatedAt}</span>
    </div>
  );
}
