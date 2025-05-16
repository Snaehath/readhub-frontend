import { getNews,getNewsIndia } from "@/lib/data";
import { Suspense } from "react";
import { CardSkeleton } from "@/components/skeletons";
import {NewsCardLoader} from "@/components/card-loader";
export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const articlesUS = await getNews();
  const articlesIN = await getNewsIndia();

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 ml-8">📰 Latest News </h2>
      <Suspense fallback={<CardSkeleton/>}>
        <NewsCardLoader articlesUS={articlesUS} articlesIN={articlesIN} />
      </Suspense>
    </div>
  );
}
