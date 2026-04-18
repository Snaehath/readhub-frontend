import { Bookmark, Sparkles, ThumbsUp, TrendingUp } from "lucide-react";
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
          className="overflow-hidden hover:border-zinc-900 dark:hover:border-zinc-100 p-0 flex flex-col h-full transition-colors border-zinc-200 dark:border-zinc-800"
        >
          <CardHeader className="p-0">
            <div className="relative h-64 w-full overflow-hidden">
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
                className={`object-cover w-full h-full transition-opacity duration-300 contrast-[1.1] ${
                  loadedImages[article.id] ? "opacity-100" : "opacity-0"
                }`}
              />
              {/* Removed absolute Future AI button from image */}
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
              <div className="ml-auto flex items-center gap-2">
                <ToolTip content="Predicted Future insights">
                  <Badge
                    className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full bg-linear-to-r from-cyan-600 to-blue-600 text-white flex items-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-150 shadow-lg shadow-cyan-500/10 border-0"
                    onClick={() => handleFutureClick(article)}
                    variant="outline"
                  >
                    Forecast AI <TrendingUp className="w-3.5 h-3.5 ml-1.5" />
                  </Badge>
                </ToolTip>
                <ToolTip content="Get Insights from AI">
                  <Badge
                    className="px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full bg-linear-to-r from-indigo-600 to-violet-600 text-white flex items-center cursor-pointer hover:scale-105 active:scale-95 transition-all duration-150 shadow-lg shadow-indigo-500/10 border-0"
                    onClick={() => onAskAi(article)}
                    variant="outline"
                  >
                    Ask AI <Sparkles className="w-3.5 h-3.5 ml-1.5" />
                  </Badge>
                </ToolTip>
              </div>
            </div>
            <CardTitle className="text-lg font-black leading-tight p-2 pt-1 pb-0 line-clamp-2">
              {article.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 pt-1 pb-4 flex-grow">
            <Typography
              variant="small"
              color="muted"
              className="line-clamp-2 leading-relaxed italic opacity-80 border-l-2 border-zinc-200 dark:border-zinc-800 pl-3"
            >
              {article.description || "No description available."}
            </Typography>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex items-center justify-between border-t dark:border-zinc-800/20 mt-auto bg-zinc-50/30 dark:bg-zinc-900/10">
            <div className="flex items-center gap-1.5">
              <ToolTip
                content={likes[article.id] ? "Unlike" : "Like this article"}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleLike(article.id)}
                  className={`h-9 w-9 rounded-full transition-all duration-300 cursor-pointer ${
                    likes[article.id]
                      ? "text-zinc-900 bg-zinc-200 dark:text-zinc-100 dark:bg-zinc-800"
                      : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
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
                      ? "text-zinc-900 bg-zinc-200 dark:text-zinc-100 dark:bg-zinc-800"
                      : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <Bookmark
                    className={`w-4 h-4 ${bookmarks[article.id] ? "fill-current" : ""}`}
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
                <div className="hidden sm:flex items-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  {formatDate(new Date(article.publishedAt), "MMM d, yyyy")}
                </div>
              </ToolTip>
              <div className="w-px h-3 bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />
              <Link
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-black uppercase tracking-widest text-zinc-900 dark:text-zinc-100 hover:underline transition-all"
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
