import { Suspense } from "react";
import { Metadata } from "next";
import { CardsSkeleton } from "@/components/misc/skeletons";
import { NewsCardLoader } from "@/components/misc/card-loader";

export const metadata: Metadata = {
  title: "News",
  description: "Browse global and regional headlines by topic, country, language, and freshness, with AI explanations and forecasts.",
};

export default function NewsPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8"><CardsSkeleton /></div>}>
      <NewsCardLoader />
    </Suspense>
  );
}
