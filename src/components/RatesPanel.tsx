import type { MarketData, Ticker } from "@/types";

// 수동 관리 단기금리 — 한국은행 및 금융투자협회 기준
const REF_RATES = [
  { label: "기준금리", value: "2.75", note: "한국은행" },
  { label: "CD 91일", value: "3.05", note: "" },
  { label: "CP 91일", value: "3.18", note: "" },
  { label: "KORIBOR 3M", value: "2.98", note: "" },
];

function numFmt(v: number, dec = 2): string {
  if (v === 0) return "--";
  return v.toLocaleString("ko-KR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[9px] text-zinc-600 uppercase tracking-[0.15em] mb-[5px]">{children}</p>
  );
}

function Divider() {
  return <div className="border-t border-zinc-800 my-2" />;
}

function TickerRow({ ticker, dec = 2 }: { ticker: Ticker; dec?: number }) {
  const hasData = ticker.value !== 0;
  const up = ticker.change >= 0;
  return (
    <div className="mb-[6px]">
      <div className="text-[9px] text-zinc-500 leading-none mb-[2px]">{ticker.label}</div>
      <div className="flex items-baseline gap-[6px]">
        <span className="text-[13px] font-mono text-zinc-100 leading-none">
          {numFmt(ticker.value, dec)}
        </span>
        {hasData && (
          <span className={`text-[10px] font-mono ${up ? "text-emerald-500" : "text-red-400"}`}>
            {up ? "▲" : "▼"} {Math.abs(ticker.changePct).toFixed(2)}%
          </span>
        )}
      </div>
    </div>
  );
}

export default function RatesPanel({ data }: { data: MarketData | null }) {
  return (
    <div className="h-full flex flex-col overflow-y-auto p-3 gap-0">
      {/* Panel header */}
      <div className="flex items-center gap-2 pb-2 mb-2 border-b border-zinc-800 shrink-0">
        <span className="text-[10px] font-bold tracking-[0.2em] text-amber-400 uppercase">
          Rates
        </span>
      </div>

      {data ? (
        <>
          <SectionHead>주요 지수</SectionHead>
          <TickerRow ticker={data.kospi} />
          <TickerRow ticker={data.kosdaq} />

          <Divider />

          <SectionHead>환율</SectionHead>
          <TickerRow ticker={data.usdKrw} />
          <TickerRow ticker={data.jpyKrw100} />

          <Divider />

          <SectionHead>금리</SectionHead>
          <TickerRow ticker={data.us10y} dec={3} />
        </>
      ) : (
        <>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 bg-zinc-900 rounded animate-pulse mb-2" />
          ))}
        </>
      )}

      <Divider />

      {/* Static reference rates */}
      <SectionHead>단기금융 <span className="normal-case text-zinc-700">(참고)</span></SectionHead>
      <div className="space-y-[4px]">
        {REF_RATES.map(({ label, value, note }) => (
          <div key={label} className="flex items-center justify-between">
            <span className="text-[9px] text-zinc-500">{label}</span>
            <div className="text-right">
              <span className="text-[11px] font-mono text-zinc-300">{value}%</span>
              {note && <span className="text-[9px] text-zinc-700 ml-1">{note}</span>}
            </div>
          </div>
        ))}
      </div>
      <p className="text-[9px] text-zinc-700 mt-2">※ 수동 관리 — 정기 업데이트 필요</p>
    </div>
  );
}
