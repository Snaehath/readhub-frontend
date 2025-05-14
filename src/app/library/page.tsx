"use client";

import { Input } from "@/components/ui/input";
import { SetStateAction, useEffect, useState } from "react";
import { Suspense } from "react";
import { CardSkeleton } from "@/components/skeletons";
import { BooksCardLoader } from "@/components/card-loader";

type Book = {
  title: string;
  author_key: string[];
  author_name: string[];
  cover_edition_key: string;
  cover_id:string;
  work_key: string;
  lending_identifier_s: string;
  tag: string;
};

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("general");

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

  // Debounce the search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch books when debouncedSearchQuery or selectedCategory changes
  useEffect(() => {
    const fetchBooks = async () => {
      let query = `https://openlibrary.org/search.json?q=${debouncedSearchQuery}&lang=en&limit=20`;

      if (selectedCategory) {
        query += `&subject=${selectedCategory}`;
      }

      const res = await fetch(query, { cache: "no-store" });
      const data = await res.json();
      const cleaned = data.docs.map((book: any) => ({
        title: book.title,
        author_key: book.author_key,
        author_name: book.author_name,
        cover_id : book.cover_i,
        cover_edition_key: book.cover_edition_key,
        work_key: book.key,
        lending_identifier_s: book.lending_identifier_s,
        tag: debouncedSearchQuery || selectedCategory,
      }));
      setBooks(cleaned);
    };

    fetchBooks();
  }, [debouncedSearchQuery, selectedCategory]);

  const handleBookSearch = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setSearchQuery(e.target.value);
    setSelectedCategory("");
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
          className="p-2 w-full sm:w-1/2 lg:w-1/4 hover:border-black"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {books.map((book) => (
          <Suspense key={book.work_key} fallback={<CardSkeleton />}>
            <BooksCardLoader key={book.work_key} book={book} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
