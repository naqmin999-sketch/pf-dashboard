import type { MarketData, Ticker } from "@/types";

const SYMBOLS = {
  kospi: "^KS11",
  usdKrw: "KRW=X",
  us10y: "^TNX",
};

async function fetchTicker(symbol: string, label: string): Promise<Ticker> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2d`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 1800 },
  });

  if (!res.ok) throw new Error(`Yahoo Finance error: ${symbol}`);

  const json = await res.json();
  const meta = json?.chart?.result?.[0]?.meta;
  if (!meta) throw new Error(`No data for ${symbol}`);

  const value: number = meta.regularMarketPrice ?? 0;
  const prev: number = meta.chartPreviousClose ?? meta.previousClose ?? value;
  const change = value - prev;
  const changePct = prev !== 0 ? (change / prev) * 100 : 0;

  return { value, change, changePct, label };
}

export async function getMarketData(): Promise<MarketData> {
  const [kospi, usdKrw, us10y] = await Promise.all([
    fetchTicker(SYMBOLS.kospi, "KOSPI"),
    fetchTicker(SYMBOLS.usdKrw, "USD/KRW"),
    fetchTicker(SYMBOLS.us10y, "미국채 10Y"),
  ]);

  return {
    kospi,
    usdKrw,
    us10y,
    updatedAt: new Date().toISOString(),
  };
}
