"use client";

import dynamic from "next/dynamic";
import { Book } from "@/types";
import { BooksSkeleton, CardsSkeleton } from "./skeletons";

// Dynamically load NewsCard (no SSR)
const NewsCard = dynamic(() => import("../news/news-card"), {
  loading: () => <CardsSkeleton />,
  ssr: false,
});

const BookCard = dynamic(() => import("../books/book-card"), {
  loading: () => <BooksSkeleton />,
  ssr: false,
});

// Wrapper for NewsCard with props passed through
export function NewsCardLoader() {
  return <NewsCard />;
}

// Wrapper for BookCard with props passed through
export function BooksCardLoader(props: { book: Book }) {
  return <BookCard {...props} />;
}
