"use client";

import { useState, useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";

import { toast } from "sonner";
import { Button } from "../ui/button";
import TopLoadingBar from "../topLoadBar";
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

export default function NewsCard() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("us");
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [token, setToken] = useState<string | null>(null);

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
          selectedCountry
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
  }, [page, selectedCountry, selectedCategory]);

  // Reset pagination when country or category changes
  useEffect(() => {
    setPage(1);
  }, [selectedCountry, selectedCategory]);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const handleRefreshNews = async () => {
    try {
      setIsLoading(true);

      const responseUS = await fetch(
        "https://readhub-backend.onrender.com/api/news/fetch-categories/us"
      );
      const responseIN = await fetch(
        "https://readhub-backend.onrender.com/api/news/fetch-categories/in"
      );

      await delay(1000);

      if (!responseUS.ok) toast(`HTTP error (US): ${responseUS.status}`);
      if (!responseIN.ok) toast(`HTTP error (IN): ${responseIN.status}`);

      if (responseUS.ok && responseIN.ok) toast("Latest news updated");

      setPage(1);
    } catch (error) {
      toast(`Error refreshing news: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskAi = async (id: string) => {
    setAiResponse("");
    setAiLoading(true);
    setShowDialog(true);

    if (!token) {
      setAiResponse("🔒 Please log in to use AI features.");
      setAiLoading(false);
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/ai/chat", //https://readhub-backend.onrender.com/api/ai/chat
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userMessage: { id, selectedCountry } }),
        }
      );
      const data = await res.json();
      setAiResponse(data?.reply?.trim() || "No response.");
    } catch (error) {
      setAiResponse(
        `An error occurred while processing your request: ${error}`
      );
    } finally {
      setAiLoading(false);
    }
  };

  const isLatest = (dateOriginal: string) => {
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    return new Date(dateOriginal) > fourHoursAgo;
  };

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      {/* AI Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI Summary</DialogTitle>
            <DialogDescription>
              Insight and explanation of the selected news.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto whitespace-pre-wrap text-sm text-muted-foreground">
            {aiLoading ? (
              <div className="flex items-center gap-2 py-4">
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
                <span>Analysing...</span>
              </div>
            ) : (
              <ReactMarkdown>{aiResponse}</ReactMarkdown>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setShowDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isLoading && <TopLoadingBar duration={15000} />}

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between flex-wrap gap-3 mb-4">
        {/* Category buttons + refresh */}
        <div className="flex flex-wrap gap-2">
          {newsCategories.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2 transition-all duration-100 ${
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white scale-95"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {cat.name}
            </Button>
          ))}
          <Button
            className="rounded-full text-xs sm:text-sm px-3 py-1.5 sm:px-6 sm:py-3 font-medium bg-gray-200 text-gray-700"
            onClick={handleRefreshNews}
            disabled={isLoading}
            aria-label="Refresh news"
          >
            <RefreshCcw
              className={`${isLoading ? "animate-spin" : ""} w-4 h-4`}
            />
          </Button>
        </div>

        {/* Country buttons */}
        <div className="flex bg-gray-200 rounded-full p-1 w-max">
          {newsCountries.map((country) => (
            <div
              key={country.id}
              onClick={() => setSelectedCountry(country.id)}
              className={`cursor-pointer px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCountry === country.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-700"
              }`}
              aria-pressed={selectedCountry === country.id}
            >
              {country.tag}
            </div>
          ))}
        </div>
      </div>

      {/* Articles */}

      <NewsCardItems
        filteredArticles={articles}
        onAskAi={handleAskAi}
        isLatest={isLatest}
      />

      {/* No Results */}
      {articles.length === 0 && !isLoading && (
        <div className="text-center text-gray-500 mt-6">
          No articles found for this category.
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button onClick={() => setPage((prev) => prev + 1)}>Load More</Button>
        </div>
      )}
    </div>
  );
}
