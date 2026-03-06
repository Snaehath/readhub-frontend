"use client";

import { useState } from "react";
import { AllStoriesResponse } from "@/types";
import { Card } from "@/components/ui/card";
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

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-8">
        {stories.map((story) => (
          <Link
            href={`/story/${story.index}`}
            key={story.index}
            className="group"
          >
            <div className="relative flex flex-col h-full transition-all duration-500 hover:-translate-y-2">
              {/* Book Cover Container */}
              <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 border-2 border-transparent group-hover:border-blue-500/20">
                {!imageErrors[story.id] ? (
                  <Image
                    src={`${coverBaseUrl}/cover_${story.id}.jpg`}
                    alt={story.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={() =>
                      setImageErrors((prev) => ({ ...prev, [story.id]: true }))
                    }
                  />
                ) : (
                  <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 via-indigo-600/10 to-violet-600/20 flex flex-col items-center justify-center p-4 text-center">
                    <BookOpen className="w-12 h-12 mb-2 opacity-20 text-blue-600" />
                    <Typography
                      variant="h4"
                      className="text-sm font-black tracking-tight leading-tight line-clamp-3"
                    >
                      {story.title}
                    </Typography>
                  </div>
                )}

                {/* Rating Overlay */}
                {story.averageRating !== undefined &&
                  story.averageRating > 0 && (
                    <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md rounded-md px-1.5 py-0.5 flex items-center gap-1">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      <span className="text-[10px] font-black text-white">
                        {story.averageRating.toFixed(1)}
                      </span>
                    </div>
                  )}

                {/* Gradient Wash */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Metadata */}
              <div className="mt-4 px-1 space-y-1.5">
                <Typography
                  variant="h3"
                  className="text-sm sm:text-base font-black tracking-tight line-clamp-1 group-hover:text-blue-600 transition-colors"
                >
                  {story.title}
                </Typography>

                <div className="flex items-center justify-between text-[10px] sm:text-xs">
                  <span className="text-muted-foreground font-bold truncate pr-2">
                    {story.authorName}
                  </span>
                  <div className="flex items-center gap-1 text-blue-600 font-black shrink-0">
                    <List className="w-3 h-3" />
                    <span>{story.currentChapterCount}</span>
                  </div>
                </div>

                {story.synopsis && (
                  <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed italic opacity-0 group-hover:opacity-100 transition-opacity duration-500 h-0 group-hover:h-auto overflow-hidden">
                    {story.synopsis}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
