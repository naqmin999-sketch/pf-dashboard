import Anthropic from "@anthropic-ai/sdk";
import type { NewsItem, SummaryResult } from "@/types";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function summarizeNews(news: NewsItem[]): Promise<SummaryResult> {
  const headlines = news.slice(0, 10).map((n) => `- ${n.title} (${n.source})`);

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `다음은 오늘의 부동산 PF 및 건설 관련 주요 뉴스 헤드라인입니다.
부동산 PF 시장 관점에서 핵심 이슈를 3~4문장으로 간결하게 요약해주세요.
투자자 또는 금융기관 담당자 관점에서 주목해야 할 리스크나 기회를 포함해주세요.

헤드라인:
${headlines.join("\n")}`,
      },
    ],
  });

  const summary =
    message.content[0].type === "text" ? message.content[0].text : "";

  return {
    summary,
    headlines: news.slice(0, 10).map((n) => n.title),
    generatedAt: new Date().toISOString(),
  };
}
