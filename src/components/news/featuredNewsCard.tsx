/* eslint-disable @next/next/no-img-element */
"use client";

import { CalendarIcon } from "lucide-react";
import { format, isValid } from "date-fns";
import { Category, NewsArticle } from "@/types";
import { NEWS_CATEGORY_COLORS } from "@/constants";
import { Card } from "../ui/card";

export default function FeaturedNewsCard({ article }: { article: NewsArticle }) {
  const published = new Date(article.publishedAt);
  return (
    <Card className="group overflow-hidden p-0 transition-shadow hover:shadow-lg">
      <div className="relative h-56 overflow-hidden bg-muted">
        <img
          src={article.urlToImage || "/ReadHub_PlaceHolder.png"}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(event) => {
            event.currentTarget.src = "/ReadHub_PlaceHolder.png";
          }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {article.category[0] && (
          <span className={`absolute left-3 top-3 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold capitalize ${NEWS_CATEGORY_COLORS[article.category[0] as Category] || "bg-background/90 text-foreground"}`}>
            {article.category[0]}
          </span>
        )}
        <span className="absolute right-3 top-3 max-w-[50%] truncate rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
          {article.source?.name ?? "Publisher"}
        </span>
      </div>
      <div className="space-y-3 p-5">
        <h3 className="line-clamp-2 min-h-[3.25rem] text-lg font-semibold leading-snug">
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">{article.title}</a>
        </h3>
        {article.description && <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{article.description}</p>}
        <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
          {isValid(published) ? (
            <time dateTime={article.publishedAt} className="flex items-center gap-1.5">
              <CalendarIcon className="h-3.5 w-3.5" aria-hidden="true" />
              {format(published, "MMM d, yyyy")}
            </time>
          ) : <span />}
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">
            Read story
          </a>
        </div>
      </div>
    </Card>
  );
}
