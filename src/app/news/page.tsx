import { Suspense } from "react";
import { CardSkeleton } from "@/components/skeletons";
import { NewsCardLoader } from "@/components/card-loader";

export const dynamic = "force-dynamic";

export default async function NewsPage() {


  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 ml-8">📰 Latest News</h2>
      <Suspense fallback={<CardSkeleton />}>
        <NewsCardLoader />
      </Suspense>
    </div>
  );
}
