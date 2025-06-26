import { CalendarIcon, BotMessageSquare } from "lucide-react";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { NewsArticle } from "@/types";
import Link from "next/link";

interface NewsCardItemsProps {
  filteredArticles: NewsArticle[] ;
  onAskAi: (id: string) => void;
  isLatest: (publishedAt: string) => boolean;
}

export default function NewsCardItems({
  filteredArticles,
  onAskAi,
  isLatest,
}: NewsCardItemsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredArticles.map((article, i) => (
          <Card key={i} className="overflow-hidden hover:shadow-lg hover:shadow-gray-500/50">
            <div className="relative h-64 w-full outline outline-black">
              {isLatest(article.dateOriginal) && (
                <div className="absolute top-0 left-0 overflow-hidden w-24 h-24">
                  <div className="absolute transform -rotate-45 bg-red-500 text-white text-[10px] font-bold py-1 px-0.5 left-[-30px] top-[18px] w-[100px] text-center shadow-md">
                    Latest
                  </div>
                </div>
              )}
              <img
                src={article.urlToImage || "https://placehold.co/400x200?text=ReadHub%0ADigital+Reading+Companion"}
                alt="news thumbnail"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/400x200?text=ReadHub%0ADigital+Reading+Companion";
                }}
                className="object-cover w-full h-full"
              />
            </div>
            <CardHeader className="p-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {article.category.map((cat, i) => (
                  <Badge
                    key={`${cat}-${i}`}
                    className="rounded-full px-3 py-1 text-xs font-semibold"
                  >
                    {cat}
                  </Badge>
                ))}
                <Badge
                  className="ml-auto px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 flex items-center cursor-pointer hover:bg-indigo-200 active:scale-95 active:bg-indigo-300 transition-transform duration-150"
                  onClick={() => onAskAi(article.id)}
                  aria-label="Ask AI"
                  title="Ask AI"
                >
                  Ask AI <BotMessageSquare className="w-4 h-4 ml-1" />
                </Badge>
              </div>
              <CardTitle className="text-lg line-clamp-2">
                {article.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-muted-foreground line-clamp-3 text-justify">
                {article.description || "No description available."}
              </p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between">
              <div className="flex items-center text-xs">
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
