export interface MarketData {
  kospi: Ticker;
  kosdaq: Ticker;
  usdKrw: Ticker;
  jpyKrw100: Ticker;
  us10y: Ticker;
  updatedAt: string;
}

export interface Ticker {
  value: number;
  change: number;
  changePct: number;
  label: string;
}

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  category: "realestate" | "construction" | "pf";
}

export interface SummaryResult {
  summary: string;
  headlines: string[];
  generatedAt: string;
}
