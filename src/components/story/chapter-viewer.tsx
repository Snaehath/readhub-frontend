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
import Link from "next/link";

interface ChapterViewerProps {
  index: string;
  chapterNumber: number;
}

const ChapterViewer = ({
  index,
  chapterNumber,
}: ChapterViewerProps) => {
  const router = useRouter();
  const [story, setStory] = useState<AIStory | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/ai-hub/story/${index}`,
        );
        const data: StoryResponse = await res.json();
        setStory(data.story);
      } catch (error) {
        console.error("Failed to fetch story:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStory();
  }, [index]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Sparkles className="w-10 h-10 text-primary animate-pulse" />
        <Typography variant="muted" className="animate-pulse">
          Decrypting Narrative Nodes...
        </Typography>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <Typography variant="h2" className="text-2xl font-bold mb-4">
          Story Not Found
        </Typography>
        <p className="text-muted-foreground mb-8">
          The story you are looking for does not exist in our archive.
        </p>
        <Button asChild className="rounded-full px-8">
          <Link href="/ai-hub">Back to AI Serial</Link>
        </Button>
      </div>
    );
  }

  const selectedChapter = story.chapters?.find(
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
          <Link href={`/ai-hub/story/${index}`}>Back to Story Overview</Link>
        </Button>
      </div>
    );
  }

  const totalChapters = story.chapters?.length || 0;
  const hasNext = chapterNumber < totalChapters;
  const hasPrev = chapterNumber > 1;

  const navigateToChapter = (num: number) => {
    router.push(`/ai-hub/story/${index}/chapter/${num}`);
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
            <Link href={`/ai-hub/story/${index}`}>
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

      {/* Chapter Content */}
      <main className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        <header className="mb-12 text-center">
          <Typography
            variant="muted"
            className="text-[10px] uppercase font-black tracking-[0.3em] text-blue-600 mb-4 block"
          >
            {story.title}
          </Typography>
          <Typography variant="h1" className="text-4xl font-black leading-tight">
            {selectedChapter.title}
          </Typography>
        </header>

        <article className="prose prose-slate dark:prose-invert max-w-none">
          <div className="text-muted-foreground leading-relaxed space-y-6 text-lg font-medium">
            {selectedChapter.content.split("\n\n").map((para, i) => (
              <p key={i} className="mb-6 indent-0 first-letter:text-2xl first-letter:font-bold first-letter:text-primary first-letter:mr-1">
                {para}
              </p>
            ))}
          </div>
        </article>

        {/* Footer Navigation */}
        <div className="mt-20 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigateToChapter(chapterNumber - 1)}
              disabled={!hasPrev}
              className="rounded-full px-6 font-bold"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => navigateToChapter(chapterNumber + 1)}
              disabled={!hasNext}
              className="rounded-full px-6 font-bold"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <Button
            variant="ghost"
            asChild
            className="hidden sm:flex font-bold text-muted-foreground hover:text-foreground hover:bg-zinc-100 rounded-full px-6"
          >
            <Link href={`/ai-hub/story/${index}`}>
              <BookOpen className="w-4 h-4 mr-2" />
              Index
            </Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default ChapterViewer;
