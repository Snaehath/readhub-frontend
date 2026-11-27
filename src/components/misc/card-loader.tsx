"use client";

import dynamic from "next/dynamic";
import { NewsPageSkeleton } from "./skeletons";

// Client-only: the feed reads window.location and formats relative dates.
const NewsCard = dynamic(() => import("../news/news-card"), {
  ssr: false,
  loading: () => <NewsPageSkeleton />,
});

export function NewsCardLoader() {
  return <NewsCard />;
}
