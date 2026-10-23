"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useState, Suspense } from "react";
import { BookCardSkeleton } from "@/components/misc/skeletons";
import { BooksCardLoader } from "@/components/misc/card-loader";
import { Book } from "@/types";
import { booksCategories } from "@/constants";
import { searchOpenLibrary } from "@/api/books";

import { Search, ChevronDown, ChevronUp } from "lucide-react";

const LibraryView = () => {
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
    }, 400);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchBooks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const cleaned = await searchOpenLibrary(
          debouncedSearchQuery,
          debouncedSearchQuery ? 4 : 15,
          selectedCategory
        );

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
  };

  const categoriesToShow = showAll
    ? booksCategories
    : booksCategories.slice(0, MAX_CATEGORIES);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Books</h2>
          </div>
        {!isLoading && books.length > 0 && (
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            {books.length} books found
          </span>
        )}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-2">
          {categoriesToShow.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full cursor-pointer text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 transition-all duration-150 flex items-center justify-center ${
                selectedCategory === cat.id
                  ? "bg-stone-600 text-white scale-95"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-zinc-800 dark:text-zinc-200"
              }`}
              aria-pressed={selectedCategory === cat.id}
            >
              {cat.name}
            </button>
          ))}
          {!showAll && booksCategories.length > MAX_CATEGORIES && (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="rounded-full cursor-pointer text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 bg-stone-100 text-stone-700 hover:bg-stone-200 transition-all duration-150 flex items-center justify-center gap-1"
            >
              More
              <ChevronDown className="w-3 h-3" />
            </button>
          )}
          {showAll && booksCategories.length > MAX_CATEGORIES && (
            <button
              type="button"
              onClick={() => setShowAll(false)}
              className="rounded-full cursor-pointer text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 bg-stone-100 text-stone-700 hover:bg-stone-200 transition-all duration-150 flex items-center justify-center gap-1"
            >
              Less
              <ChevronUp className="w-3 h-3" />
            </button>
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

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && (
        <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300">
          We couldn&apos;t load the book catalog. Check your connection and try again.
        </div>
      )}

      {!isLoading && !error && books.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-stone-100 p-6 rounded-full mb-4">
            <Search className="w-8 h-8 text-stone-400" />
          </div>
          <h3 className="text-lg font-bold text-stone-800">No books match those filters</h3>
          <p className="text-muted-foreground max-w-xs mx-auto">
            Try adjusting your search or category filters to find what
            you&apos;re looking for.
          </p>
        </div>
      )}

      {!isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {books.map((book) => (
            <Suspense key={book.work_key} fallback={<BookCardSkeleton />}>
              <BooksCardLoader book={book} />
            </Suspense>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryView;
