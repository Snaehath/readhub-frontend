"use client";

import {
  RefreshCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";

import { toast } from "sonner";
import { Button } from "./ui/button";
import { NewsCardProps } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import NewsCardItems from "./news-card-items";
import { newsCategories,newsCountries } from "@/constants";

export default function NewsCard({ articlesUS, articlesIN }: NewsCardProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("us");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [newsLimit, setNewsLimit] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const filteredArticles = useMemo(() => {
    const source = selectedCountry === "us" ? articlesUS : articlesIN;
    const filtered = selectedCategory === "all"
      ? source
      : source.filter((article) =>
          article.category?.includes(selectedCategory)
        );
    return filtered.slice(0, newsLimit);
  }, [articlesUS, articlesIN, selectedCountry, selectedCategory, newsLimit]);

  useEffect(() => {
    if (selectedCategory !== "all") {
      setNewsLimit(12);
    }
  }, [selectedCategory]);

  const handleRefreshNews = async () => {
    try {
      setIsLoading(true);
      const [responseUS, responseIN] = await Promise.all([
        fetch("https://readhub-backend.onrender.com/api/news/fetch-categories/us"),
        fetch("https://readhub-backend.onrender.com/api/news/fetch-categories/in"),
      ]);

      if (!responseUS.ok) toast(`HTTP error (US): ${responseUS.status}`);
      if (!responseIN.ok) toast(`HTTP error (IN): ${responseIN.status}`);
      if (responseUS.ok && responseIN.ok) toast("Latest news updated");

      router.refresh();
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast(`Error fetching news: ${error.message}`);
      } else {
        toast("Unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskAi = async (id: string) => {
    setAiResponse("");
    setAiLoading(true);
    setShowDialog(true);

    try {
      const res = await fetch(
        "https://readhub-backend.onrender.com/api/ai/chat",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userMessage: { id, selectedCountry } }),
        }
      );
      const data = await res.json();
      setAiResponse(data?.reply?.trim() || "No response.");
    } catch (error) {
      console.error("Chat error:", error);
      setAiResponse("An error occurred while processing your request.");
    } finally {
      setAiLoading(false);
    }
  };

  const isLatest = (dateOriginal: string) => {
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
    return new Date(dateOriginal) > fourHoursAgo;
  };

  const getButtonClass = (active: boolean) =>
    `px-4 py-2 rounded-full transition-all duration-100 ${
      active ? "bg-blue-600 text-white scale-95" : "bg-gray-200 text-gray-700"
    }`;

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      {/* Dialog for AI response */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/30 scrollbar-track-transparent">
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

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between flex-wrap gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {newsCategories.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={getButtonClass(selectedCategory === cat.id)}
            >
              {cat.name}
            </Button>
          ))}
          <Button
            className="rounded-full px-6 py-3 font-semibold bg-gray-200 text-gray-700"
            onClick={handleRefreshNews}
            disabled={isLoading}
            aria-label="Refresh news"
            title="Refresh news"
          >
            <RefreshCcw className={`${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {newsCountries.map((country) => (
            <Button
              key={country.id}
              onClick={() => setSelectedCountry(country.id)}
              className={getButtonClass(selectedCountry === country.id)}
              aria-pressed={selectedCountry === country.id}
            >
              {country.tag}
            </Button>
          ))}
        </div>
      </div>

      <NewsCardItems filteredArticles={filteredArticles} onAskAi={handleAskAi} isLatest={isLatest}/>
      

      {/* No Results */}
      {filteredArticles.length === 0 && (
        <div className="text-center text-gray-500 mt-6">
          No articles found for this category.
        </div>
      )}

      {/* Load More */}
      {filteredArticles.length >= newsLimit && (
        <div className="flex justify-center mt-6">
          <Button onClick={() => setNewsLimit((prev) => prev + 8)}>Load More</Button>
        </div>
      )}
    </div>
  );
}
