"use client";

import { NewsArticle } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { CalendarIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { formatDate, formatDistanceToNow } from "date-fns";
import Typography from "../ui/custom/typography";
import ToolTip from "../ui/custom/tooltip";

interface FeaturedNewsCardProps {
  article: NewsArticle;
}
const FeaturedNewsCard: React.FC<FeaturedNewsCardProps> = ({
  article,
}) => {
  return (
    <Card className="overflow-hidden p-0">
      <div className="relative h-64 p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.urlToImage || "/ReadHub_PlaceHolder.png"}
          alt={article.title}
          className="object-cover w-full h-full rounded-xl"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/ReadHub_PlaceHolder.png";
          }}
        />
      </div>
      <CardHeader className="p-2 pt-0">
        <div className="flex items-center justify-between">
          <Badge>{article.source?.name ?? "Unknown"}</Badge>
        </div>
        <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {article.description}
        </p>
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
            {formatDate(
              new Date(article.publishedAt),
              "MMMM d, yyyy",
            )}
          </Typography>
        </div>
      </ToolTip>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary hover:underline"
        >
          Read more
        </a>
      </CardFooter>
    </Card>
  );
}

export default FeaturedNewsCard