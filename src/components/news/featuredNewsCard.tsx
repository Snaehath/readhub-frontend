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

export default function FeaturedNewsCard({
  article,
}: {
  article: NewsArticle;
}) {
  return (
    <Card className="overflow-hidden rounded-lg shadow p-0">
      <div className="relative h-64 w-full p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={article.urlToImage || "/ReadHub_PlaceHolder.png"}
          alt={article.title}
          className="object-cover w-full h-full rounded-2xl"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/ReadHub_PlaceHolder.png";
          }}
        />
      </div>
      <CardHeader className="p-2">
        <div className="flex items-center justify-between mb-2">
          <Badge>{article.source?.name ?? "Unknown"}</Badge>
        </div>
        <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
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
