"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { Book } from "@/types";
import { BooksSkeleton, CardsSkeleton } from "./skeletons";

// Dynamically load components (no SSR)
const NewsCard = dynamic(() => import("../news/news-card"), {
  ssr: false,
});

const BookCard = dynamic(() => import("../books/book-card"), {
  loading: () => <BooksSkeleton />,
  ssr: false,
});

// Wrapper for NewsCard with simulated manual loading
export function NewsCardLoader() {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (isInitialLoading) {
    return (
      <div className="w-full mt-6">
        <CardsSkeleton />
      </div>
    );
  }

  return <NewsCard />;
}

// Wrapper for BookCard with props passed through
export function BooksCardLoader(props: { book: Book }) {
  return <BookCard {...props} />;
}
