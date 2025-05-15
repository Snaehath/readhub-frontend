"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState, Suspense } from "react";
import { CardSkeleton } from "@/components/skeletons";
import { BooksCardLoader } from "@/components/card-loader";
import { Book } from "@/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("general");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const booksCategories = [
    { id: "history", name: "History" },
    { id: "business", name: "Business" },
    { id: "health", name: "Health" },
    { id: "sports", name: "Sports" },
    { id: "science", name: "Science" },
    { id: "horror", name: "Horror" },
    { id: "children", name: "Children" },
    { id: "cooking", name: "Cooking" },
  ];

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
        let query = `https://openlibrary.org/search.json?q=${debouncedSearchQuery || "all"}&lang=en&limit=20`;

        if (selectedCategory && selectedCategory !== "general") {
          query += `&subject=${selectedCategory}`;
        }

        const res = await fetch(query, { cache: "no-store" });

        if (!res.ok) {
          throw new Error(`Failed to fetch books: ${res.status} ${res.statusText}`);
        }

        const data = await res.json();

        const cleaned = (data.docs || []).map((book: any) => ({
          title: book.title,
          author_key: book.author_key ?? [],
          author_name: book.author_name ?? [],
          cover_id: book.cover_i || book.cover_id,
          cover_edition_key: book.cover_edition_key,
          work_key: book.key,
          lending_identifier_s: book.lending_identifier_s || "",
          tag: debouncedSearchQuery || selectedCategory,
        }));

        setBooks(cleaned);
      } catch (err: any) {
        setError(err.message || "Unknown error occurred.");
        setBooks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [debouncedSearchQuery, selectedCategory]);

  const handleBookSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedCategory("general");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Library</h2>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-4">
        <Input
          type="text"
          placeholder="Search for books..."
          value={searchQuery}
          onChange={handleBookSearch}
          aria-label="Search books"
          className="p-2 w-full sm:w-1/2 lg:w-1/4 hover:border-black"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          aria-label="Select book category"
          className="mb-4 p-2 border rounded w-32"
        >
          <option value="general">All</option>
          {booksCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
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
        <div className="text-center text-red-600 mb-4">
          Error: {error}
        </div>
      )}

      {!isLoading && !error && books.length === 0 && (
        <div className="text-center text-gray-500 mb-4">
          No books found.
        </div>
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
