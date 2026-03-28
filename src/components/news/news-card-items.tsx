import { Bookmark, CalendarIcon, Sparkles, ThumbsUp, Zap } from "lucide-react";
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
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {filteredArticles.map((article, i) => (
        <Card
          key={i}
          className="overflow-hidden hover:shadow-lg hover:shadow-gray-500/50 p-0 flex flex-col h-full"
        >
          <CardHeader className="p-0">
            <div className="relative h-64 w-full overflow-hidden">
              {isLatest(article.dateOriginal) && (
                <div className="absolute top-0 left-0 z-20 pointer-events-none">
                  <div className="absolute top-3 -left-7 w-28 -rotate-45 bg-linear-to-r from-red-600 to-orange-500 text-white text-xs Capitalize py-1 text-center shadow-lg border-y border-white/20">
                    Latest
                  </div>
                </div>
              )}
              {!loadedImages[article.id] && (
                <div className="absolute inset-0 z-10 bg-zinc-100 dark:bg-zinc-800 animate-pulse overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.urlToImage || "/ReadHub_PlaceHolder.png"}
                alt="news thumbnail"
                onLoad={() => handleImageLoad(article.id)}
                onError={(e) => {
                  e.currentTarget.src = "/ReadHub_PlaceHolder.png";
                  handleImageLoad(article.id);
                }}
                className={`object-cover w-full h-full transition-opacity duration-300 ${
                  loadedImages[article.id] ? "opacity-100" : "opacity-0"
                }`}
              />
              <Button
                onClick={() => handleFutureClick(article)}
                className="absolute top-2 right-2 flex items-center gap-1 px-3 py-1.5 
      text-xs font-semibold rounded-full shadow-md transition-all cursor-pointer
      bg-emerald-600/90 text-white hover:bg-emerald-600 hover:scale-105 active:scale-95
    "
                title="View Future AI insights"
              >
                Future AI
                <Zap className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mb-2 p-2 pt-0 pb-0">
              {article.category.map((cat, i) => {
                const colorClass = NEWS_CATEGORY_COLORS[cat as Category];
                return (
                  <Badge
                    variant={"outline"}
                    key={`${cat}-${i}`}
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${colorClass}`}
                  >
                    {cat}
                  </Badge>
                );
              })}
              <Badge
                className="ml-auto px-3 py-1 text-xs font-semibold rounded-full bg-linear-to-r from-violet-500 to-purple-500 text-white flex items-center cursor-pointer hover:from-violet-600 hover:to-purple-600 active:scale-95 transition-all duration-150 shadow-sm"
                onClick={() => onAskAi(article)}
                aria-label="Ask AI"
                variant="outline"
                title="Get Insights from AI"
              >
                Ask AI <Sparkles className="w-4 h-4 ml-1" />
              </Badge>
            </div>
            <CardTitle className="text-lg line-clamp-2 p-2 pt-0 pb-0">
              {article.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-0 pb-0 line-clamp-2">
            <Typography variant="small" color="muted">
              {article.description || "No description available."}
            </Typography>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex items-center justify-between border-t dark:border-zinc-800/50 mt-auto">
            <div className="flex items-center gap-1">
              <ToolTip
                content={likes[article.id] ? "Unlike" : "Like this article"}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleLike(article.id)}
                  className={`h-9 w-9 rounded-full transition-all duration-300 cursor-pointer ${
                    likes[article.id]
                      ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20"
                      : "text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  }`}
                >
                  <ThumbsUp
                    className={`w-4 h-4 ${likes[article.id] ? "fill-current" : ""}`}
                  />
                </Button>
              </ToolTip>

              <ToolTip
                content={
                  bookmarks[article.id] ? "Remove Bookmark" : "Bookmark this"
                }
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleBookmark(article.id)}
                  className={`h-9 w-9 rounded-full transition-all duration-300 cursor-pointer ${
                    bookmarks[article.id]
                      ? "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                      : "text-zinc-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                  }`}
                >
                  <Bookmark
                    className={`w-4.5 h-4.5 ${bookmarks[article.id] ? "fill-current" : ""}`}
                  />
                </Button>
              </ToolTip>
            </div>

            <div className="flex items-center gap-4">
              <ToolTip
                content={formatDistanceToNow(new Date(article.publishedAt), {
                  addSuffix: true,
                })}
              >
                <div className="hidden sm:flex items-center text-zinc-400">
                  <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
                  <Typography
                    variant="small"
                    className="text-[11px] font-medium"
                  >
                    {formatDate(new Date(article.publishedAt), "MMM d, yyyy")}
                  </Typography>
                </div>
              </ToolTip>
              <Link
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline transition-transform"
              >
                Read Source
              </Link>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
