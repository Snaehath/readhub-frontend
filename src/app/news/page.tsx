import { Suspense } from "react";
import { CardSkeleton } from "@/components/misc/skeletons";
import { NewsCardLoader } from "@/components/misc/card-loader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Global News",
  description:
    "Stay updated with real-time continuous worldwide headlines and articles.",
};

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  return (
    <div className="w-full">
      <Suspense fallback={<CardSkeleton />}>
        <NewsCardLoader />
      </Suspense>
    </div>
  );
}
