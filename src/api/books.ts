import { API_BASE_URL } from "@/constants";
import { Book, OpenLibraryBook } from "@/types";

export const searchOpenLibrary = async (
  query: string = "",
  limit: number = 15,
  category?: string
): Promise<Book[]> => {
  const searchTerm = query.trim();
  const selectedSubject = category && category !== "all" ? category : "fiction";
  const url = searchTerm
    ? `https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}&lang=en&limit=${limit}${category && category !== "all" ? `&subject=${encodeURIComponent(category)}` : ""}`
    : `https://openlibrary.org/subjects/${encodeURIComponent(selectedSubject)}.json?limit=${limit}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to fetch books from Open Library: ${res.status}`);
  }

  const data = await res.json();

  const results: OpenLibraryBook[] = data.docs || data.works || [];

  return results.map((book: OpenLibraryBook) => ({
    title: book.title,
    author_key: book.author_key ?? book.authors?.map((author) => author.key).filter((key): key is string => Boolean(key)) ?? [],
    author_name: book.author_name ?? book.authors?.map((author) => author.name).filter((name): name is string => Boolean(name)) ?? [],
    cover_id: book.cover_id,
    cover_edition_key: book.cover_edition_key,
    work_key: book.key,
    lending_identifier_s: book.lending_identifier_s || "",
    tag: category && category !== "all" ? category : "fiction",
  }));
};

export const fetchBackendBooks = async (): Promise<Book[]> => {
  const res = await fetch(`${API_BASE_URL}/books`);
  if (!res.ok) {
    throw new Error("Failed to fetch books from backend");
  }
  return res.json();
};
