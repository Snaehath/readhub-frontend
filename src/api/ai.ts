import { API_BASE_URL } from "@/constants";
import { ArticleForecast, NewsArticle } from "@/types";

// Slightly above the server's 30s budget so the server's own timeout message wins.
const CLIENT_TIMEOUT_MS = 40000;

type ArticleSelection =
  | { id: string; selectedCountry: "us" | "in" }
  | { article: { title: string; url: string; description?: string; sourceName?: string; publishedAt?: string } };

export type InsightBasis = "full_text" | "summary_only";

/** Saved articles are referenced by ID; live global articles are sent as metadata for the server to fetch. */
const toArticleSelection = (article: NewsArticle): ArticleSelection =>
  article.savedRegion
    ? { id: article.id, selectedCountry: article.savedRegion }
    : {
        article: {
          title: article.title,
          url: article.url,
          description: article.description || undefined,
          sourceName: article.source?.name,
          publishedAt: article.publishedAt,
        },
      };

async function postInsight<T>(path: string, article: NewsArticle, signal?: AbortSignal): Promise<T & { basis: InsightBasis }> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userMessage: toArticleSelection(article) }),
      signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(CLIENT_TIMEOUT_MS)]) : AbortSignal.timeout(CLIENT_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") throw new Error("The AI took too long to respond. Please try again.");
    throw error;
  }
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const fallback = res.status === 429 ? "You've reached the AI limit. Please try again in a few minutes." : "The AI service is temporarily unavailable.";
    throw new Error(data?.error || fallback);
  }
  return data;
}

export async function explainArticle(article: NewsArticle, signal?: AbortSignal) {
  const data = await postInsight<{ reply: string }>("/ai/chat", article, signal);
  if (!data.reply?.trim()) throw new Error("The AI returned an empty response. Please try again.");
  return { content: data.reply.trim(), basis: data.basis };
}

export async function forecastArticle(article: NewsArticle, signal?: AbortSignal) {
  const data = await postInsight<{ forecast: ArticleForecast }>("/ai/futureNews", article, signal);
  if (!data.forecast?.outlook) throw new Error("The AI returned an incomplete forecast. Please try again.");
  return { forecast: data.forecast, basis: data.basis };
}
