import type { MarketData, Ticker } from "@/types";

// 수동 관리 단기금리
const REF_RATES = [
  { label: "기준금리", value: "2.75", note: "한국은행" },
  { label: "CD 91일",  value: "3.05", note: "" },
  { label: "CP 91일",  value: "3.18", note: "" },
  { label: "KORIBOR 3M", value: "2.98", note: "" },
];

function numFmt(v: number, dec = 2) {
  if (v === 0) return "--";
  return v.toLocaleString("ko-KR", { minimumFractionDigits: dec, maximumFractionDigits: dec });
}

// 한국 증시 관례: 상승=빨강, 하락=파랑
function chColor(change: number) {
  if (change === 0) return "text-zinc-600";
  return change > 0 ? "text-red-500" : "text-blue-400";
}

function SectionHead({ children }: { children: React.ReactNode }) {
  return <p className="text-[9px] text-zinc-600 uppercase tracking-[0.15em] mb-[5px]">{children}</p>;
}

function Divider() {
  return <div className="border-t border-zinc-800 my-[9px]" />;
}

// 주가 / 환율용 — 퍼센트 변동 표시
function TickerRow({ t, dec = 2 }: { t: Ticker; dec?: number }) {
  const has = t.value !== 0;
  return (
    <div className="mb-[7px]">
      <div className="text-[9px] text-zinc-500 leading-none mb-[2px]">{t.label}</div>
      <div className="flex items-baseline gap-[6px]">
        <span className="text-[13px] font-mono text-zinc-100">{numFmt(t.value, dec)}</span>
        {has && (
          <span className={`text-[10px] font-mono ${chColor(t.change)}`}>
            {t.change > 0 ? "▲" : "▼"} {Math.abs(t.changePct).toFixed(2)}%
          </span>
        )}
      </div>
    </div>
  );
}

// 채권용 — 절대 변동폭(bp) 표시
function BondRow({ t }: { t: Ticker }) {
  const has = t.value !== 0;
  const absCh = Math.abs(t.change);
  // bp 단위: 0.01% = 1bp, 표시는 소수점 3자리
  const bpStr = absCh >= 0.001 ? `${absCh.toFixed(3)}%p` : "";
  return (
    <div className="mb-[7px]">
      <div className="text-[9px] text-zinc-500 leading-none mb-[2px]">{t.label}</div>
      <div className="flex items-baseline gap-[6px]">
        <span className="text-[13px] font-mono text-zinc-100">{has ? `${numFmt(t.value, 3)}%` : "--"}</span>
        {has && t.change !== 0 && (
          <span className={`text-[10px] font-mono ${chColor(t.change)}`}>
            {t.change > 0 ? "▲" : "▼"} {bpStr}
          </span>
        )}
      </div>
    </div>
  );
}

export default function RatesPanel({ data }: { data: MarketData | null }) {
  return (
    <div className="h-full flex flex-col overflow-y-auto p-3">
      {/* 헤더 */}
      <div className="flex items-center gap-2 pb-2 mb-2 border-b border-zinc-800 shrink-0">
        <span className="text-[10px] font-bold tracking-[0.2em] text-amber-400 uppercase">Rates</span>
      </div>

      {data ? (
        <>
          <SectionHead>주요 지수</SectionHead>
          <TickerRow t={data.kospi} />
          <TickerRow t={data.kosdaq} />

          <Divider />

          <SectionHead>환율</SectionHead>
          <TickerRow t={data.usdKrw} />
          <TickerRow t={data.jpyKrw100} />

          <Divider />

          <SectionHead>채권 금리</SectionHead>
          <BondRow t={data.kr5y} />
          <BondRow t={data.kr10y} />
          <BondRow t={data.us10y} />
        </>
      ) : (
        <div className="space-y-2">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-8 bg-zinc-900 rounded animate-pulse" />
          ))}
        </div>
      )}

      <Divider />

      {/* 단기금리 참고값 */}
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
