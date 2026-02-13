import { Suspense } from "react";
import { CardSkeleton } from "@/components/misc/skeletons";
import { NewsCardLoader } from "@/components/misc/card-loader";

export const dynamic = "force-dynamic";

export default async function NewsPage() {


  return (
    <div className="p-2">
      <h2 className="text-3xl font-bold mb-4 ml-8">📰 Latest News</h2>
      <Suspense fallback={<CardSkeleton />}>
        <NewsCardLoader />
      </Suspense>
    </div>
  );
}
