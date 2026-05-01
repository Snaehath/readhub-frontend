import { API_BASE_URL } from "@/constants";
import { Book, OpenLibraryBook } from "@/types";

export const searchOpenLibrary = async (
  query: string = "all",
  limit: number = 15,
  category?: string
): Promise<Book[]> => {
  let url = `https://openlibrary.org/search.json?q=${encodeURIComponent(
    query
  )}&lang=en&limit=${limit}`;

  if (category && category !== "all") {
    url += `&subject=${encodeURIComponent(category)}`;
  }

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`Failed to fetch books from Open Library: ${res.status}`);
  }

  const data = await res.json();

  return (data.docs || []).map((book: OpenLibraryBook) => ({
    title: book.title,
    author_key: book.author_key ?? [],
    author_name: book.author_name ?? [],
    cover_id: book.cover_id,
    cover_edition_key: book.cover_edition_key,
    work_key: book.key,
    lending_identifier_s: book.lending_identifier_s || "",
    tag: query,
  }));
};

export const fetchBackendBooks = async (): Promise<Book[]> => {
  const res = await fetch(`${API_BASE_URL}/books`);
  if (!res.ok) {
    throw new Error("Failed to fetch books from backend");
  }
  return res.json();
};
