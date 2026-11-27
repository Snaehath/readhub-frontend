"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Library, SearchX } from "lucide-react";
import { PoweredBy } from "../misc/powered-by";
import { CategoryFilter } from "../misc/filter-chip";
import { SearchInput } from "../misc/search-input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { BOOK_GRID, BookGridSkeleton } from "@/components/misc/skeletons";
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
          <SearchInput
            placeholder="Search by title, author, or subject…"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onClear={() => setSearchQuery("")}
            aria-label="Search books"
          />
        </div>
      </div>

      <CategoryFilter label="Filter by subject" options={booksCategories} value={category} onChange={setCategory} className="mb-5" />

      {error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>Couldn&apos;t reach Open Library</AlertTitle>
          <AlertDescription>Check your connection and try again.</AlertDescription>
        </Alert>
      ) : isLoading ? (
        <BookGridSkeleton />
      ) : books.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon"><SearchX /></EmptyMedia>
            <EmptyTitle>No books match</EmptyTitle>
            <EmptyDescription>Try a different search or subject.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <>
          <div className={BOOK_GRID}>
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
