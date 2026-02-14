"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState, Suspense } from "react";
import { CardSkeleton } from "@/components/misc/skeletons";
import { BooksCardLoader } from "@/components/misc/card-loader";
import { Book } from "@/types";
import { booksCategories } from "@/constants";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronDown, ChevronUp } from "lucide-react";

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAll, setShowAll] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const MAX_CATEGORIES = 4;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        let query = `https://openlibrary.org/search.json?q=${
          debouncedSearchQuery || "all"
        }&lang=en&limit=${debouncedSearchQuery ? "4" : "15"}`;

        if (selectedCategory && selectedCategory !== "all") {
          query += `&subject=${selectedCategory}`;
        }

        const res = await fetch(query, { cache: "no-store" });

        if (!res.ok) {
          throw new Error(
            `Failed to fetch books: ${res.status} ${res.statusText}`,
          );
        }

        const data = await res.json();

        const cleaned = (data.docs || []).map((book: Book) => ({
          title: book.title,
          author_key: book.author_key ?? [],
          author_name: book.author_name ?? [],
          cover_id: book.cover_id,
          cover_edition_key: book.cover_edition_key,
          work_key: book.key,
          lending_identifier_s: book.lending_identifier_s || "",
          tag: debouncedSearchQuery || selectedCategory,
        }));

        setBooks(cleaned);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Unknown error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [debouncedSearchQuery, selectedCategory]);

  const handleBookSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedCategory("all");
  };

  const categoriesToShow = showAll
    ? booksCategories
    : booksCategories.slice(0, MAX_CATEGORIES);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🏛️ Library</h2>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {categoriesToShow.map((cat) => (
            <Badge
              variant="outline"
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full cursor-pointer text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 transition-all duration-150 flex items-center justify-center ${
                selectedCategory === cat.id
                  ? "bg-stone-600 text-white scale-95"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200"
              }`}
            >
              {cat.name}
            </Badge>
          ))}
          {!showAll && booksCategories.length > MAX_CATEGORIES && (
            <Badge
              variant="outline"
              onClick={() => setShowAll(true)}
              className="rounded-full cursor-pointer text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 bg-stone-100 text-stone-700 hover:bg-stone-200 transition-all duration-150 flex items-center justify-center gap-1"
            >
              More
              <ChevronDown className="w-3 h-3" />
            </Badge>
          )}
          {showAll && booksCategories.length > MAX_CATEGORIES && (
            <Badge
              variant="outline"
              onClick={() => setShowAll(false)}
              className="rounded-full cursor-pointer text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 bg-stone-100 text-stone-700 hover:bg-stone-200 transition-all duration-150 flex items-center justify-center gap-1"
            >
              Less
              <ChevronUp className="w-3 h-3" />
            </Badge>
          )}
        </div>

        <div className="w-full sm:w-1/3 md:w-1/4">
          <Input
            type="text"
            startIcon={<Search className="w-4 h-4" />}
            placeholder="Search for books..."
            value={searchQuery}
            onChange={handleBookSearch}
            aria-label="Search books"
            className="rounded-full w-full"
          />
        </div>
      </div>

      {/* Loading Dialog */}
      <Dialog open={isLoading} onOpenChange={() => {}}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Loading books</DialogTitle>
            <DialogDescription>
              Please wait while we fetch the latest books for you.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center py-6">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
          </div>
        </DialogContent>
      </Dialog>

      {error && (
        <div className="text-center text-red-600 mb-4">Error: {error}</div>
      )}

      {!isLoading && !error && books.length === 0 && (
        <div className="text-center text-gray-500 mb-4">No books found.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {books.map((book) => (
          <Suspense key={book.work_key} fallback={<CardSkeleton />}>
            <BooksCardLoader book={book} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
