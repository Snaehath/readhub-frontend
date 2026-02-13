"use client";

import dynamic from "next/dynamic";
import { Book } from "@/types";
import { BooksSkeleton, CardsSkeleton } from "./skeletons";

// Artificial delay (optional, for demo/testing)
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Dynamically load NewsCard (no SSR)
const NewsCard = dynamic(() => import("../news/news-card"), {
  loading: () => <CardsSkeleton />,
  ssr: false,
});

// Dynamically load BookCard with 2s delay (no SSR)
const BookCard = dynamic(() => delay(2000).then(() => import("../books/book-card")), {
  loading: () => <BooksSkeleton />,
  ssr: false,
});

// Wrapper for NewsCard with props passed through
export function NewsCardLoader() {
  return <NewsCard  />;
}

// Wrapper for BookCard with props passed through
export function BooksCardLoader(props: { book: Book }) {
  return <BookCard {...props} />;
}
