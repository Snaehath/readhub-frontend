"use client";

import dynamic from "next/dynamic";
import { CardsSkeleton, BooksSkeleton } from "./skeletons";
import { NewsCardProps, Book } from "@/types";

// Artificial delay (optional, for demo/testing)
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Dynamically load NewsCard (no SSR)
const NewsCard = dynamic(() => import("./news-card"), {
  loading: () => <CardsSkeleton />,
  ssr: false,
});

// Dynamically load BookCard with 2s delay (no SSR)
const BookCard = dynamic(() => delay(2000).then(() => import("./book-card")), {
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
