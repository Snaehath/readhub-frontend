"use client";

import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import { getTickerNewsApi } from "@/api/news";
import { Category, NewsArticle } from "@/types";
import { Loader2 } from "lucide-react";
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
      <div className="bg-blue-600 dark:bg-indigo-900 text-white py-2 shadow-sm flex justify-center items-center h-9">
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
        <Typography variant="small" className="text-white">Fetching highlights...</Typography>
      </div>
    );
  }

  if (tickerItems.length === 0) return null;

  return (
    <div className="w-full py-3 sticky top-0 z-40 bg-background/60 backdrop-blur-xl border-b dark:border-zinc-800/50 border-gray-200/50">
      <Marquee
        gradient={true}
        gradientColor="transparent"
        speed={45}
        pauseOnHover
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
              className="flex items-center gap-4 mx-6 text-sm font-semibold tracking-tight"
            >
              <Typography
                variant="muted"
                className={`px-2.5 py-0.5 rounded-full text-xs capitalize tracking-tighter border shadow-sm leading-none ${colorClass}`}
              >
                {category}
              </Typography>
              <Typography
                variant="small"
                className="text-foreground/80 hover:text-blue-600 dark:hover:text-indigo-400 transition-colors cursor-default whitespace-nowrap"
              >
                {article.title}
              </Typography>
              <div className="flex gap-1 items-center opacity-30">
                <span className="w-1 h-1 rounded-full bg-foreground" />
                <span className="w-1 h-1 rounded-full bg-foreground scale-75" />
              </div>
              <span className="w-1 h-1 rounded-full bg-foreground mx-2 opacity-20" />
            </div>
          );
        })}
      </Marquee>
    </div>
  );
}
