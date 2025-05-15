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

interface NewsCardProps {
  articlesUS: any;
  articlesIN: any;
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
    setIsLoading(true)
    const [responseUS, responseIN] = await Promise.all([
      fetch("https://readhub-backend.onrender.com/api/news/fetch-categories/us"),
      fetch("https://readhub-backend.onrender.com/api/news/fetch-categories/in")
    ]);

    if (!responseUS.ok) {
      toast(`HTTP error (US)! status: ${responseUS.status}`);
    } else {
      toast("US news has been fetched and updated");
    }

    if (!responseIN.ok) {
      toast(`HTTP error (IN)! status: ${responseIN.status}`);
    } else {
      toast("India news has been fetched and updated");
    }

    router.refresh();
    setIsLoading(false)

  } catch (error) {
    toast(`Error fetching news: ${error}`);
  }
};

  useEffect(() => {
    if (selectedCountry === "us") {
      setArticles(articlesUS);
    } else if (selectedCountry === "in") {
      setArticles(articlesIN);
    }
  }, [selectedCountry, articlesUS, articlesIN]);

  const filteredArticles =
    selectedCategory === "all"
      ? articles.slice(0, newsLimit)
      : articles
          .filter((article: any) =>
            article.category?.includes(selectedCategory)
          )
          .slice(0, newsLimit);

  return (
    <div className="w-full">
      {/* Category Buttons */}
      <div className="flex flex-wrap justify-between gap-2 mb-6">
        <div>
          {newsCategories.map((cat) => (
            <Button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 mr-2 rounded-full mb-2 transform transition-all duration-100 ${
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white scale-90"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {cat.name}
            </Button>
          ))}
          <span>
            <Button
              className="rounded-4xl  px-6 py-3 font-semibold bg-gray-200 text-gray-700"
              onClick={handleClickEvent}
            >
              <RefreshCcw className={`${isLoading ? "animate-spin" : ""} `}/>
            </Button>
          </span>
        </div>
        <div>
          {newsCountries.map((country) => (
            <Button
              size={"sm"}
              key={country.id}
              onClick={() => setSelectedCountry(country.id)}
              aria-pressed={selectedCountry === country.id}
              className={`px-4 py-2 mr-2 rounded-full mt-2 transform transition-all duration-100  ${
                selectedCountry === country.id
                  ? "bg-blue-600 text-white scale-90"
                  : "bg-gray-200 text-gray-700 "
              }`}
            >
              {country.tag}
            </Button>
          ))}
        </div>
      </div>

      {/* News Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
        {filteredArticles.map((article: any, i: number) => (
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
              <div className="flex items-center gap-2 mb-2">
                {article.category.map((cat: any, i: number) => (
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
              <div className="flex items-center text-xs ">
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
      {filteredArticles.length === 0 && (
        <div className="text-center text-gray-500 col-span-full">
          No articles found for this category.
        </div>
      )}
      {articles.length > 12 && (
        <Button
          onClick={handleLoadMore}
          className="items-center justify-center ml-230 mt-4"
        >
          Load More
        </Button>
      )}
    </div>
  );
}
