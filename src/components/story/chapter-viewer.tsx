"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AIStory, StoryResponse } from "@/types";
import {
  Sparkles,
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/custom/typography";
import { Badge } from "@/components/ui/badge";
import StoryReview from "@/components/story/story-review";
import Link from "next/link";

interface ChapterViewerProps {
  index: string;
  chapterNumber: number;
}

export default function ChapterViewer({
  index,
  chapterNumber,
}: ChapterViewerProps) {
  const router = useRouter();

  const [story, setStory] = useState<AIStory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://readhub-backend.onrender.com/api";

        const res = await fetch(`${baseUrl}/story/${index}`, {
          cache: "no-store",
        });

        if (res.ok) {
          const data: StoryResponse = await res.json();
          setStory(data.story || null);
        }
      } catch (error) {
        console.error("Error fetching story from archive:", error);
      } finally {
        setLoading(false);
      }
    };

    if (index) fetchStory();
  }, [index]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-pulse" />
        </div>
        <p className="text-muted-foreground animate-pulse font-medium">
          Loading chapter...
        </p>
      </div>
    );
  }

  if (!story || !story.chapters) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <Typography variant="h2" className="text-2xl font-bold mb-4">
          Story Not Found
        </Typography>
        <p className="text-muted-foreground mb-8">
          The story you are looking for does not exist in our archive.
        </p>
        <Button asChild className="rounded-full px-8">
          <Link href="/story">Back to AI Serial</Link>
        </Button>
      </div>
    );
  }

  const selectedChapter = story.chapters.find(
    (c) => c.chapterNumber === chapterNumber,
  );

  if (!selectedChapter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <Typography variant="h2" className="text-2xl font-bold mb-4">
          Chapter Not Found
        </Typography>
        <p className="text-muted-foreground mb-8">
          The chapter you requested has not been generated yet.
        </p>
        <Button asChild className="rounded-full px-8">
          <Link href={`/story/${index}`}>Back to Story Overview</Link>
        </Button>
      </div>
    );
  }

  const totalChapters = story.chapters.length;
  const hasNext = chapterNumber < totalChapters;
  const hasPrev = chapterNumber > 1;

  const navigateToChapter = (num: number) => {
    router.push(`/story/${index}/chapter/${num}`);
  };

  return (
    <div className="min-h-screen bg-background animate-in fade-in duration-500 pb-20">
      {/* Reader Header */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-2 font-bold text-muted-foreground hover:text-muted-foreground/80"
          >
            <Link href={`/story/${index}`}>
              <ArrowLeft className="w-4 h-4" /> Back to Overview
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <Badge
              variant="outline"
              className="flex font-black text-[10px] uppercase tracking-widest bg-blue-50 text-blue-600 border-blue-100"
            >
              Chapter 0{selectedChapter.chapterNumber}
            </Badge>
          </div>
        </div>
      </div>

      {/* Reader Content */}
      <article className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <header className="mb-12 text-center">
          <Typography
            variant="small"
            className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block"
          >
            Part 0{selectedChapter.chapterNumber}
          </Typography>
          <Typography
            variant="h1"
            className="text-4xl sm:text-6xl font-black tracking-tighter mb-6 leading-tight"
          >
            {selectedChapter.title}
          </Typography>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground font-medium italic">
            <Typography variant="small">{story.title}</Typography>
            <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <Typography className="text-blue-600" variant="small">
              By {story.authorName}
            </Typography>
          </div>
        </header>

        <div className="prose dark:prose-invert max-w-none">
          <div className="text-xl leading-[1.8] text-foreground/90 space-y-8 first-letter:text-7xl first-letter:font-black first-letter:mr-4 first-letter:float-left first-letter:leading-[1] font-serif">
            {selectedChapter.content.split("\n\n").map((para, i) => (
              <p key={i} className="mb-8">
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="mt-16 flex items-center justify-between pt-8 border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateToChapter(chapterNumber - 1)}
            disabled={!hasPrev}
            className="rounded-full px-4 font-bold border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-30 gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden sm:flex font-bold text-muted-foreground hover:text-foreground hover:bg-zinc-100 rounded-full px-6"
          >
            <Link href={`/story/${index}`}>
              <BookOpen className="w-4 h-4 mr-2" />
              Index
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateToChapter(chapterNumber + 1)}
            disabled={!hasNext}
            className="rounded-full px-4 font-bold border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-30 gap-1"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <footer className="mt-16 pt-12 border-t flex flex-col items-center gap-8">
          {/* AI Gradient Definition */}
          <svg width="0" height="0" className="absolute">
            <defs>
              <linearGradient
                id="ai-story-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="50%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#db2777" />
              </linearGradient>
            </defs>
          </svg>
          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
            <Sparkles
              className="w-5 h-5"
              style={{
                stroke: "url(#ai-story-gradient)",
                fill: "url(#ai-story-gradient)",
                fillOpacity: 0.2,
              }}
            />
            <Typography variant="p">
              This chapter was crafted independently by our AI Agent.
            </Typography>
          </div>

          <div className="w-full max-w-md mx-auto mt-12">
            <StoryReview
              storyId={story.id || story.index}
              onSuccess={(updatedStory) => setStory(updatedStory)}
            />
          </div>
        </footer>
      </article>
    </div>
  );
}
