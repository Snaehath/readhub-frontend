"use client";

import { useState } from "react";
import { AllStoriesResponse } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, List, Star } from "lucide-react";
import Link from "next/link";
import Typography from "@/components/ui/custom/typography";
import Image from "next/image";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function StoryLibrary() {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://readhub-backend.onrender.com/api";
  const coverBaseUrl = baseUrl.replace("/api", "") + "/covers";

  const { data, isLoading } = useSWR<AllStoriesResponse>(
    `${baseUrl}/story/allStories`,
    fetcher,
  );

  const stories = data?.stories || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-64 animate-pulse bg-muted/20" />
        ))}
      </div>
    );
  }

  if (stories.length === 0) return null;

  return (
    <section className="mt-20">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Typography
            variant="h2"
            className="text-2xl font-bold tracking-tight"
          >
            Original Library
          </Typography>
          <Typography
            variant="p"
            className="text-sm text-muted-foreground mt-1"
          >
            Browse fully realized narratives from our AI Archive
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stories.map((story) => (
          <Link
            href={`/story/${story.index}`}
            key={story.index}
            className="group"
          >
            <Card className="overflow-hidden h-full border shadow-sm transition-all hover:shadow-md hover:bg-muted/50">
              <div className="h-44 relative overflow-hidden flex items-center justify-center border-b">
                {!imageErrors[story.id] ? (
                  <Image
                    src={`${coverBaseUrl}/cover_${story.id}.jpg`}
                    alt={story.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-110 duration-700"
                    onError={() =>
                      setImageErrors((prev) => ({ ...prev, [story.id]: true }))
                    }
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 via-indigo-600/5 to-violet-600/10 flex items-center justify-center p-6">
                    <BookOpen className="absolute -bottom-2 -right-2 w-16 h-16 opacity-5 rotate-12" />
                    <Typography
                      variant="h3"
                      className="text-lg font-black tracking-tight text-center line-clamp-2"
                    >
                      {story.title}
                    </Typography>
                  </div>
                )}
              </div>
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {story.isCompleted ? (
                      <Badge
                        variant="outline"
                        className="text-[9px] uppercase tracking-widest border-emerald-500/30 text-emerald-600 bg-emerald-500/5"
                      >
                        Completed
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[9px] uppercase tracking-widest border-amber-500/30 text-amber-600 bg-amber-500/5 flex items-center gap-1"
                      >
                        <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />{" "}
                        Ongoing
                      </Badge>
                    )}
                    {story.averageRating !== undefined &&
                      story.averageRating > 0 && (
                        <div className="flex items-center gap-0.5 text-[10px] font-black text-amber-500">
                          <Star className="w-2.5 h-2.5 fill-amber-500" />
                          {story.averageRating.toFixed(1)}
                        </div>
                      )}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold">
                    <List className="w-3 h-3" />
                    {story.currentChapterCount} Chapters
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <Typography
                  variant="p"
                  className="text-xs text-muted-foreground line-clamp-2 italic mb-4"
                >
                  &quot;{story.subject}&quot;
                </Typography>
                <div className="flex items-center justify-end mt-auto">
                  <Typography
                    variant="small"
                    className="text-[10px] font-bold text-primary"
                  >
                    By {story.authorName}
                  </Typography>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
