import { Suspense } from "react";
import { CardSkeleton } from "@/components/misc/skeletons";
import { NewsCardLoader } from "@/components/misc/card-loader";

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
