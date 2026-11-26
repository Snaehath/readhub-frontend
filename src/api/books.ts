import { Book, OpenLibraryBook } from "@/types";

/** Search Open Library, or list a subject's popular works when there is no query. */
export const searchOpenLibrary = async (query = "", limit = 20, category?: string, signal?: AbortSignal): Promise<Book[]> => {
  const searchTerm = query.trim();
  const subject = category && category !== "all" ? category : undefined;
  const url = searchTerm
    ? `https://openlibrary.org/search.json?${new URLSearchParams({
        q: searchTerm,
        lang: "en",
        limit: String(limit),
        fields: "key,title,author_name,cover_i,cover_edition_key,lending_identifier_s",
        ...(subject ? { subject } : {}),
      })}`
    : `https://openlibrary.org/subjects/${encodeURIComponent(subject || "fiction")}.json?limit=${limit}`;

  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Failed to fetch books from Open Library: ${res.status}`);

  const data = await res.json();
  const results: OpenLibraryBook[] = data.docs || data.works || [];

  return results.map((book) => ({
    title: book.title,
    author_name: book.author_name ?? book.authors?.map((author) => author.name).filter((name): name is string => Boolean(name)) ?? [],
    cover_id: book.cover_i ?? book.cover_id,
    cover_edition_key: book.cover_edition_key,
    work_key: book.key,
    lending_identifier_s: book.lending_identifier_s || book.lending_identifier || "",
    tag: subject || "fiction",
  }));
};
