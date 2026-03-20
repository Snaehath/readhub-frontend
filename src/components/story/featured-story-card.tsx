"use client";

import { useState } from "react";
import { StorySummary, AllStoriesResponse } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Sparkles, ArrowRight, Layout } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/custom/typography";
import { API_BASE_URL } from "@/constants";
import Image from "next/image";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function FeaturedStorySection() {
  const [imageError, setImageError] = useState(false);
  const [retriedPng, setRetriedPng] = useState(false);

  const coverBaseUrl = API_BASE_URL.replace("/api", "") + "/covers";

  // 1. Fetch all stories to find a featured one
  const { data: allData, isLoading: allLoading } = useSWR<AllStoriesResponse>(
    `${API_BASE_URL}/story/allStories`,
    fetcher,
  );

  const stories = allData?.stories || [];
  const completedStories = stories.filter((s: StorySummary) => s.isCompleted);
  const targetStory =
    completedStories.length > 0 ? completedStories[0] : stories[1];
  const targetStoryId = targetStory?.id || targetStory?.index;

  // 2. Fetch full content for the identified featured story
  const { data: fullData, isLoading: fullLoading } = useSWR(
    targetStoryId ? `${API_BASE_URL}/story/${targetStoryId}` : null,
    fetcher,
  );

  const story = fullData?.story;
  const isLoading = allLoading || (targetStoryId && fullLoading);

  if (isLoading || !story) return null;

  return (
    <section className="mb-24 relative overflow-x-hidden">
      {/* AI Gradient Definition */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="ai-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
        </defs>
      </svg>

      <div className="flex items-center justify-between pb-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black mb-1">
            <Sparkles
              className="w-4 h-4"
              style={{
                stroke: "url(#ai-gradient)",
                fill: "url(#ai-gradient)",
                fillOpacity: 0.1,
              }}
            />
            AI Original
          </div>
          <Typography
            variant="h2"
            className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3"
          >
            ReadHub Stories
          </Typography>
        </div>
        <Button variant="ghost" asChild className="rounded-full font-bold h-10">
          <Link href="/library">
            View All Series <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </div>

      <Link href={`/story/${story.index || story.id}`} className="block group">
        <Card className="bg-background p-0">
          <div className="grid grid-cols-1 sm:grid-cols-12 min-h-[420px]">
            {/* Left Column: Artistic Cover */}
            <div className="sm:col-span-5 relative overflow-hidden flex items-center justify-center group/cover rounded-l-xl">
              {!imageError ? (
                <Image
                  src={
                    retriedPng
                      ? `${coverBaseUrl}/cover_${story.id}.png`
                      : story.coverImage ||
                        `${coverBaseUrl}/cover_${story.id}.jpg`
                  }
                  alt={story.title}
                  fill
                  className="object-cover rounded-l-xl"
                  onError={() => {
                    if (!retriedPng && !story.coverImage) setRetriedPng(true);
                    else setImageError(true);
                  }}
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 via-indigo-600/10 to-violet-600/20" />
              )}

              {/* High-quality overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent group-hover:from-black/95 transition-all duration-500" />

              <div className="relative z-10 p-12 text-center lg:text-left h-full flex flex-col justify-end w-full">
                <Badge
                  variant="outline"
                  className="w-fit mb-6 uppercase text-[10px] tracking-[0.2em] font-black border-2 bg-white/10 backdrop-blur-md text-white border-white/20 mx-auto lg:mx-0"
                >
                  {story.isCompleted ? "Completed" : "Active"}
                </Badge>
                <Typography
                  variant="h1"
                  className="mb-4 text-white drop-shadow-2xl leading-[0.9]"
                >
                  {story.title}
                </Typography>
                <div className="flex items-center justify-center sm:justify-start opacity-90">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-blue-300">
                    <Sparkles
                      className="w-4 h-4"
                      style={{
                        stroke: "url(#ai-gradient)",
                        fill: "url(#ai-gradient)",
                        fillOpacity: 0.1,
                      }}
                    />
                  </div>
                  <Typography className="text-sm tracking-widest font-bold">
                    {story.authorName}
                  </Typography>
                </div>
              </div>
            </div>

            {/* Right Column: Narrative Details */}
            <div className="lg:col-span-7 p-8 sm:p-14 flex flex-col justify-center gap-10 bg-linear-to-br from-transparent to-zinc-50/50 dark:to-zinc-900/50">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-4">
                  <Badge
                    variant="secondary"
                    className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest"
                  >
                    <Layout className="w-3 h-3 mr-2" />
                    {story.genre}
                  </Badge>
                </div>

                <div className="relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-500 rounded-full" />
                  <Typography
                    variant="h4"
                    className="text-2xl sm:text-3xl font-black italic tracking-tight leading-tight text-foreground/90 pl-4"
                  >
                    &ldquo;{story.subject}&rdquo;
                  </Typography>
                </div>

                <Typography
                  variant="muted"
                  className="leading-relaxed font-medium line-clamp-4"
                >
                  {story.synopsis ||
                    story.chapters?.[story.chapters.length - 1]?.content ||
                    "An epic narrative journey forged by advanced AI agents, exploring original worlds and complex characters."}
                </Typography>
              </div>

              <div className="flex flex-col sm:flex-row items-end justify-between gap-8 pt-8 border-t border-zinc-200/50 dark:border-zinc-800/50">
                <div className="flex flex-wrap items-center gap-10">
                  <div className="flex flex-col gap-2">
                    <Typography
                      variant="muted"
                      className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80"
                    >
                      Status
                    </Typography>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full animate-pulse ${story.isCompleted ? "bg-emerald-500" : "bg-blue-500"}`}
                      />
                      <Typography
                        className={`text-xs font-black uppercase tracking-widest leading-none ${story.isCompleted ? "text-emerald-500" : "text-blue-500"}`}
                      >
                        {story.isCompleted ? "Completed" : "Ongoing"}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Typography
                      variant="muted"
                      className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80"
                    >
                      Read Time
                    </Typography>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                      <Typography className="text-xs font-black uppercase tracking-widest leading-none">
                        {Math.ceil((story.chapters?.length || 1) * 8)} min read
                      </Typography>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <Button
                    variant="pureGhost"
                    className="rounded-full font-black cursor-pointer"
                  >
                    Read Now
                    <ArrowRight className="w-3.5 h-3.5 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </section>
  );
}
