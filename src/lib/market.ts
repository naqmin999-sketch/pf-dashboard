import type { MarketData, Ticker } from "@/types";

async function fetchTicker(symbol: string, label: string): Promise<Ticker> {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2d`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
    next: { revalidate: 1800 },
  });
  if (!res.ok) throw new Error(`Yahoo Finance ${symbol}: ${res.status}`);
  const json = await res.json();
  const meta = json?.chart?.result?.[0]?.meta;
  if (!meta) throw new Error(`No meta for ${symbol}`);
  const value: number = meta.regularMarketPrice ?? 0;
  const prev: number = meta.chartPreviousClose ?? meta.previousClose ?? value;
  const change = value - prev;
  const changePct = prev !== 0 ? (change / prev) * 100 : 0;
  return { value, change, changePct, label };
}

function safe(symbol: string, label: string): Promise<Ticker> {
  return fetchTicker(symbol, label).catch(() => ({
    value: 0,
    change: 0,
    changePct: 0,
    label,
  }));
}

export async function getMarketData(): Promise<MarketData> {
  const [kospi, kosdaq, usdKrw, jpyRaw, us10y] = await Promise.all([
    safe("^KS11", "KOSPI"),
    safe("^KQ11", "KOSDAQ"),
    safe("KRW=X", "USD/KRW"),
    safe("JPYKRW=X", "JPY 100"),
    safe("^TNX", "US 10Y"),
  ]);

  const jpyKrw100: Ticker = {
    label: "JPY 100",
    value: jpyRaw.value * 100,
    change: jpyRaw.change * 100,
    changePct: jpyRaw.changePct,
  };

  return { kospi, kosdaq, usdKrw, jpyKrw100, us10y, updatedAt: new Date().toISOString() };
}
