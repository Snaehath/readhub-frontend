"use client";

import dynamic from "next/dynamic";
import { CardsSkeleton } from "./skeletons";

// Client-only: the feed reads window.location and formats relative dates.
const NewsCard = dynamic(() => import("../news/news-card"), {
  ssr: false,
  loading: () => (
    <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <CardsSkeleton />
    </div>
  ),
});

export function NewsCardLoader() {
  return <NewsCard />;
}
