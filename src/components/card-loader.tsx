"use client";

import dynamic from "next/dynamic";
import { CardsSkeleton,BooksSkeleton } from "./skeletons";
import { NewsCardProps,Book } from "@/types";

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

const NewsCard = dynamic(() => delay(1500).then(() => import("./news-card")), {
  loading: () => <CardsSkeleton />,
  ssr: false,
});
const BookCard = dynamic(() => delay(2000).then(() => import("./book-card")), {
  loading: () => <BooksSkeleton />,
  ssr: false,
});

export function NewsCardLoader(props: NewsCardProps) {
  return <NewsCard {...props} />;
}
export function BooksCardLoader(props: {book:Book}) {
  return <BookCard {...props} />;
}