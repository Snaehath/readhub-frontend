"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
  RefreshCcw,
  Search,
  ChevronDown,
  ChevronUp,
  Lock,
  Zap,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import Link from "next/link";

// custom
import { toast } from "sonner";
import { Button } from "../ui/button";
import TopLoadingBar from "../misc/topLoadBar";
import NewsCardItems from "./news-card-items";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { NewsArticle } from "@/types";
import { newsCategories, newsCountries } from "@/constants";
import { getNewsPaginated } from "@/lib/data";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { differenceInHours } from "date-fns";
import { useFutureAi } from "@/lib/hooks/useFutureAi";
import { Badge } from "../ui/badge";

export default function NewsCard() {
  // hooks
  const searchParams = useSearchParams();
  const router = useRouter();
  const futureAiRef = useRef<HTMLDivElement>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("us");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const [aiResponse, setAiResponse] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [futureToggles, setFutureToggles] = useState<Record<string, boolean>>(
    {},
  );
  const [token, setToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("query")?.toLocaleLowerCase() ?? "",
  );

  const MAX_CATEGORIES = 4;

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    setToken(storedToken);
  }, []);

  // Fetch paginated news based on country + category
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const res = await getNewsPaginated(
          page,
          12,
          selectedCategory,
          selectedCountry,
        );

        if (page === 1) {
          setArticles(res.news);
        } else {
          setArticles((prev) => [...prev, ...res.news]);
        }

        setHasMore(res.currentPage < res.totalPages);
      } catch (err) {
        console.error("Error fetching news:", err);
        toast("Failed to fetch news.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, [page, selectedCountry, selectedCategory, refreshTrigger]);

  // Reset pagination when country or category changes
  useEffect(() => {
    setPage(1);
  }, [selectedCountry, selectedCategory]);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleRefreshNews = async () => {
    try {
      setIsLoading(true);

      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://readhub-backend.onrender.com/api";
      const responseUS = await fetch(`${baseUrl}/news/fetch-categories/us`);
      const responseIN = await fetch(`${baseUrl}/news/fetch-categories/in`);

      await delay(1000);

      if (!responseUS.ok) {
        toast.error(`Failed to fetch US news. Please try again later.`);
      }
      if (!responseIN.ok) {
        toast.error(`Failed to fetch India news. Please try again later.`);
      }

      if (responseUS.ok && responseIN.ok) {
        toast.success("✨ Latest news updated successfully!");
        setRefreshTrigger((prev) => prev + 1);
      } else if (!responseUS.ok || !responseIN.ok) {
        toast.warning(
          "Some news sources couldn't be updated. Showing cached news.",
        );
      }

      setPage(1);
    } catch (_error) {
      toast.error(
        "Unable to refresh news. Please check your internet connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskAi = async (id: string) => {
    setAiResponse("");
    setAiLoading(true);
    setShowDialog(true);

    if (!token) {
      setAiLoading(false);
      return;
    }

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://readhub-backend.onrender.com/api";
      const res = await fetch(`${baseUrl}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userMessage: { id, selectedCountry } }),
      });
      const data = await res.json();
      setAiResponse(data?.reply?.trim() || "No response.");
    } catch (_error) {
      setAiResponse(
        `⚠️ Unable to generate AI summary. This could be due to:

• Network connectivity issues
• Server temporarily unavailable
• Rate limit exceeded

Please try again in a few moments.`,
      );
    } finally {
      setAiLoading(false);
    }
  };

  const {
    loading: futureLoading,
    futureAiArticle,
    error: aiError,
    fetchFutureAi,
    resetFutureAi,
  } = useFutureAi(token, selectedCountry);

  const handleFutureAi = (id: string) => fetchFutureAi(id);

  useEffect(() => {
    if (futureLoading && futureAiRef.current) {
      futureAiRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [futureLoading]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (searchQuery) {
      params.set("query", searchQuery.toLowerCase());
    } else {
      params.delete("query");
    }

    // Replace the URL without scrolling
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [router, searchQuery]);

  // filter News based on search
  const filteredNews = useMemo(() => {
    if (!articles) return [];
    return articles.filter((article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [articles, searchQuery]);

  const categoriesToShow = showAll
    ? newsCategories
    : newsCategories.slice(0, MAX_CATEGORIES);

  const isLatest = (dateOriginal: string) => {
    const hoursAgo = differenceInHours(new Date(), new Date(dateOriginal));
    return hoursAgo <= 2;
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      {/* AI Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600" />
              AI Summary
            </DialogTitle>
            <DialogDescription className="text-sm">
              Intelligent analysis and insights powered by AI
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            {!token ? (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
                <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-full">
                  <Lock className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div className="space-y-2 px-6">
                  <h3 className="text-lg font-semibold text-foreground">
                    AI Features are Locked
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Sign in to your ReadHub account to unlock intelligent news
                    summaries and deep analysis powered by AI.
                  </p>
                </div>
                <Button asChild className="rounded-full px-8 cursor-pointer">
                  <Link href="/login" onClick={() => setShowDialog(false)}>
                    Sign In to Unlock
                  </Link>
                </Button>
              </div>
            ) : aiLoading ? (
              <div className="flex flex-col items-center justify-center py-12 gap-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-indigo-100 dark:border-indigo-900 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-base font-semibold text-foreground">
                    Analyzing article...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    AI is processing the content
                  </p>
                </div>
              </div>
            ) : (
              <ReactMarkdown>{aiResponse}</ReactMarkdown>
            )}
          </div>

          <DialogFooter className="flex-shrink-0 mt-4">
            <Button
              onClick={() => setShowDialog(false)}
              className="rounded-full px-6 cursor-pointer"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading && <TopLoadingBar duration={15000} />}

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center sm:justify-between flex-wrap gap-3 mb-4">
        {/* Category buttons + refresh */}
        <div className="flex flex-wrap items-center gap-2">
          {categoriesToShow.map((cat) => (
            <Badge
              variant="outline"
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full cursor-pointer text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 transition-all duration-150 flex items-center justify-center ${
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white scale-95"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              aria-pressed={selectedCategory === cat.id}
            >
              {cat.name}
            </Badge>
          ))}
          {!showAll && newsCategories.length > MAX_CATEGORIES && (
            <Badge
              variant="outline"
              onClick={() => setShowAll(true)}
              className="rounded-full cursor-pointer text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-150 flex items-center justify-center gap-1"
              aria-label="Show all categories"
            >
              More
              <ChevronDown className="w-3 h-3" />
            </Badge>
          )}
          {showAll && newsCategories.length > MAX_CATEGORIES && (
            <Badge
              variant="outline"
              onClick={() => setShowAll(false)}
              className="rounded-full cursor-pointer text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all duration-150 flex items-center justify-center gap-1"
              aria-label="Show less categories"
            >
              Less
              <ChevronUp className="w-3 h-3" />
            </Badge>
          )}

          <Button
            className="cursor-pointer rounded-full text-xs sm:text-sm px-4 py-1.5 sm:px-6 sm:py-3 font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            onClick={handleRefreshNews}
            disabled={isLoading}
            aria-label="Fetch latest news"
          >
            <RefreshCcw
              className={`${isLoading ? "animate-spin" : ""} w-4 h-4`}
            />
            <span className="hidden sm:inline">
              {isLoading ? "Updating..." : "Get Latest"}
            </span>
            <span className="sm:hidden">{isLoading ? "..." : "Latest"}</span>
          </Button>
        </div>

        {/* Country buttons */}
        <div className="flex items-center gap-2">
          <Input
            type="text"
            startIcon={<Search className="w-4 h-4" />}
            placeholder={"Search News..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="rounded-full"
          />
          <div className="flex items-center bg-gray-200 rounded-full p-1 gap-2">
            {newsCountries.map((country) => (
              <div
                key={country.id}
                onClick={() => setSelectedCountry(country.id)}
                className={`flex gap-2 items-center justify-center cursor-pointer px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCountry === country.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-700"
                }`}
                aria-pressed={selectedCountry === country.id}
              >
                <Image
                  src={country.icon}
                  alt={country.name}
                  width={20}
                  height={20}
                />
                {country.tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Articles */}

      <NewsCardItems
        filteredArticles={filteredNews}
        onAskAi={handleAskAi}
        askFutureAi={handleFutureAi}
        isLatest={isLatest}
        futureToggles={futureToggles}
        setFutureToggles={setFutureToggles}
      />
      {/* Future AI */}
      {futureLoading || futureAiArticle || aiError ? (
        <div
          ref={futureAiRef}
          className="mt-6 bg-gray-50 dark:bg-zinc-900 border rounded-xl p-6 shadow-sm transition-all duration-300"
        >
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-500" />
              Future AI Insight
            </h3>
          </div>

          {futureLoading ? (
            <div className="flex items-center gap-3 py-8 text-sm text-muted-foreground">
              <svg
                className="w-5 h-5 animate-spin text-indigo-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              <span className="animate-pulse">
                Generating Future AI insight...
              </span>
            </div>
          ) : aiError ? (
            <div className="flex flex-col items-center justify-center py-6 text-center gap-4">
              {aiError.includes("Authentication Required") ? (
                <>
                  <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-full">
                    <Lock className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="space-y-2 px-6">
                    <h4 className="text-lg font-semibold text-foreground">
                      Feature Locked
                    </h4>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Sign in to your ReadHub account to unlock intelligent news
                      summaries and deep analysis powered by AI.
                    </p>
                  </div>
                  <Button
                    asChild
                    className="rounded-full px-8 cursor-pointer mt-2"
                  >
                    <Link href="/login">Sign In to Unlock</Link>
                  </Button>
                </>
              ) : (
                <div className="p-4 border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-950/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
                  {aiError}
                </div>
              )}
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-muted-foreground">
              <ReactMarkdown>{futureAiArticle}</ReactMarkdown>
            </div>
          )}

          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                resetFutureAi(); // clears AI article
                setFutureToggles({}); // resets all toggles
              }}
            >
              Close
            </Button>
          </div>
        </div>
      ) : null}

      {/* No Results */}
      {filteredNews.length === 0 && !isLoading && (
        <div className="text-center text-gray-500 mt-6">
          No articles found for this category.
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button
            className="cursor-pointer"
            onClick={() => setPage((prev) => prev + 1)}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
