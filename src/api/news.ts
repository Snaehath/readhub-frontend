import { API_BASE_URL } from "@/constants";
import { NewsArticle, PaginatedNewsResponse, RawNewsArticle } from "@/types";

export interface NewsQuery {
  q?: string;
  page?: number;
  limit?: number;
  category?: string;
  country?: string;
  sort?: string;
  freshness?: string;
  language?: string;
}

/** US and India English news come from ReadHub's saved archive; everything else is the live global feed. */
export const savedRegionFor = (country: string, language: string): "us" | "in" | undefined =>
  (country === "us" || country === "in") && language === "en" ? country : undefined;

/** Path and query string for a news request, relative to the API base URL. */
export function buildNewsPath({ q, page = 1, limit = 12, category = "all", country = "world", sort = "latest", freshness = "any", language = "en" }: NewsQuery) {
  const params = new URLSearchParams({ page: String(page), limit: String(limit), sort, freshness });
  if (q?.trim()) params.set("q", q.trim());
  if (category !== "all") params.set("category", category);

  const savedRegion = savedRegionFor(country, language);
  if (!savedRegion) {
    params.set("language", language);
    if (country !== "world") params.set("country", country);
  }
  const endpoint = savedRegion === "in" ? "/news/newIn/pagination" : savedRegion === "us" ? "/news/new/pagination" : "/news/world/pagination";
  return { path: `${endpoint}?${params.toString()}`, savedRegion };
}

export const toNewsArticle = (article: RawNewsArticle, savedRegion?: "us" | "in"): NewsArticle => ({
  id: article._id || article.id || article.url,
  title: article.title,
  description: article.description,
  url: article.url,
  urlToImage: article.urlToImage || undefined,
  publishedAt: article.publishedAt,
  source: article.source ?? { name: "Unknown" },
  category: article.category ?? [],
  sourceCountry: article.sourceCountry,
  sourceLanguage: article.sourceLanguage,
  dateLabel: article.dateLabel,
  savedRegion: savedRegion && article._id ? savedRegion : undefined,
});

export async function parseNewsResponse(res: Response, savedRegion?: "us" | "in"): Promise<PaginatedNewsResponse> {
  if (!res.ok) {
    const error = await res.json().catch(() => null);
    throw new Error(error?.error || "News is temporarily unavailable.");
  }
  const data = await res.json();
  return {
    news: (data.articles || []).map((article: RawNewsArticle) => toNewsArticle(article, savedRegion)),
    totalPages: data.totalPages ?? 0,
    currentPage: data.currentPage ?? 1,
    totalArticles: data.totalArticles ?? 0,
    hasMore: typeof data.hasMore === "boolean" ? data.hasMore : (data.currentPage ?? 1) < (data.totalPages ?? 0),
    totalIsEstimate: Boolean(data.totalIsEstimate),
    provider: data.provider || (savedRegion === "us" ? "NewsAPI" : savedRegion === "in" ? "GNews" : "GDELT"),
  };
}

export async function fetchNews(query: NewsQuery, signal?: AbortSignal): Promise<PaginatedNewsResponse> {
  const { path, savedRegion } = buildNewsPath(query);
  const res = await fetch(`${API_BASE_URL}${path}`, { signal });
  return parseNewsResponse(res, savedRegion);
}
