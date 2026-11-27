import { Suspense } from "react";
import { Metadata } from "next";
import { NewsPageSkeleton } from "@/components/misc/skeletons";
import { NewsCardLoader } from "@/components/misc/card-loader";

export const metadata: Metadata = {
  title: "News",
  description: "Browse global and regional headlines by topic, country, language, and freshness, with AI explanations and forecasts.",
};

export default function NewsPage() {
  return (
    <Suspense fallback={<NewsPageSkeleton />}>
      <NewsCardLoader />
    </Suspense>
  );
}
