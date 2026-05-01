import { API_BASE_URL } from "@/constants";
import { NewsArticle, RawNewsArticle, PaginatedNewsResponse } from "@/types";

export const fetchNews = async (
  page: number = 1,
  limit: number = 12,
  category: string = "all",
  country: string = "us"
): Promise<PaginatedNewsResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (category !== "all") {
    params.append("category", category);
  }

  const endpoint =
    country === "in"
      ? `${API_BASE_URL}/news/newIn/pagination`
      : `${API_BASE_URL}/news/new/pagination`;

  const res = await fetch(`${endpoint}?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch news for ${country}`);
  }

  const data = await res.json();
  
  // Format consistent with types
  const news: NewsArticle[] = data.articles.map((article: RawNewsArticle) => ({
    id: article._id?.toString() || article.id || "",
    title: article.title,
    description: article.description,
    content: article.content,
    url: article.url,
    urlToImage: article.urlToImage,
    publishedAt: article.publishedAt,
    dateOriginal: article.publishedAt,
    source: article.source ?? { name: "Unknown" },
    category: article.category ?? [],
  }));

  return {
    news,
    totalPages: data.totalPages,
    currentPage: data.currentPage,
    totalArticles: data.totalArticles,
  };
};

export const searchNewsApi = async (
  q: string,
  page: number = 1,
  limit: number = 12,
  country: string = "us",
  category: string = "all"
): Promise<PaginatedNewsResponse> => {
  const params = new URLSearchParams({
    q,
    page: String(page),
    limit: String(limit),
  });

  if (category && category !== "all") {
    params.append("category", category);
  }

  const endpoint =
    country === "in" 
      ? `${API_BASE_URL}/news/search/in` 
      : `${API_BASE_URL}/news/search/us`;

  const res = await fetch(`${endpoint}?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to search news for ${country}`);
  }

  const data = await res.json();

  const news: NewsArticle[] = data.articles.map((article: RawNewsArticle) => ({
    id: article._id?.toString() || article.id || "",
    title: article.title,
    description: article.description,
    content: article.content,
    url: article.url,
    urlToImage: article.urlToImage,
    publishedAt: article.publishedAt,
    dateOriginal: article.publishedAt,
    source: article.source ?? { name: "Unknown" },
    category: article.category ?? [],
  }));

  return {
    news,
    totalPages: data.totalPages,
    currentPage: data.currentPage,
    totalArticles: data.totalArticles,
  };
};

export const refreshNewsApi = async (country: "us" | "in") => {
  const res = await fetch(`${API_BASE_URL}/news/fetch-categories/${country}`);
  if (!res.ok) {
    throw new Error(`Failed to refresh ${country.toUpperCase()} news`);
  }
  return res.json();
};

export const getTickerNewsApi = async (
  country: string = "us"
): Promise<NewsArticle[]> => {
  const endpoint =
    country === "in"
      ? `${API_BASE_URL}/news/newIn/pagination`
      : `${API_BASE_URL}/news/new/pagination`;

  // Fetch more for ticker to ensure variety
  const res = await fetch(`${endpoint}?page=1&limit=20`, {
    cache: "no-store",
  });

  if (!res.ok) return [];

  const data = await res.json();
  return data.articles.map((article: RawNewsArticle) => ({
    id: article._id?.toString() || article.id || "",
    title: article.title,
    category: article.category ?? [],
    publishedAt: article.publishedAt,
  }));
};
