// Server-only data helpers. Server components cannot use the relative /api
// rewrite, so they call the backend directly.
import { buildNewsPath, parseNewsResponse, NewsQuery } from "@/api/news";
import { AiNews, NewsArticle } from "@/types";

export function getBackendApiUrl() {
  const configured = process.env.BACKEND_API_URL
    || (process.env.NODE_ENV === "development" ? "http://localhost:5000" : "https://readhub-backend.onrender.com");
  const base = configured.replace(/\/+$/, "");
  return base.endsWith("/api") ? base : `${base}/api`;
}

export async function getNewsServer(query: NewsQuery): Promise<NewsArticle[]> {
  try {
    const { path, savedRegion } = buildNewsPath(query);
    const res = await fetch(`${getBackendApiUrl()}${path}`, { next: { revalidate: 300 } });
    return (await parseNewsResponse(res, savedRegion)).news;
  } catch (error) {
    console.error("Featured news request failed:", error instanceof Error ? error.message : error);
    return [];
  }
}

/**
 * Home-page featured stories: the newest saved US/India articles that have an
 * image, one per topic so the selection varies as the news changes.
 */
export async function getFeaturedNewsServer(count = 3): Promise<NewsArticle[]> {
  const [us, india] = await Promise.all([
    getNewsServer({ country: "us", language: "en", limit: 24 }),
    getNewsServer({ country: "in", language: "en", limit: 24 }),
  ]);
  const candidates = [...us, ...india]
    .filter((article) => article.urlToImage && article.description)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const picked: NewsArticle[] = [];
  const usedTopics = new Set<string>();
  for (const article of candidates) {
    const topic = article.category[0] || "general";
    if (usedTopics.has(topic)) continue;
    usedTopics.add(topic);
    picked.push(article);
    if (picked.length === count) return picked;
  }
  // Not enough distinct topics: fill with the next newest stories.
  return [...picked, ...candidates.filter((article) => !picked.includes(article))].slice(0, count);
}

export async function getAiReportServer(id: string): Promise<AiNews | null> {
  try {
    const res = await fetch(`${getBackendApiUrl()}/ai-hub/news/${encodeURIComponent(id)}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return (await res.json()).news ?? null;
  } catch {
    return null;
  }
}
