"use client";

import { useState } from "react";
import { ArrowUpRight, Bookmark, Sparkles, Telescope, ThumbsUp } from "lucide-react";
import { differenceInHours, format, formatDistanceToNow, isValid } from "date-fns";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import ToolTip from "../ui/custom/tooltip";
import { NEWS_CATEGORY_COLORS } from "@/constants";
import { Category, NewsArticle } from "@/types";
import { SavedListKey, useUserStore } from "@/lib/store/userStore";
import { ArticleAiMode } from "@/lib/hooks/useArticleAi";
import { NEWS_GRID } from "@/components/misc/skeletons";
import { apiRequest } from "@/lib/api-client";
import { CoverImage } from "@/components/misc/cover-image";

type SaveKind = "likes" | "bookmarks";
const SAVE_ENDPOINT: Record<SaveKind, string> = { likes: "/user/like-news", bookmarks: "/user/bookmark-news" };

const isRecent = (date: Date) => isValid(date) && differenceInHours(new Date(), date) <= 12;

function useSavedToggle() {
  const user = useUserStore((state) => state.user);
  const setSavedList = useUserStore((state) => state.setSavedList);
  const [pending, setPending] = useState<string | null>(null);

  const isSaved = (kind: SaveKind, article: NewsArticle) =>
    Boolean(article.savedRegion && user?.[`${kind}_${article.savedRegion}` as SavedListKey]?.includes(article.id));

  const toggle = async (kind: SaveKind, article: NewsArticle) => {
    if (!article.savedRegion) return;
    if (!user) {
      toast("Sign in to save articles.", { action: { label: "Sign in", onClick: () => { window.location.href = "/login"; } } });
      return;
    }
    const key = `${kind}_${article.savedRegion}` as SavedListKey;
    const previous = user[key] || [];
    const wasSaved = previous.includes(article.id);
    // Optimistic update; the server response is the source of truth.
    setSavedList(key, wasSaved ? previous.filter((id) => id !== article.id) : [...previous, article.id]);
    setPending(`${kind}:${article.id}`);
    try {
      const data = await apiRequest<Partial<Record<typeof kind, string[]>>>(SAVE_ENDPOINT[kind], {
        method: "POST",
        body: { newsId: article.id, country: article.savedRegion },
      });
      const ids = data?.[kind];
      if (Array.isArray(ids)) setSavedList(key, ids);
    } catch {
      setSavedList(key, previous);
      toast.error(`Couldn't update your ${kind === "likes" ? "likes" : "bookmarks"}. Please try again.`);
    } finally {
      setPending(null);
    }
  };

  return { isSaved, toggle, pending };
}

interface NewsCardItemsProps {
  articles: NewsArticle[];
  onOpenAi: (article: NewsArticle, mode: ArticleAiMode) => void;
}

export default function NewsCardItems({ articles, onOpenAi }: NewsCardItemsProps) {
  const { isSaved, toggle, pending } = useSavedToggle();

  return (
    <div className={NEWS_GRID}>
      {articles.map((article) => {
        const published = new Date(article.publishedAt);
        const liked = isSaved("likes", article);
        const bookmarked = isSaved("bookmarks", article);
        return (
          <Card key={article.id} className="group/card flex h-full flex-col overflow-hidden p-0 transition-shadow duration-200 hover:shadow-lg">
            <CardHeader className="p-0">
              <div className="relative h-44 w-full overflow-hidden bg-muted">
                <CoverImage
                  src={article.urlToImage}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
                {isRecent(published) && (
                  <span className="absolute left-2.5 top-2.5 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow">New</span>
                )}
                {article.source?.name && (
                  <span className="pointer-events-none absolute bottom-2 left-2.5 max-w-[55%] truncate text-[10px] font-semibold uppercase tracking-wider text-white/90">
                    {article.source.name}
                  </span>
                )}
                {isValid(published) && (
                  <ToolTip content={`${article.dateLabel ? "Detected by GDELT" : "Published"} · ${format(published, "MMM d, yyyy • h:mm a")}`}>
                    <time dateTime={article.publishedAt} className="absolute bottom-2 right-2.5 cursor-default text-[10px] font-medium text-white/80">
                      {formatDistanceToNow(published, { addSuffix: true })}
                    </time>
                  </ToolTip>
                )}
              </div>

              <div className="flex w-full items-center justify-between gap-3 px-3 pt-3">
                <div className="flex min-w-0 flex-wrap items-center gap-1.5">
                  {article.category.slice(0, 2).map((category) => (
                    <Badge key={category} variant="outline" className={`h-6 rounded-full px-2.5 text-[11px] font-semibold capitalize ${NEWS_CATEGORY_COLORS[category as Category] || ""}`}>
                      {category}
                    </Badge>
                  ))}
                  {article.sourceLanguage && article.sourceLanguage.toLowerCase() !== "english" && (
                    <Badge variant="outline" className="h-6 rounded-full px-2 text-[10px] font-medium text-muted-foreground">
                      {article.sourceLanguage}
                    </Badge>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <ToolTip content="Forecast how this story could develop">
                    <button
                      type="button"
                      aria-label={`Forecast: ${article.title}`}
                      onClick={() => onOpenAi(article, "forecast")}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-cyan-700 text-white shadow-sm transition-transform hover:scale-105"
                    >
                      <Telescope className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </ToolTip>
                  <ToolTip content="Ask AI to explain this article">
                    <button
                      type="button"
                      aria-label={`Ask AI about: ${article.title}`}
                      onClick={() => onOpenAi(article, "explain")}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-sm transition-transform hover:scale-105"
                    >
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </ToolTip>
                </div>
              </div>

              <CardTitle className="line-clamp-2 px-3 pt-2 text-base font-bold leading-snug">
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {article.title}
                </a>
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-grow px-3 pb-3 pt-1.5">
              {article.description && <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{article.description}</p>}
            </CardContent>

            <CardFooter className="mt-auto flex items-center justify-between border-t px-3 py-2">
              {article.savedRegion ? (
                <div className="flex items-center gap-0.5">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => void toggle("likes", article)}
                    disabled={pending === `likes:${article.id}`}
                    aria-label={liked ? `Unlike: ${article.title}` : `Like: ${article.title}`}
                    aria-pressed={liked}
                    className={`h-9 w-9 rounded-full ${liked ? "bg-rose-50 text-rose-600 dark:bg-rose-950/30" : "text-muted-foreground hover:text-rose-600"}`}
                  >
                    <ThumbsUp className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => void toggle("bookmarks", article)}
                    disabled={pending === `bookmarks:${article.id}`}
                    aria-label={bookmarked ? `Remove bookmark: ${article.title}` : `Bookmark: ${article.title}`}
                    aria-pressed={bookmarked}
                    className={`h-9 w-9 rounded-full ${bookmarked ? "bg-amber-50 text-amber-600 dark:bg-amber-950/30" : "text-muted-foreground hover:text-amber-600"}`}
                  >
                    <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
                  </Button>
                </div>
              ) : (
                <span />
              )}
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group/link flex min-h-9 items-center gap-1 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Read on {article.source?.name ? <span className="max-w-[9rem] truncate">{article.source.name}</span> : "source"}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" aria-hidden="true" />
              </a>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
