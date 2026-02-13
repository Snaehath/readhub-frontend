import { CalendarIcon, BotMessageSquare } from "lucide-react";
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
import { Button } from "../ui/button";
import { CATEGORY_COLORS } from "@/constants";
import ToolTip from "../ui/custom/tooltip";
import { formatDate, formatDistanceToNow } from "date-fns";
import Typography from "../ui/custom/typography";

interface NewsCardItemsProps {
  filteredArticles: NewsArticle[];
  onAskAi: (id: string) => void;
  askFutureAi: (id: string) => void;
  isLatest: (publishedAt: string) => boolean;
  futureToggles: Record<string, boolean>;
  setFutureToggles: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}

export default function NewsCardItems({
  filteredArticles,
  onAskAi,
  askFutureAi,
  isLatest,
  futureToggles,
  setFutureToggles,
}: NewsCardItemsProps) {
  const handleFutureToggle = (id: string) => {
    const isToggledOn = !futureToggles[id];
    setFutureToggles((prev) => ({ ...prev, [id]: isToggledOn }));

    if (isToggledOn) {
      askFutureAi(id);
    }
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      {filteredArticles.map((article, i) => (
        <Card
          key={i}
          className="overflow-hidden hover:shadow-lg hover:shadow-gray-500/50 p-0"
        >
          <CardHeader className="p-0">
            <div className="relative h-64 w-full">
              {isLatest(article.dateOriginal) && (
                <div className="absolute top-0 left-0 overflow-hidden w-24 h-24">
                  <div className="absolute transform -rotate-45 bg-red-500 text-white text-[10px] font-bold py-1 px-0.5 left-[-30px] top-[18px] w-[100px] text-center shadow-md">
                    Latest
                  </div>
                </div>
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.urlToImage || "/ReadHub_PlaceHolder.png"}
                alt="news thumbnail"
                onError={(e) => {
                  e.currentTarget.src = "/ReadHub_PlaceHolder.png";
                }}
                className="object-cover w-full h-full "
              />
              <Button
                onClick={() => handleFutureToggle(article.id)}
                className={`absolute top-2 right-2 flex items-center gap-1 px-3 py-1.5 
      text-xs font-semibold rounded-full shadow-md transition-all
      ${
        futureToggles[article.id]
          ? "bg-emerald-600 text-white hover:bg-emerald-700"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }
    `}
                title="Toggle Future AI insights"
              >
                {futureToggles[article.id] ? "Future ON" : "Future AI"}
                <BotMessageSquare className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mb-2 p-2 pt-0 pb-0">
              {article.category.map((cat, i) => {
                const colorClass = CATEGORY_COLORS[cat as Category];
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
                className="ml-auto px-3 py-1 text-xs font-semibold rounded-full bg-indigo-600 text-white flex items-center cursor-pointer hover:bg-indigo-700 active:scale-95 transition-transform duration-150"
                onClick={() => onAskAi(article.id)}
                aria-label="Ask AI"
                variant="outline"
                title="Get Insights from AI"
              >
                Ask AI <BotMessageSquare className="w-4 h-4 ml-1" />
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
          <CardFooter className="p-4 pt-0 flex justify-between">
            <ToolTip
              content={formatDistanceToNow(new Date(article.publishedAt), {
                addSuffix: true,
              })}
            >
              <div className="flex items-center">
                <CalendarIcon className="mr-1 h-4 w-4" />
                <Typography variant="small" color="muted">
                  {formatDate(new Date(article.publishedAt), "MMMM d, yyyy")}
                </Typography>
              </div>
            </ToolTip>
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
