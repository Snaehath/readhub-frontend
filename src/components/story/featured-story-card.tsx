"use client";

import { useState } from "react";
import { StorySummary, AllStoriesResponse } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/custom/typography";
import { API_BASE_URL } from "@/constants";
import Image from "next/image";

import useSWR from "swr";

export default function FeaturedStorySection() {
  const [imageError, setImageError] = useState(false);

  const coverBaseUrl = API_BASE_URL.replace("/api", "") + "/covers";

  // 1. Fetch all stories to find a featured one
  const { data: allData, isLoading: allLoading } = useSWR<AllStoriesResponse>(
    `${API_BASE_URL}/story/allStories`,
  );

  const stories = allData?.stories || [];
  const completedStories = stories.filter((s: StorySummary) => s.isCompleted);
  const targetStory =
    completedStories.length > 0 ? completedStories[0] : stories[0];
  const targetStoryId = targetStory?.id || targetStory?.index;

  // 2. Fetch full content for the identified featured story
  const { data: fullData, isLoading: fullLoading } = useSWR(
    targetStoryId ? `${API_BASE_URL}/story/${targetStoryId}` : null,
  );

  const story = fullData?.story;
  const isLoading = allLoading || (targetStoryId && fullLoading);

  if (isLoading || !story) return null;

  return (
    <section className="mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
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
      <div className="flex items-center mb-6">
        <Typography
          variant="h2"
          className="text-xl font-bold tracking-tight flex items-center gap-2"
        >
          AI Serial{" "}
          <Sparkles
            className="w-5 h-5"
            style={{
              stroke: "url(#ai-gradient)",
              fill: "url(#ai-gradient)",
              fillOpacity: 0.1,
            }}
          />
        </Typography>
      </div>

      <Link href={`/story/${story.index}`} className="block group">
        <Card className="overflow-hidden border shadow-sm transition-colors hover:bg-muted/50">
          <div className="grid sm:grid-cols-5">
            <div className="sm:col-span-2 relative h-56 sm:h-auto overflow-hidden border-r bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center p-8">
              {!imageError ? (
                <Image
                  src={`${coverBaseUrl}/cover_${story.id}.jpg`}
                  alt={story.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-110 duration-700"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="absolute inset-0 bg-linear-to-br from-blue-600/15 via-indigo-600/5 to-violet-600/15" />
              )}

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/90 transition-colors" />

              <div className="relative z-10 text-center w-full px-4">
                <Badge
                  variant="outline"
                  className={`mb-3 uppercase text-[10px] tracking-[0.2em] font-black border-2 bg-background/20 backdrop-blur-md text-white ${
                    story.isCompleted
                      ? "border-emerald-500/50"
                      : "border-white/20"
                  }`}
                >
                  {story.isCompleted ? "Completed Series" : "Original Series"}
                </Badge>
                <Typography
                  variant="h3"
                  className="text-2xl sm:text-3xl font-black tracking-tight leading-tight mb-2 text-white drop-shadow-lg"
                >
                  {story.title}
                </Typography>
                <Typography
                  variant="small"
                  className="font-black tracking-widest uppercase text-[10px] text-blue-200 drop-shadow-md"
                >
                  By {story.authorName}
                </Typography>
              </div>
            </div>

            {/* Content Preview */}
            <div className="sm:col-span-3 p-6 flex flex-col justify-center">
              <CardHeader className="p-0 mb-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <div
                    className={`w-1.5 h-1.5 rounded-full animate-pulse ${story.isCompleted ? "bg-emerald-500" : "bg-primary"}`}
                  />
                  <Typography
                    variant="small"
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    {story.isCompleted
                      ? `Complete Collection (${story.currentChapterCount} Chapters)`
                      : `Chapter ${story.currentChapterCount} • Ongoing`}
                  </Typography>
                </div>
                <Typography
                  variant="h4"
                  className="text-lg font-bold italic leading-tight text-foreground/90"
                >
                  &quot;{story.subject}&quot;
                </Typography>
              </CardHeader>

              <CardContent className="p-0 mb-4">
                <Typography
                  variant="p"
                  className="text-sm text-muted-foreground leading-relaxed line-clamp-2 font-medium"
                >
                  {story.chapters?.[story.chapters.length - 1]?.content ||
                    "Your narrative journey is unfolding. New chapters are crafted daily by our AI agent."}
                </Typography>
              </CardContent>

              <CardFooter className="p-0">
                <Button size="sm" className="rounded-md font-bold">
                  Keep Reading
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>
      </Link>
    </section>
  );
}
