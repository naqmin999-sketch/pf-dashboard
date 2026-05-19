"use client";

import { useState } from "react";
import type { SummaryResult } from "@/types";

export default function SummaryPanel() {
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSummarize() {
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

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 border-b border-zinc-700 pb-3">
        <div className="flex items-center gap-2">
          <span className="text-violet-400 text-xs font-bold tracking-widest uppercase border-l-2 border-violet-400 pl-2">
            AI 시황 요약
          </span>
          <span className="text-zinc-600 text-[10px]">Claude Haiku</span>
        </div>
        <button
          onClick={handleSummarize}
          disabled={loading}
          className="text-[10px] font-medium px-3 py-1 rounded bg-violet-900 hover:bg-violet-800 text-violet-200 disabled:opacity-40 transition-colors"
        >
          {loading ? "요약 중..." : "요약 생성"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!result && !loading && !error && (
          <p className="text-zinc-600 text-xs pt-2">
            버튼을 눌러 오늘의 PF 시장 AI 요약을 생성하세요.
          </p>
        )}
        {error && <p className="text-red-400 text-xs">{error}</p>}
        {result && (
          <div className="space-y-3">
            <p className="text-zinc-200 text-xs leading-relaxed">{result.summary}</p>
            <p className="text-zinc-600 text-[10px]">
              생성 시각: {formatTime(result.generatedAt)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
