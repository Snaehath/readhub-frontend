/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { AllStoriesResponse } from "@/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Typography from "@/components/ui/custom/typography";
import { StoriesSkeleton } from "@/components/misc/skeletons";

import { API_BASE_URL } from "@/constants";
import { getCoverBaseUrl, getImageUrl } from "@/lib/utils";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const StoryLibrary = () => {
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [retriedPng, setRetriedPng] = useState<Record<string, boolean>>({});

  const coverBaseUrl = getCoverBaseUrl();

  const { data, isLoading } = useSWR<AllStoriesResponse>(
    `${API_BASE_URL}/ai-hub/story/allStories`,
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
          Story Chronicles
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
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 transition-[box-shadow] duration-500 group-hover:shadow-[0_40px_80px_-15px_rgba(37,99,235,0.15)]">
              {/* Image with fallback */}
              {!imageErrors[story.id] ? (
                <img
                  src={
                    retriedPng[story.id]
                      ? `${coverBaseUrl}/cover_${story.id}.png`
                      : getImageUrl(story.coverImage) ||
                        `${coverBaseUrl}/cover_${story.id}.jpg`
                  }
                  alt={story.title}
                  className="object-cover w-full h-full transition-transform duration-700"
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
                <div className="absolute inset-0 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
                  <img
                    src="/story_placeholder.png"
                    alt="Placeholder"
                    className="object-cover w-full h-full opacity-50 contrast-75"
                  />
                </div>
              )}

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

              {/* Content Overlay */}
              <div className="absolute inset-x-0 bottom-0 p-8 space-y-4">
                <Typography
                  variant="h3"
                  className="text-white text-xl font-black leading-tight group-hover:text-blue-200 transition-colors duration-300"
                >
                  {story.title}
                </Typography>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[10px] font-black text-white uppercase group-hover:border-blue-500/50 transition-colors">
                      {story.authorName.charAt(0)}
                    </div>
                    <Typography className="text-[10px] text-white/70 font-black uppercase tracking-widest group-hover:text-white transition-colors">
                      {story.authorName}
                    </Typography>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
                    <Typography className="text-[10px] text-white font-black uppercase tracking-widest">
                      Explore
                    </Typography>
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </div>
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
