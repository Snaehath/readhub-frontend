"use client";

import { useEffect, useState } from "react";
import { Library, Search } from "lucide-react";
import { PoweredBy } from "../misc/powered-by";
import { Input } from "@/components/ui/input";
import { BookCardSkeleton } from "@/components/misc/skeletons";
import BookCard from "./book-card";
import { Book } from "@/types";
import { booksCategories } from "@/constants";
import { searchOpenLibrary } from "@/api/books";
import { useDebounce } from "@/lib/hooks/useDebounce";

const PAGE_SIZE = 20;

export default function LibraryView() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const debouncedQuery = useDebounce(searchQuery.trim(), 400);

  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(false);
    searchOpenLibrary(debouncedQuery, PAGE_SIZE, category, controller.signal)
      .then(setBooks)
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, [debouncedQuery, category]);

  return (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Books</h1>
          <PoweredBy name="Open Library" href="https://openlibrary.org" icon={Library} iconClassName="bg-[#e2dcc5] text-[#3d3424] dark:bg-[#3d3424] dark:text-[#e2dcc5]" />
        </div>
        <div className="w-full lg:max-w-md">
          <Input
            type="search"
            placeholder="Search by title, author, or subject…"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onClear={() => setSearchQuery("")}
            aria-label="Search books"
          />
        </div>
      </div>

      <div role="group" aria-label="Filter by subject" className="-mx-1 mb-6 flex gap-2 overflow-x-auto px-1 pb-1">
        {booksCategories.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => setCategory(item.id)}
            aria-pressed={category === item.id}
            className={`min-h-9 shrink-0 rounded-full px-4 text-sm transition-colors ${
              category === item.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {error ? (
        <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-6 text-center text-sm text-destructive">
          We couldn&apos;t reach Open Library. Check your connection and try again.
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {Array.from({ length: 10 }, (_, index) => <BookCardSkeleton key={index} />)}
        </div>
      ) : books.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <span className="mb-4 rounded-full bg-muted p-5"><Search className="h-7 w-7 text-muted-foreground" aria-hidden="true" /></span>
          <h2 className="text-lg font-semibold">No books match</h2>
          <p className="max-w-xs text-sm text-muted-foreground">Try a different search or subject.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {books.map((book) => <BookCard key={book.work_key} book={book} />)}
          </div>
          <p className="mt-10 text-center text-xs text-muted-foreground">
            Book data and covers from{" "}
            <a href="https://openlibrary.org" target="_blank" rel="noopener noreferrer" className="font-medium underline-offset-2 hover:underline">Open Library</a>, an open project of the Internet Archive.
          </p>
        </>
      )}
    </div>
  );
}
