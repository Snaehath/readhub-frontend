import Link from "next/link";
import { CalendarIcon} from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getNews } from "@/lib/data";
import { NewsArticle } from "@/types";

export default async function FeaturedNews() {
  const allNews = await getNews();
  const featuredNews = allNews
  .filter((news: NewsArticle) => news.category?.includes('science'))
  .slice(0, 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredNews.map((article,i) => (
        <Card key={i} className="overflow-hidden">
          <div className="relative h-64 w-full p-2">
            <img
              src={article.urlToImage}
              alt={article.title}

              className="object-cover w-full h-full rounded-2xl"
            />
          </div>
          <CardHeader className="p-2">
            <div className="flex items-center justify-between mb-2">
              <Badge>{article.source.name}</Badge>
            </div>
            <CardTitle className="text-lg line-clamp-2">
              {article.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {article.description}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between">
            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarIcon className="mr-1 h-3 w-3" />
              {article.publishedAt.split(",")[0]}
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
  );
}
