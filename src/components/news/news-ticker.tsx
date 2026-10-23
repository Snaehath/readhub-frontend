"use client";

import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { getTickerNewsApi } from "@/api/news";
import { Category, NewsArticle } from "@/types";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { NEWS_CATEGORY_COLORS } from "@/constants";
import Typography from "../ui/custom/typography";

interface NewsTickerProps {
  country: string;
}

export default function NewsTicker({ country }: NewsTickerProps) {
  const [tickerItems, setTickerItems] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickerData = async () => {
      setLoading(true);
      try {
        const articles = await getTickerNewsApi(country);

        // Group by category and take first 2 from each
        const categoryMap = new Map<string, NewsArticle[]>();

        articles.forEach((article) => {
          article.category.forEach((cat) => {
            if (!categoryMap.has(cat)) {
              categoryMap.set(cat, []);
            }
            const catArticles = categoryMap.get(cat)!;
            if (catArticles.length < 1) {
              catArticles.push(article);
            }
          });
        });

        // Flatten the map and remove duplicates (since an article can be in multiple categories)
        const uniqueArticles = new Set<NewsArticle>();
        categoryMap.forEach((arts) => {
          arts.forEach((a) => uniqueArticles.add(a));
        });

        // If we didn't get enough from the grouping, just use the latest articles
        const finalItems =
          uniqueArticles.size > 0
            ? Array.from(uniqueArticles)
            : articles.slice(0, 10);

        setTickerItems(finalItems);
      } catch (error) {
        console.error("Failed to fetch ticker news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickerData();
  }, [country]);

  if (loading && tickerItems.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-2 shadow-sm flex justify-center items-center h-10">
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
        <Typography variant="small" className="text-white">Loading top stories…</Typography>
      </div>
    );
  }

  if (tickerItems.length === 0) return null;

  return (
    <section
      aria-label="Top news headlines"
      className="flex w-full items-center gap-3 border-y border-zinc-200/80 bg-zinc-50/90 px-4 py-2.5 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90 sm:px-6"
    >
      <div className="flex shrink-0 items-center gap-2 rounded-full bg-blue-600 px-3 py-1.5 text-white shadow-sm dark:bg-indigo-600">
        <span className="relative flex h-2 w-2" aria-hidden="true">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.12em] sm:text-xs">Top stories</span>
      </div>
      <div className="min-w-0 flex-1">
      <Marquee
        gradient={false}
        speed={36}
        pauseOnHover
        pauseOnClick
        autoFill
        className="flex items-center"
      >
        {tickerItems.map((article, index) => {
          const category = article.category[0] || "update";
          const colorClass =
            NEWS_CATEGORY_COLORS[category as Category] ||
            "bg-gray-100 text-gray-600 border-gray-200";

          return (
            <div
              key={`${article.id}-${index}`}
              className="mx-5 flex items-center gap-3 text-sm font-medium tracking-tight sm:mx-7"
            >
              <Typography
                variant="muted"
                className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold capitalize leading-none shadow-sm ${colorClass}`}
              >
                {category}
              </Typography>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex max-w-[min(72vw,38rem)] items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-foreground/85 transition-colors hover:text-blue-700 focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:hover:text-indigo-300"
                aria-label={`Read headline: ${article.title} — opens in a new tab`}
              >
                <span className="truncate">{article.title}</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 opacity-50 transition-opacity group-hover:opacity-100" aria-hidden="true" />
              </a>
            </div>
          );
        })}
      </Marquee>
      </div>
    </section>
  );
}
