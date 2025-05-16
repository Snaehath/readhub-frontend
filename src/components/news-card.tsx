"use client";

import { CalendarIcon, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { Badge } from "./ui/badge";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { NewsArticle } from "@/types";

interface NewsCardProps {
  articlesUS: NewsArticle[];
  articlesIN: NewsArticle[];
}

export default function NewsCard({ articlesUS, articlesIN }: NewsCardProps) {
  const [articles, setArticles] = useState(articlesUS);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("us");
  const [newsLimit, setNewsLimit] = useState(12);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const newsCategories = [
    { id: "all", name: "All" },
    { id: "technology", name: "Technology" },
    { id: "business", name: "Business" },
    { id: "politics", name: "Politics" },
    { id: "health", name: "Health" },
    { id: "sports", name: "Sports" },
    { id: "science", name: "Science" },
    { id: "entertainment", name: "Entertainment" },
  ];

  const newsCountries = [
    { id: "us", name: "USA", tag: "US" },
    { id: "in", name: "INDIA", tag: "IN" },
  ];

  const handleLoadMore = () => {
    setNewsLimit((prevLimit) => prevLimit + 8);
  };

  const handleClickEvent = async () => {
    try {
      setIsLoading(true);
      const [responseUS, responseIN] = await Promise.all([
        fetch("https://readhub-backend.onrender.com/api/news/fetch-categories/us"),
        fetch("https://readhub-backend.onrender.com/api/news/fetch-categories/in"),
      ]);

      if (!responseUS.ok) {
        toast(`HTTP error (US)! status: ${responseUS.status}`);
      }
      if (!responseIN.ok) {
        toast(`HTTP error (IN)! status: ${responseIN.status}`);
      } else {
        toast("Latest news has been fetched and updated");
      }

      router.refresh();
      setIsLoading(false);
    } catch (error) {
      toast(`Error fetching news: ${error}`);
    }
  };

  useEffect(() => {
    setArticles(selectedCountry === "us" ? articlesUS : articlesIN);
  }, [selectedCountry, articlesUS, articlesIN]);

  const filteredArticles =
    selectedCategory === "all"
      ? articles.slice(0, newsLimit)
      : articles
          .filter((article) => article.category?.includes(selectedCategory))
          .slice(0, newsLimit);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      {/* Category + Country Buttons */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between flex-wrap gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {newsCategories.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full transition-all duration-100 ${
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white scale-95"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {cat.name}
            </Button>
          ))}
          <Button
            className="rounded-full px-6 py-3 font-semibold bg-gray-200 text-gray-700"
            onClick={handleClickEvent}
          >
            <RefreshCcw className={`${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {newsCountries.map((country) => (
            <Button
              key={country.id}
              onClick={() => setSelectedCountry(country.id)}
              aria-pressed={selectedCountry === country.id}
              className={`px-4 py-2 rounded-full transition-all duration-100 ${
                selectedCountry === country.id
                  ? "bg-blue-600 text-white scale-95"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {country.tag}
            </Button>
          ))}
        </div>
      </div>

      {/* News Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredArticles.map((article, i: number) => (
          <Card
            className="overflow-hidden hover:shadow-lg hover:shadow-gray-500/50"
            key={i}
          >
            <div className="relative h-64 w-full outline outline-black">
              <img
                src={article.urlToImage || "https://placehold.co/400x200"}
                alt="news thumbnail"
                className="object-cover w-full h-full"
              />
            </div>
            <CardHeader className="p-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {article.category.map((cat, i: number) => (
                  <Badge key={i}>{cat}</Badge>
                ))}
              </div>
              <CardTitle className="text-lg line-clamp-2">
                {article.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {article.description || "No description available."}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <div className="flex items-center text-xs">
                <CalendarIcon className="mr-1 h-3 w-3" />
                {new Date(article.publishedAt).toLocaleDateString()}
              </div>
              <Link
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                Read more
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* when no article found in the category */}
      {filteredArticles.length === 0 && (
        <div className="text-center text-gray-500 mt-6">
          No articles found for this category.
        </div>
      )}

      {/* Load More Button */}
      {articles.length > newsLimit && (
        <div className="flex justify-center mt-6">
          <Button onClick={handleLoadMore}>Load More</Button>
        </div>
      )}
    </div>
  );
}
