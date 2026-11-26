import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeaturedNewsServer } from "@/lib/data";
import FeaturedNewsCard from "./featuredNewsCard";

export default async function FeaturedNews() {
  const articles = await getFeaturedNewsServer(3);
  if (articles.length === 0) return null;

  return (
    <section aria-labelledby="featured-news-heading" className="mx-auto max-w-6xl px-4">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 id="featured-news-heading" className="text-2xl font-bold tracking-tight sm:text-3xl">Featured stories</h2>
        <Link href="/news" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          All news <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => <FeaturedNewsCard key={article.id} article={article} />)}
      </div>
    </section>
  );
}
