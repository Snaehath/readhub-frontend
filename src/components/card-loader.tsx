"use client";

import dynamic from "next/dynamic";
import { CardsSkeleton,BooksSkeleton } from "./skeletons";

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

export function NewsCardLoader(props: any) {
  return <NewsCard {...props} />;
}
export function BooksCardLoader(props: any) {
  return <BookCard {...props} />;
}