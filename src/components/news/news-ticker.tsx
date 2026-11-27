"use client";

import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { ArrowUpRight } from "lucide-react";
import { fetchNews } from "@/api/news";
import { Category, NewsArticle } from "@/types";
import { NEWS_CATEGORY_COLORS } from "@/constants";
import { TickerSkeleton } from "@/components/misc/skeletons";

/** Pick one headline per category for variety, falling back to the latest headlines. */
function pickHeadlines(articles: NewsArticle[]) {
  const seenCategories = new Set<string>();
  const varied = articles.filter((article) => {
    const category = article.category[0];
    if (!category || seenCategories.has(category)) return false;
    seenCategories.add(category);
    return true;
  });
  return varied.length >= 4 ? varied : articles.slice(0, 10);
}

export default function NewsTicker({ country, language }: { country: string; language: string }) {
  // null while loading; [] when there is nothing to show.
  const [items, setItems] = useState<NewsArticle[] | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setItems(null);
    fetchNews({ country, language, limit: 20 }, controller.signal)
      .then((res) => setItems(pickHeadlines(res.news)))
      .catch(() => {
        if (!controller.signal.aborted) setItems([]);
      });
    return () => controller.abort();
  }, [country, language]);

  if (items === null) return <TickerSkeleton />;
  if (items.length === 0) return <div className="h-12 border-y bg-muted/40" aria-hidden="true" />;

  return (
    <section aria-label="Top headlines" className="flex h-12 w-full items-center gap-3 border-y bg-muted/40 px-4 sm:px-6">
      <span className="shrink-0 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-foreground">
        Top stories
      </span>
      <div className="min-w-0 flex-1">
        <Marquee gradient={false} speed={36} pauseOnHover autoFill>
          {items.map((article) => {
            const category = article.category[0];
            return (
              <span key={article.id} className="mx-6 flex items-center gap-3 text-sm">
                {category && (
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${NEWS_CATEGORY_COLORS[category as Category] || "text-muted-foreground"}`}>
                    {category}
                  </span>
                )}
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex max-w-[min(72vw,38rem)] items-center gap-1.5 whitespace-nowrap font-medium text-foreground/85 hover:text-primary"
                >
                  <span className="truncate">{article.title}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-50 group-hover:opacity-100" aria-hidden="true" />
                </a>
              </span>
            );
          })}
        </Marquee>
      </div>
    </section>
  );
}
