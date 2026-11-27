import { ArticleForecast, NewsArticle } from "@/types";
import { apiRequest } from "@/lib/api-client";

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

function postInsight<T>(path: string, article: NewsArticle, signal?: AbortSignal) {
  return apiRequest<T & { basis: InsightBasis }>(path, {
    method: "POST",
    body: { userMessage: toArticleSelection(article) },
    signal,
    timeoutMs: CLIENT_TIMEOUT_MS,
    errorMessage: "The AI service is temporarily unavailable.",
  });
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
