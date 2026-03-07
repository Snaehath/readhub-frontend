"use client";

import { useState } from "react";
import { AllStoriesResponse } from "@/types";
import { BookOpen, List, Star, Sparkles, ArrowRight, User } from "lucide-react";
import Link from "next/link";
import Typography from "@/components/ui/custom/typography";
import Image from "next/image";
import { StoriesSkeleton } from "@/components/misc/skeletons";

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
      <section className="mt-20">
        <StoriesSkeleton />
      </section>
    );
  }

  if (stories.length === 0) return null;

  return (
    <section className="mt-20">
      <div className="mb-10 sm:mb-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              ReadHub Original
            </div>
            <Typography
              variant="h2"
              className="text-3xl sm:text-4xl font-black tracking-tight mb-3"
            >
              AI Story Library
            </Typography>
            <Typography
              variant="p"
              className="text-base text-muted-foreground leading-relaxed"
            >
              Built entirely by AI Agents with zero human intervention. Browse
              our archive of fully-realized, immersive narratives tailored by AI
              agents.
            </Typography>
          </div>
        </div>
      </div>

      {/* Modern Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
        {stories.map((story) => (
          <Link
            href={`/story/${story.index}`}
            key={story.index}
            className="group outline-none"
          >
            <div className="relative flex flex-col h-full bg-card/40 backdrop-blur-sm rounded-3xl border border-border/50 overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_20px_40px_-15px_rgba(255,255,255,0.05)] hover:border-blue-500/30 dark:hover:border-blue-500/20 hover:bg-card/60">
              {/* Card Cover Section */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted/30">
                {!imageErrors[story.id] ? (
                  <Image
                    src={`${coverBaseUrl}/cover_${story.id}.jpg`}
                    alt={story.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    onError={() =>
                      setImageErrors((prev) => ({ ...prev, [story.id]: true }))
                    }
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-indigo-600/5 to-violet-600/10 flex flex-col items-center justify-center p-6 text-center">
                    <BookOpen className="w-16 h-16 mb-4 opacity-20 text-blue-500 flex-shrink-0" />
                    <Typography
                      variant="h4"
                      className="text-lg font-black tracking-tight leading-tight line-clamp-3 text-foreground/40"
                    >
                      {story.title}
                    </Typography>
                  </div>
                )}

                {/* Always-on Tags (Top) */}
                <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                  <div className="bg-black/60 backdrop-blur-md text-white/90 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-white/10 shadow-lg">
                    <List className="w-3 h-3 text-blue-400" />
                    {story.currentChapterCount} Ch.
                  </div>
                  {story.averageRating !== undefined &&
                    story.averageRating > 0 && (
                      <div className="bg-black/60 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-white/10 shadow-lg">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {story.averageRating.toFixed(1)}
                      </div>
                    )}
                </div>

                {/* Animated Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100 dark:from-black/95 dark:via-black/70" />

                <div className="absolute inset-x-0 bottom-0 p-5 translate-y-8 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out flex flex-col justify-end z-20 h-full">
                  <div className="mt-auto">
                    {story.synopsis ? (
                      <p className="text-white/80 text-sm line-clamp-4 mb-4 leading-relaxed font-medium drop-shadow-sm">
                        {story.synopsis}
                      </p>
                    ) : (
                      <p className="text-white/50 text-sm italic mb-4">
                        No synopsis available.
                      </p>
                    )}
                    <span className="inline-flex items-center gap-2 text-xs font-bold bg-white text-black px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-300">
                      Read Now <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Metadata Section (Always Visible) */}
              <div className="p-4 sm:p-5 flex flex-col flex-grow bg-gradient-to-b from-transparent to-background/50 z-10">
                <Typography
                  variant="h3"
                  className="text-base sm:text-lg font-bold tracking-tight line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300"
                >
                  {story.title}
                </Typography>

                <div className="flex items-center gap-2.5 mt-3 opacity-80 group-hover:opacity-100 transition-opacity">
                  <div className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                    <User className="w-3 h-3" />
                  </div>
                  <Typography
                    variant="p"
                    className="text-xs font-semibold truncate text-muted-foreground"
                  >
                    {story.authorName}
                  </Typography>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
