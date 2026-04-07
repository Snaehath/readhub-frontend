/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { StorySummary, AllStoriesResponse } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/custom/typography";
import { API_BASE_URL } from "@/constants";
import { getCoverBaseUrl } from "@/lib/utils";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const FeaturedStorySection = () => {
  const [imageError, setImageError] = useState(false);
  const [retriedPng, setRetriedPng] = useState(false);

  const coverBaseUrl = getCoverBaseUrl();

  // 1. Fetch all stories to find a featured one
  const { data: allData, isLoading: allLoading } = useSWR<AllStoriesResponse>(
    `${API_BASE_URL}/ai-hub/story/allStories`,
    fetcher,
  );

  const stories = allData?.stories || [];
  const completedStories = stories.filter((s: StorySummary) => s.isCompleted);
  const targetStory =
    completedStories.length > 0 ? completedStories[0] : stories[1];
  const targetStoryId = targetStory?.id || targetStory?.index;

  // 2. Fetch full content for the identified featured story
  const { data: fullData, isLoading: fullLoading } = useSWR(
    targetStoryId ? `${API_BASE_URL}/ai-hub/story/${targetStoryId}` : null,
    fetcher,
  );

  const story = fullData?.story;
  const isLoading = allLoading || (targetStoryId && fullLoading);

  if (isLoading || !story) return null;

  return (
    <section className="mb-32">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Hook */}
        <div className="flex items-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900">
            <Sparkles className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              ReadHub AI Original
            </span>
          </div>
          <div className="h-[1px] flex-1 bg-linear-to-r from-zinc-200 dark:from-zinc-800 to-transparent" />
        </div>

        <Link
          href={`/ai-hub/story/${story.index || story.id}`}
          className="block group"
        >
          <Card className="bg-background p-0 overflow-hidden border-2 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-fit lg:min-h-[600px]">
              {/* Left Column: Pure Artistic Cover */}
              <div className="lg:col-span-5 relative overflow-hidden bg-zinc-100 dark:bg-zinc-900 min-h-[400px] lg:min-h-full">
                {!imageError ? (
                  <img
                    src={
                      retriedPng
                        ? `${coverBaseUrl}/cover_${story.id}.png`
                        : story.coverImage ||
                          `${coverBaseUrl}/cover_${story.id}.jpg`
                    }
                    alt={story.title}
                    className="absolute inset-0 object-cover w-full h-full"
                    onError={() => {
                      if (!retriedPng && !story.coverImage) setRetriedPng(true);
                      else setImageError(true);
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src="/story_placeholder.png"
                      alt="Placeholder"
                      className="object-cover w-full h-full opacity-30"
                    />
                  </div>
                )}
                {/* Subtle vignette for depth */}
                <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Right Column: Editorial Intelligence */}
              <div className="lg:col-span-7 p-8 sm:p-16 flex flex-col justify-between bg-white dark:bg-zinc-950">
                <div className="space-y-10">
                  {/* Metadata Row */}
                  <div className="flex flex-wrap items-center gap-4">
                    <Badge
                      variant="outline"
                      className="rounded-full px-4 py-1 border-2 font-black text-[10px] uppercase tracking-widest"
                    >
                      Series 01
                    </Badge>
                    <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <Typography className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      By {story.authorName}
                    </Typography>
                  </div>

                  {/* Headline & Subject */}
                  <div className="space-y-6">
                    <Typography
                      variant="h1"
                      className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-none"
                    >
                      {story.title}
                    </Typography>

                    <div className="relative pl-6">
                      <div className="absolute left-0 top-1 bottom-1 w-1 bg-zinc-900 dark:bg-white rounded-full" />
                      <Typography
                        variant="h3"
                        className="text-xl sm:text-2xl font-black italic tracking-tight leading-tight opacity-80"
                      >
                        &ldquo;{story.subject}&rdquo;
                      </Typography>
                    </div>
                  </div>

                  {/* Narrative Body */}
                  <Typography
                    variant="muted"
                    className="text-sm sm:text-base leading-relaxed font-medium line-clamp-5 text-zinc-600 dark:text-zinc-400 max-w-2xl"
                  >
                    {story.synopsis ||
                      story.chapters?.[story.chapters.length - 1]?.content ||
                      "An epic narrative journey forged by advanced AI agents, exploring original worlds and complex characters."}
                  </Typography>
                </div>

                {/* Footer Logistics */}
                <div className="pt-12 sm:pt-16 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-12">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                        Status
                      </span>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${story.isCompleted ? "bg-emerald-500" : "bg-blue-500"} animate-pulse`}
                        />
                        <span className="text-xs font-black uppercase tracking-widest">
                          {story.isCompleted ? "Completed" : "Ongoing"}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                        Duration
                      </span>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-3 h-3" />
                        <span className="text-xs font-black uppercase tracking-widest">
                          {Math.ceil((story.chapters?.length || 1) * 8)} MIN
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full sm:w-auto rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black uppercase tracking-widest text-xs shadow-xl shadow-zinc-500/10 dark:shadow-none">
                    Read
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </section>
  );
};

export default FeaturedStorySection;
