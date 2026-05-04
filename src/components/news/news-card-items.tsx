import { Bookmark, Sparkles, ThumbsUp, Telescope, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Category, NewsArticle } from "@/types";
import Link from "next/link";
import { NEWS_CATEGORY_COLORS } from "@/constants";
import ToolTip from "../ui/custom/tooltip";
import { formatDate, formatDistanceToNow } from "date-fns";
import Typography from "../ui/custom/typography";
import { Button } from "../ui/button";

interface NewsCardItemsProps {
  filteredArticles: NewsArticle[];
  onAskAi: (article: NewsArticle) => void;
  askFutureAi: (article: NewsArticle) => void;
  isLatest: (publishedAt: string) => boolean;
  token: string | null;
  country: string;
  initialLikes: string[];
  initialBookmarks: string[];
}

export default function NewsCardItems({
  filteredArticles,
  onAskAi,
  askFutureAi,
  isLatest,
  token,
  country,
  initialLikes,
  initialBookmarks,
}: NewsCardItemsProps) {
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const likeMap = initialLikes.reduce(
      (acc, id) => ({ ...acc, [id]: true }),
      {},
    );
    const bookmarkMap = initialBookmarks.reduce(
      (acc, id) => ({ ...acc, [id]: true }),
      {},
    );
    setLikes(likeMap);
    setBookmarks(bookmarkMap);
  }, [initialLikes, initialBookmarks]);

  const handleImageLoad = (id: string) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  const handleFutureClick = (article: NewsArticle) => {
    askFutureAi(article);
  };

  const toggleLike = async (id: string) => {
    if (!token) {
      toast.warning("🔒 Login to save your preferences!", {
        action: {
          label: "Login",
          onClick: () => (window.location.href = "/login"),
        },
      });
      return;
    }

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://readhub-backend.onrender.com/api";
      const res = await fetch(`${baseUrl}/user/like-news`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newsId: id, country }),
      });

      if (res.ok) {
        setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
        toast.success(
          likes[id] ? "Removed from likes" : "Added to liked articles",
          {
            duration: 1000,
          },
        );
      }
    } catch (err) {
      console.error("Error toggling like:", err);
      toast.error("Failed to update like");
    }
  };

  const toggleBookmark = async (id: string) => {
    if (!token) {
      toast.warning("🔒 Login to bookmark articles!", {
        action: {
          label: "Login",
          onClick: () => (window.location.href = "/login"),
        },
      });
      return;
    }

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://readhub-backend.onrender.com/api";
      const res = await fetch(`${baseUrl}/user/bookmark-news`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newsId: id, country }),
      });

      if (res.ok) {
        setBookmarks((prev) => ({ ...prev, [id]: !prev[id] }));
        toast.success(
          bookmarks[id] ? "Removed from bookmarks" : "Saved to bookmarks",
          {
            duration: 1000,
          },
        );
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
      toast.error("Failed to update bookmark");
    }
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {filteredArticles.map((article, i) => (
        <Card
          key={i}
          className="group/card overflow-hidden p-0 flex flex-col h-full border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
        >
          {/* ── Image ── */}
          <CardHeader className="p-0">
            <div className="relative h-44 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              {/* Skeleton */}
              {!loadedImages[article.id] && (
                <div className="absolute inset-0 z-10 animate-pulse bg-zinc-200 dark:bg-zinc-700" />
              )}

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.urlToImage || "/ReadHub_PlaceHolder.png"}
                alt={article.title}
                onLoad={() => handleImageLoad(article.id)}
                onError={(e) => {
                  e.currentTarget.src = "/ReadHub_PlaceHolder.png";
                  handleImageLoad(article.id);
                }}
                className={`object-cover w-full h-full transition-all duration-500 contrast-[1.05] group-hover/card:scale-105 ${
                  loadedImages[article.id] ? "opacity-100" : "opacity-0"
                }`}
              />

              {/* Bottom gradient for overlaid text */}
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

              {/* 🔴 New badge */}
              {isLatest(article.publishedAt) && (
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-md z-10">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  New
                </div>
              )}

              {/* Source name — bottom left */}
              {article.source?.name && (
                <span className="absolute bottom-2 left-2.5 text-[9px] font-bold uppercase tracking-widest text-white/80 truncate max-w-[55%] pointer-events-none">
                  {article.source.name}
                </span>
              )}

              {/* Time — bottom right */}
              <ToolTip content={formatDate(new Date(article.publishedAt), "MMM d, yyyy • h:mm a")}>
                <span className="absolute bottom-2 right-2.5 text-[9px] font-semibold text-white/70 cursor-default">
                  {formatDistanceToNow(new Date(article.publishedAt), { addSuffix: true })}
                </span>
              </ToolTip>
            </div>

            {/* ── Categories + AI Buttons ── */}
            <div className="flex items-center justify-between gap-3 px-3 pt-3 pb-0 w-full">
              <div className="flex flex-wrap gap-1.5 items-center">
                {article.category.map((cat, idx) => {
                  const colorClass = NEWS_CATEGORY_COLORS[cat as Category];
                  return (
                    <Badge
                      variant="outline"
                      key={`${cat}-${idx}`}
                      className={`rounded-full px-3 h-7 text-xs font-bold capitalize flex items-center justify-center shadow-sm ${colorClass}`}
                    >
                      {cat}
                    </Badge>
                  );
                })}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <ToolTip content="Forecast AI — See the Future of this Story">
                  <div className="relative">
                    <span className="absolute inset-0 rounded-full bg-cyan-400/25 animate-ping-slow" />
                    <button
                      onClick={() => handleFutureClick(article)}
                      className="is-shining relative overflow-hidden w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-cyan-600 text-white flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 ring-2 ring-cyan-400/60 shadow-md"
                    >
                      <Telescope className="w-4 h-4 relative z-10" />
                    </button>
                  </div>
                </ToolTip>
                <ToolTip content="Ask AI — Deep Insights on this Article">
                  <div className="relative">
                    <span className="absolute inset-0 rounded-full bg-violet-400/25 animate-ping-slow" />
                    <button
                      onClick={() => onAskAi(article)}
                      className="is-shining relative overflow-hidden w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all duration-200 ring-2 ring-violet-400/60 shadow-md"
                    >
                      <Sparkles className="w-4 h-4 relative z-10" />
                    </button>
                  </div>
                </ToolTip>
              </div>
            </div>

            {/* ── Title ── */}
            <CardTitle className="text-base font-black leading-snug px-3 pt-2 pb-0 line-clamp-2">
              {article.title}
            </CardTitle>
          </CardHeader>

          {/* ── Description ── */}
          <CardContent className="px-3 pt-1.5 pb-3 flex-grow">
            <Typography
              variant="small"
              color="muted"
              className="line-clamp-2 leading-relaxed opacity-75"
            >
              {article.description || "No description available."}
            </Typography>
          </CardContent>

          {/* ── Footer ── */}
          <CardFooter className="px-3 py-2.5 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60 mt-auto">
            {/* Like + Bookmark */}
            <div className="flex items-center gap-0.5">
              <ToolTip content={likes[article.id] ? "Unlike" : "Like"}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleLike(article.id)}
                  className={`h-8 w-8 rounded-full transition-all duration-200 cursor-pointer ${
                    likes[article.id]
                      ? "text-rose-500 bg-rose-50 dark:bg-rose-950/30"
                      : "text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${likes[article.id] ? "fill-current" : ""}`} />
                </Button>
              </ToolTip>

              <ToolTip content={bookmarks[article.id] ? "Remove Bookmark" : "Bookmark"}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleBookmark(article.id)}
                  className={`h-8 w-8 rounded-full transition-all duration-200 cursor-pointer ${
                    bookmarks[article.id]
                      ? "text-amber-500 bg-amber-50 dark:bg-amber-950/30"
                      : "text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${bookmarks[article.id] ? "fill-current" : ""}`} />
                </Button>
              </ToolTip>
            </div>

            {/* Read Source */}
            <ToolTip content={`Read on ${article.source?.name || "Source"}`}>
              <Link
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group/link"
              >
                Source
                <ArrowUpRight className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
              </Link>
            </ToolTip>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}

