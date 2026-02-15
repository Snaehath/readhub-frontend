"use server";

import { NewsArticle } from "@/types";
import client from "../lib/mongodb";

export type PaginatedNewsResponse = {
  news: NewsArticle[];
  totalPages: number;
  currentPage: number;
  totalArticles: number;
};

//get news data from database country:us
export async function getNewsPaginated(
  page: number = 1,
  limit: number = 12,
  category: string = "all",
  country: string = "us",
): Promise<PaginatedNewsResponse> {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (category !== "all") {
      params.append("category", category);
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://readhub-backend.onrender.com/api";
    const endpoint =
      country === "in"
        ? `${baseUrl}/news/newIn/pagination`
        : `${baseUrl}/news/new/pagination`;

    const res = await fetch(`${endpoint}?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch news for ${country}`);
    }

    const data = await res.json();

    const formattedNews: NewsArticle[] = data.articles.map(
      (article: NewsArticle) => ({
        id: article._id.toString(),
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        dateOriginal: article.publishedAt,
        source: article.source ?? { name: "Unknown" },
        category: article.category ?? [],
      }),
    );

    return {
      news: formattedNews,
      totalPages: data.totalPages,
      currentPage: data.currentPage,
      totalArticles: data.totalArticles,
    };
  } catch (error) {
    console.error("Error fetching paginated news:", error);
    return {
      news: [],
      totalPages: 0,
      currentPage: 1,
      totalArticles: 0,
    };
  }
}

export async function getTickerNews(
  country: string = "us",
): Promise<NewsArticle[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://readhub-backend.onrender.com/api";
    const endpoint =
      country === "in"
        ? `${baseUrl}/news/newIn/pagination`
        : `${baseUrl}/news/new/pagination`;

    // Fetch more for ticker to ensure variety
    const res = await fetch(`${endpoint}?page=1&limit=20`, {
      cache: "no-store",
    });

    if (!res.ok) return [];

    const data = await res.json();
    return data.articles.map((article: NewsArticle) => ({
      id: article._id.toString(),
      title: article.title,
      category: article.category ?? [],
      publishedAt: article.publishedAt,
    }));
  } catch (error) {
    console.error("Error fetching ticker news:", error);
    return [];
  }
}

export async function getFeaturedBooks() {
  try {
    const mongoClient = await client.connect();
    const db = mongoClient.db();
    const booksCollection = db.collection("books");

    const books = await booksCollection.find({}).limit(4).toArray();

    const formattedBooks = books.map((book) => ({
      _id: book._id.toString(),
      title: book.title,
      summaries: book.summaries,
      url: book.readUrl,
      urlToImage: book.coverImage,
      category: book.category,
      author: {
        ...book.authors[0],
        _id: book.authors[0]?._id?.toString?.() ?? undefined,
      },
    }));

    return formattedBooks;
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}
export async function getBooks() {
  try {
    const mongoClient = await client.connect();
    const db = mongoClient.db();
    const booksCollection = db.collection("books");

    const books = await booksCollection.find({}).toArray();

    const formattedBooks = books.map((book) => ({
      _id: book._id.toString(),
      title: book.title,
      summaries: book.summaries,
      url: book.readUrl,
      urlToImage: book.coverImage,
      category: book.category,
      author: {
        ...book.authors[0],
        _id: book.authors[0]?._id?.toString?.() ?? undefined,
      },
    }));

    return formattedBooks;
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}
