"use client";

import { useState, useEffect } from "react";
import { RefreshCcw, ChevronDown, ChevronUp } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

// custom
import { toast } from "sonner";
import { Button } from "../ui/button";
import TopLoadingBar from "../misc/topLoadBar";
import NewsCardItems from "./news-card-items";
import NewsTicker from "./news-ticker";
import Typography from "../ui/custom/typography";
import AiSummaryModal from "./ai-summary-modal";
import FutureInsightModal from "./future-insight-modal";

import { NewsArticle } from "@/types";
import { newsCategories, newsCountries, API_BASE_URL } from "@/constants";
import { getNewsPaginated, searchNews } from "@/lib/data";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "../ui/input";
import { differenceInHours } from "date-fns";
import { useFutureAi } from "@/lib/hooks/useFutureAi";
import { Badge } from "../ui/badge";
import { useDebounce } from "@/lib/hooks/useDebounce";

export default function NewsCard() {
  // hooks
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<string>("us");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(
    null,
  );
  const [aiResponse, setAiResponse] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [showFutureDialog, setShowFutureDialog] = useState<boolean>(false);
  const [token, setToken] = useState<string | null>(null);
  const [userLikes, setUserLikes] = useState<string[]>([]);
  const [userBookmarks, setUserBookmarks] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get("query") ?? "",
  );

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const MAX_CATEGORIES = 4;

  useEffect(() => {
    const storedToken = localStorage.getItem("jwt");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    const fetchUserData = async () => {
      try {
        const baseUrl = API_BASE_URL;
        const res = await fetch(`${baseUrl}/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUserLikes([...(data.likes_us || []), ...(data.likes_in || [])]);
          setUserBookmarks([
            ...(data.bookmarks_us || []),
            ...(data.bookmarks_in || []),
          ]);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, [token]);

  // Fetch paginated news based on country + category (or search)
  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        let res;
        if (debouncedSearchQuery.trim()) {
          res = await searchNews(
            debouncedSearchQuery,
            page,
            12,
            selectedCountry,
            selectedCategory,
          );
        } else {
          res = await getNewsPaginated(
            page,
            12,
            selectedCategory,
            selectedCountry,
          );
        }

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
  }, [
    page,
    selectedCountry,
    selectedCategory,
    refreshTrigger,
    debouncedSearchQuery,
  ]);

  // Reset pagination when country, category, or search changes
  useEffect(() => {
    setPage(1);
  }, [selectedCountry, selectedCategory, debouncedSearchQuery]);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleRefreshNews = async () => {
    // GUARDRAILS: Rate Limiting
    const now = Date.now();
    const isGuest = !token;

    if (isGuest) {
      const guestRefreshData = JSON.parse(
        localStorage.getItem("guest_refresh_stats") ||
          '{"count": 0, "firstClick": 0}',
      );

      // Check if 24h window has passed to reset
      if (now - guestRefreshData.firstClick > 24 * 60 * 60 * 1000) {
        guestRefreshData.count = 0;
        guestRefreshData.firstClick = now;
      }

      if (guestRefreshData.count >= 3) {
        const hoursLeft = Math.ceil(
          (24 * 60 * 60 * 1000 - (now - guestRefreshData.firstClick)) /
            (1000 * 60 * 60),
        );
        toast.error(
          `Guest limit reached! Please sign in to get more updates or try again in ${hoursLeft} hours.`,
        );
        return;
      }

      // Update guest stats
      guestRefreshData.count += 1;
      localStorage.setItem(
        "guest_refresh_stats",
        JSON.stringify(guestRefreshData),
      );
    } else {
      // Authenticated User: 5-minute cooldown
      const lastAuthRefresh = parseInt(
        localStorage.getItem("last_auth_refresh") || "0",
      );
      const cooldownPeriod = 5 * 60 * 1000;

      if (now - lastAuthRefresh < cooldownPeriod) {
        const minsLeft = Math.ceil(
          (cooldownPeriod - (now - lastAuthRefresh)) / 60000,
        );
        toast.warning(
          `Please wait ${minsLeft} minute${minsLeft > 1 ? "s" : ""} before refreshing again. Stay updated with the ticker!`,
        );
        return;
      }
      localStorage.setItem("last_auth_refresh", now.toString());
    }

    try {
      setIsLoading(true);

      const baseUrl = API_BASE_URL;
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

        // Auto-trigger AI news generation on successful update
        if (token) {
          fetch(`${baseUrl}/ai-hub/news/trigger`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ suggestion: "auto" }),
          })
            .then((res) => {
              if (res.ok) {
                toast.success(
                  "📰 New AI Investigation generated based on latest news!",
                );
              }
            })
            .catch(console.error);
        }
      } else if (!responseUS.ok || !responseIN.ok) {
        toast.warning(
          "Some news sources couldn't be updated. Showing cached news.",
        );
      }

      setPage(1);
    } catch {
      toast.error(
        "Unable to refresh news. Please check your internet connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskAi = async (article: NewsArticle) => {
    setSelectedArticle(article);
    setAiResponse("");
    setAiLoading(true);
    setShowDialog(true);
    const id = article.id;

    if (!token) {
      setAiLoading(false);
      return;
    }

    try {
      const baseUrl = API_BASE_URL;
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    currentYear,
    error: aiError,
    fetchFutureAi,
    resetFutureAi,
  } = useFutureAi(token, selectedCountry);

  const handleFutureAi = (article: NewsArticle) => {
    setSelectedArticle(article);
    setShowFutureDialog(true);
    fetchFutureAi(article.id, 1);
  };

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
  const categoriesToShow = showAll
    ? newsCategories
    : newsCategories.slice(0, MAX_CATEGORIES);

  const isLatest = (dateOriginal: string) => {
    const hoursAgo = differenceInHours(new Date(), new Date(dateOriginal));
    return hoursAgo <= 12;
  };

  return (
    <>
      <NewsTicker country={selectedCountry} />
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <Typography variant="h2" className="mb-4">
          📰 Latest News
        </Typography>
        {/* AI Dialog */}
        <AiSummaryModal
          isOpen={showDialog}
          onOpenChange={setShowDialog}
          aiResponse={aiResponse}
          aiLoading={aiLoading}
          token={token}
          article={selectedArticle}
        />

        <FutureInsightModal
          isOpen={showFutureDialog}
          onOpenChange={(open) => {
            setShowFutureDialog(open);
            if (!open) {
              resetFutureAi();
            }
          }}
          insightResponse={futureAiArticle || ""}
          insightLoading={futureLoading}
          insightError={aiError}
          token={token}
          article={selectedArticle}
          currentYear={currentYear}
          onProjectNext={() => {
            if (selectedArticle) {
              fetchFutureAi(
                selectedArticle.id,
                currentYear + 1,
                futureAiArticle || "",
              );
            }
          }}
        />

        {isLoading && <TopLoadingBar duration={15000} />}

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center sm:justify-between flex-wrap gap-3 mb-4">
          {/* Category buttons + refresh */}
          <div className="flex flex-wrap items-center gap-2">
            {categoriesToShow.map((cat) => (
              <Badge
                variant="outline"
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setPage(1);
                }}
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
              type="search"
              onClear={() => {
                setSearchQuery("");
                setPage(1);
              }}
              placeholder={"Search News..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-full"
            />
            <div className="relative flex items-center bg-gray-200 dark:bg-zinc-800/80 rounded-full p-1 min-w-[140px]">
              {/* Animated Slider */}
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-linear-to-r from-blue-600 to-indigo-600 shadow-md transition-all duration-300 ease-in-out ${
                  selectedCountry === "us" ? "left-1" : "left-[50%]"
                }`}
              />
              {newsCountries.map((country) => (
                <div
                  key={country.id}
                  onClick={() => setSelectedCountry(country.id)}
                  className={`relative z-10 flex-1 flex gap-2 items-center justify-center cursor-pointer px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-300 transform active:scale-95 ${
                    selectedCountry === country.id
                      ? "text-white"
                      : "text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                  }`}
                  aria-pressed={selectedCountry === country.id}
                >
                  <ReactCountryFlag
                    countryCode={country.id === "in" ? "IN" : "US"}
                    svg
                    style={{
                      width: "1.2em",
                      height: "1.2em",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    title={country.name}
                  />
                  <Typography
                    variant="muted"
                    className="tracking-wide uppercase font-bold text-inherit leading-none"
                  >
                    {country.tag}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Articles */}

        <NewsCardItems
          filteredArticles={articles}
          onAskAi={handleAskAi}
          askFutureAi={handleFutureAi}
          isLatest={isLatest}
          token={token}
          country={selectedCountry}
          initialLikes={userLikes}
          initialBookmarks={userBookmarks}
        />

        {/* No Results */}
        {articles.length === 0 && !isLoading && (
          <Typography variant="muted" className="text-center mt-6">
            No articles found.
          </Typography>
        )}

        {/* Load More */}
        {hasMore && (
          <div className="flex justify-center mt-6 pb-12">
            <Button
              className="cursor-pointer"
              onClick={() => setPage((prev) => prev + 1)}
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
