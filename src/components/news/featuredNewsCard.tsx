"use client";

import { NewsArticle } from "@/types";
import { Card } from "../ui/card";
import { CalendarIcon, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { formatDate, formatDistanceToNow, differenceInHours } from "date-fns";
import Typography from "../ui/custom/typography";
import ToolTip from "../ui/custom/tooltip";
import Image from "next/image";
import { useState } from "react";

interface FeaturedNewsCardProps {
  article: NewsArticle;
}

const FeaturedNewsCard: React.FC<FeaturedNewsCardProps> = ({ article }) => {
  const [imageError, setImageError] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Helper to check if news is recent (within 12 hours)
  const isLatest = (dateStr: string) => {
    try {
      const hoursAgo = differenceInHours(new Date(), new Date(dateStr));
      return hoursAgo <= 12;
    } catch {
      return false;
    }
  };

  return (
    <Card className="group overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 shadow-md hover:shadow-lg hover:shadow-gray-500/50 transition-all duration-300 rounded-xl bg-background p-0">
      <div className="relative h-64 overflow-hidden">
        {/* Latest Ribbon (Matching news-card-items style) */}
        {isLatest(article.publishedAt) && (
          <div className="absolute top-0 left-0 z-20 pointer-events-none">
            <div className="absolute top-3 -left-7 w-28 -rotate-45 bg-linear-to-r from-red-600 to-orange-500 text-white text-[10px] font-black uppercase py-1 text-center shadow-lg border-y border-white/20">
              Latest
            </div>
          </div>
        )}

        {/* Source Badge Overlay */}
        <div className="absolute top-4 right-4 z-20">
          <Badge className="bg-zinc-900/80 text-white border-0 backdrop-blur-md font-bold tracking-widest text-[10px] py-1 px-3">
            {article.source?.name ?? "Global News"}
          </Badge>
        </div>

        {/* Image Container */}
        <div className="relative w-full h-full">
          <Image
            src={
              imageError
                ? "/ReadHub_PlaceHolder.png"
                : article.urlToImage || "/ReadHub_PlaceHolder.png"
            }
            alt={article.title}
            fill
            className={`object-cover transition-opacity duration-500 ${isImageLoading ? "opacity-0" : "opacity-100"}`}
            onLoadingComplete={() => setIsImageLoading(false)}
            onError={() => {
              setImageError(true);
              setIsImageLoading(false);
            }}
          />
          {/* Skeleton Loader Background */}
          {isImageLoading && !imageError && (
            <div className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800 animate-pulse flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-zinc-300 dark:text-zinc-700" />
            </div>
          )}
        </div>
      </div>

      <div className="p-5 space-y-3">
        <Typography
          variant="h3"
          className="text-lg font-bold tracking-tight leading-snug line-clamp-2 min-h-[3.2rem]"
        >
          {article.title}
        </Typography>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed min-h-[2.5rem]">
          {article.description || "No description provided for this article."}
        </p>

        <div className="pt-4 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800">
          <ToolTip
            content={formatDistanceToNow(new Date(article.publishedAt), {
              addSuffix: true,
            })}
          >
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <Typography variant="small" className="text-[11px] font-medium">
                {formatDate(new Date(article.publishedAt), "MMM d, yyyy")}
              </Typography>
            </div>
          </ToolTip>

          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-primary hover:underline uppercase tracking-wider"
          >
            Read More
          </a>
        </div>
      </div>
    </Card>
  );
};

export default FeaturedNewsCard;
