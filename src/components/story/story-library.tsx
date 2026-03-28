"use client";

import { useState } from "react";
import { AllStoriesResponse } from "@/types";
import { BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";
import Typography from "@/components/ui/custom/typography";
import Image from "next/image";
import { StoriesSkeleton } from "@/components/misc/skeletons";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const StoryLibrary = () => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [retriedPng, setRetriedPng] = useState<Record<string, boolean>>({});

  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://readhub-backend.onrender.com/api";
  const coverBaseUrl = baseUrl.replace("/api", "") + "/covers";

  const { data, isLoading } = useSWR<AllStoriesResponse>(
    `${baseUrl}/ai-hub/story/allStories`,
    fetcher,
  );

  if (isLoading) {
    return <StoriesSkeleton />;
  }

  const stories = data?.stories || [];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex items-center gap-6">
        <Typography
          variant="muted"
          className="text-xs font-black uppercase tracking-[0.3em] whitespace-nowrap text-blue-600"
        >
          Story Archive
        </Typography>
        <div className="h-px w-full bg-blue-500/10" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
        {stories.map((story) => (
          <Link
            key={story.id}
            href={`/ai-hub/story/${story.index || story.id}`}
            className="group block relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-500 group-hover:shadow-[0_40px_80px_-15px_rgba(37,99,235,0.15)] group-hover:-translate-y-2 group-hover:scale-[1.02]">
              {/* Image with fallback */}
              {!imageErrors[story.id] ? (
                <Image
                  src={
                    retriedPng[story.id]
                      ? `${coverBaseUrl}/cover_${story.id}.png`
                      : story.coverImage ||
                        `${coverBaseUrl}/cover_${story.id}.jpg`
                  }
                  alt={story.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={() => {
                    if (!retriedPng[story.id] && !story.coverImage) {
                      setRetriedPng((prev) => ({ ...prev, [story.id]: true }));
                    } else {
                      setImageErrors((prev) => ({
                        ...prev,
                        [story.id]: true,
                      }));
                    }
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 to-indigo-600/10 flex items-center justify-center p-12">
                  <BookOpen className="w-12 h-12 text-blue-200" />
                </div>
              )}

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

              {/* Content Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-8 space-y-4">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="text-[9px] font-black uppercase tracking-widest bg-blue-600 text-white px-3 py-1 rounded-full shadow-lg shadow-blue-500/20">
                    {story.genre}
                  </span>
                  {story.isCompleted ? (
                    <span className="text-[9px] font-black uppercase tracking-widest bg-emerald-500/90 text-white px-3 py-1 rounded-full">
                      Full Arc
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                      Ongoing
                    </span>
                  )}
                </div>

                <Typography
                  variant="h3"
                  className="text-white text-xl font-black leading-tight group-hover:text-blue-200 transition-colors duration-300"
                >
                  {story.title}
                </Typography>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[10px] font-black text-white uppercase">
                      {story.authorName.charAt(0)}
                    </div>
                    <Typography className="text-[10px] text-white/70 font-black uppercase tracking-widest truncate max-w-[100px]">
                      {story.authorName}
                    </Typography>
                  </div>

                  <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                    <Typography className="text-[10px] text-white font-black uppercase tracking-widest">
                      Explore
                    </Typography>
                    <ArrowRight className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StoryLibrary;
