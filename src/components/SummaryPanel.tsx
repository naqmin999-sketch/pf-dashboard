"use client";

import { useState } from "react";
import type { SummaryResult } from "@/types";

export default function SummaryPanel() {
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function run() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/summarize", { method: "POST" });
      if (!res.ok) throw new Error("요약 실패");
      setResult(await res.json());
    } catch {
      setError("AI 요약 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  const dotClass = loading
    ? "bg-amber-400 animate-pulse"
    : result
      ? "bg-emerald-400"
      : "bg-zinc-700";

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-[6px]">
          <div className={`w-[5px] h-[5px] rounded-full shrink-0 ${dotClass}`} />
          <span className="text-[10px] font-bold tracking-[0.15em] text-violet-400 uppercase border-l-2 border-violet-500 pl-2">
            AI 시황
          </span>
        </div>
        <button
          onClick={run}
          disabled={loading}
          className="text-[10px] px-[7px] py-[3px] rounded bg-violet-950 hover:bg-violet-900 border border-violet-800/70 text-violet-300 disabled:opacity-40 transition-colors"
        >
          {loading ? "분석 중…" : "요약"}
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {!result && !loading && !error && (
          <div className="pt-2 space-y-2">
            <p className="text-zinc-600 text-[10px] leading-relaxed">
              버튼을 눌러 오늘의 PF 시장 AI 시황 요약을 생성합니다.
            </p>
            <p className="text-zinc-700 text-[9px]">Claude Haiku 기반 분석</p>
          </div>
        )}

        {loading && (
          <div className="pt-2 space-y-[6px]">
            {[80, 60, 75, 50, 70].map((w, i) => (
              <div
                key={i}
                className="h-[7px] bg-zinc-800 rounded animate-pulse"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        )}

        {error && <p className="text-red-400 text-[10px] pt-2">{error}</p>}

        {result && !loading && (
          <div className="space-y-3">
            <p className="text-zinc-200 text-[11px] leading-relaxed">{result.summary}</p>

            {result.headlines.length > 0 && (
              <div className="border-t border-zinc-800 pt-2 space-y-[3px]">
                <p className="text-[9px] text-zinc-600 uppercase tracking-wider mb-[4px]">
                  근거 헤드라인
                </p>
                {result.headlines.slice(0, 6).map((h, i) => (
                  <p key={i} className="text-[9px] text-zinc-500 leading-snug">
                    · {h}
                  </p>
                ))}
              </div>
            )}

            <p className="text-zinc-700 text-[9px] font-mono">
              {new Date(result.generatedAt).toLocaleTimeString("ko-KR", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              생성
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
