"use client";

import { useEffect, useState } from "react";
import { AIStory } from "@/types";
import {
  User,
  Tag,
  Lightbulb,
  Lock,
  BookOpen,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/custom/typography";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StoryPage() {
  const [story, setStory] = useState<AIStory | null | "unauthorized">(null);
  const [loading, setLoading] = useState(true);
  const [selectedChapter, setSelectedChapter] = useState<{
    chapterNumber: number;
    title: string;
    content: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const token = localStorage.getItem("jwt");
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://readhub-backend.onrender.com/api";

        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(`${baseUrl}/story/myStory`, {
          headers,
          cache: "no-store",
        });

        if (!res.ok) {
          if (res.status === 401) {
            setStory("unauthorized");
          } else {
            console.error("Story fetch failed:", res.status);
            setStory(null);
          }
        } else {
          const data = await res.json();
          setStory(data.story);
        }
      } catch (error) {
        console.error("Error fetching story:", error);
        setStory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-pulse" />
        </div>
        <Typography
          variant="p"
          className="text-muted-foreground animate-pulse font-medium"
        >
          Our AI agent is retrieving your masterpiece...
        </Typography>
      </div>
    );
  }

  if (story === "unauthorized") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="bg-blue-50 dark:bg-blue-950/30 p-8 rounded-full mb-6 relative group">
          <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full group-hover:bg-blue-500/30 transition-all opacity-0 group-hover:opacity-100" />
          <Lock className="w-12 h-12 text-blue-600 dark:text-blue-400 relative z-10" />
        </div>
        <Typography variant="h1" className="text-3xl font-bold mb-4">
          Exclusive Content
        </Typography>
        <Typography
          variant="p"
          className="text-muted-foreground max-w-md mb-8 leading-relaxed"
        >
          Sign in to your ReadHub account to unlock your story module. Witness
          our advanced AI agent craft unique, imaginative narratives every
          single day!
        </Typography>
        <Button
          asChild
          className="rounded-full px-8 py-6 h-auto text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <Link href="/login">Login to Start Reading</Link>
        </Button>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="bg-amber-50 dark:bg-amber-950/20 p-6 rounded-full mb-6 italic text-amber-600 font-serif text-4xl">
          ?
        </div>
        <Typography
          variant="h1"
          className="text-2xl font-bold text-muted-foreground"
        >
          Story not found
        </Typography>
        <Typography variant="p" className="text-muted-foreground mt-2">
          Our AI agent is currently between chapters. Please check back later.
        </Typography>
      </div>
    );
  }

  if (selectedChapter) {
    return (
      <div className="min-h-screen bg-background animate-in fade-in duration-500">
        {/* Reader Header */}
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedChapter(null)}
              className="gap-2 font-bold text-muted-foreground hover:text-blue-600"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Chapters
            </Button>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="hidden sm:flex font-black text-[10px] uppercase tracking-widest bg-blue-50 text-blue-600 border-blue-100"
              >
                Chapter 0{selectedChapter.chapterNumber}
              </Badge>
              <Typography
                variant="small"
                className="text-xs font-black text-muted-foreground uppercase tracking-widest"
              >
                ReadHub Original
              </Typography>
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
              <Typography variant="small">By {story.authorName}</Typography>
            </div>
          </header>

          <div className="prose dark:prose-invert max-w-none">
            <div className="text-xl leading-[1.8] text-foreground/90 space-y-8 first-letter:text-7xl first-letter:font-black first-letter:mr-4 first-letter:float-left first-letter:leading-[1] first-letter:text-blue-600 font-serif">
              {selectedChapter.content.split("\n\n").map((para, i) => (
                <p key={i} className="mb-8">
                  {para}
                </p>
              ))}
            </div>
          </div>

          <footer className="mt-24 pt-12 border-t flex flex-col items-center gap-8">
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
              <Sparkles
                className="w-5 h-5"
                style={{
                  stroke: "url(#ai-story-gradient)",
                  fill: "url(#ai-story-gradient)",
                  fillOpacity: 0.2,
                }}
              />
              <span>
                This chapter was crafted independently by our AI Agent.
              </span>
            </div>
            <Button
              onClick={() => setSelectedChapter(null)}
              className="rounded-full px-12 py-6 h-auto text-lg font-black bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
            >
              Finish Reading
            </Button>
          </footer>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
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
      {/* Header Section */}
      <div className="relative mb-16 text-center animate-in fade-in slide-in-from-top-8 duration-700">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" />
        <Badge
          variant="outline"
          className="mb-4 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-600 px-4 py-1"
        >
          <Sparkles
            className="w-3 h-3 mr-2 inline"
            style={{
              stroke: "url(#ai-story-gradient)",
              fill: "url(#ai-story-gradient)",
              fillOpacity: 0.2,
            }}
          />{" "}
          AI Generated Original
        </Badge>
        <Typography variant="h1" className="mb-6">
          {story.title}
        </Typography>
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-medium">
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-background shadow-sm border"
          >
            <User className="w-3.5 h-3.5 text-blue-500" />
            {story.authorName}
          </Badge>
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-background shadow-sm border"
          >
            <Tag className="w-3.5 h-3.5 text-indigo-500" />
            {story.genre}
          </Badge>
          <Badge
            variant="secondary"
            className="flex items-center gap-1.5 px-4 py-1.5 bg-background shadow-sm border"
          >
            <BookOpen className="w-3.5 h-3.5 text-violet-500" />
            {story.currentChapterCount} / {story.tableOfContents?.length || 9}{" "}
            Chapters
          </Badge>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none bg-background/60 backdrop-blur-xl shadow-2xl shadow-blue-500/5 overflow-hidden">
            <div className="h-2 bg-linear-to-r from-blue-500 to-indigo-500" />
            <CardHeader className="pb-3">
              <Typography
                variant="h4"
                className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2"
              >
                <Lightbulb className="w-4 h-4 text-amber-500" />
                The Premise
              </Typography>
            </CardHeader>
            <CardContent>
              <Typography
                variant="p"
                className="text-sm leading-relaxed text-foreground/80 font-medium italic"
              >
                &quot;{story.subject}&quot;
              </Typography>
            </CardContent>
          </Card>

          <Card className="border-none bg-background/60 backdrop-blur-xl shadow-2xl shadow-violet-500/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-violet-500" />
                Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">
                  Progress
                </span>
                <span className="font-bold text-blue-600">
                  {Math.round(
                    (story.currentChapterCount /
                      (story.tableOfContents?.length || 9)) *
                      100,
                  )}
                  %
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-blue-500 to-violet-500 transition-all duration-1000"
                  style={{
                    width: `${(story.currentChapterCount / (story.tableOfContents?.length || 9)) * 100}%`,
                  }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground italic leading-tight">
                Our AI crafts a new chapter every 24 hours to unfold this
                narrative.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Chapter Grid */}
        <div className="lg:col-span-3">
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {story.chapters
                ?.slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage,
                )
                .map((chapter) => (
                  <Card
                    key={chapter.chapterNumber}
                    className="group overflow-hidden border-none shadow-xl cursor-pointer flex flex-col bg-background/40 backdrop-blur-sm transition-all hover:bg-background/60"
                    onClick={() => setSelectedChapter(chapter)}
                  >
                    {/* Stylized Title Block (Replaces Image) */}
                    <div className="h-48 relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center p-6 text-center">
                      <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 via-transparent to-violet-600/10 opacity-50" />
                      <div className="absolute top-4 left-4 text-4xl font-black text-blue-500/40">
                        0{chapter.chapterNumber}
                      </div>
                      <h3 className="relative z-10 text-xl font-black tracking-tight leading-tight bg-linear-to-br from-foreground to-foreground/60 bg-clip-text">
                        {chapter.title}
                      </h3>
                    </div>

                    <CardHeader className="p-4 pt-4">
                      <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">
                        Entry {chapter.chapterNumber}
                      </div>
                      <CardTitle className="text-sm font-bold line-clamp-1">
                        {story.title}: Part {chapter.chapterNumber}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-4 pt-0 pb-6 flex-1">
                      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed italic">
                        {chapter.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Pagination Controls */}
            {story.chapters && story.chapters.length > itemsPerPage && (
              <div className="flex items-center justify-center gap-4 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-full px-4 font-bold border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <div className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                  Page {currentPage} of{" "}
                  {Math.ceil(story.chapters.length / itemsPerPage)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        Math.ceil(story.chapters.length / itemsPerPage),
                        prev + 1,
                      ),
                    )
                  }
                  disabled={
                    currentPage ===
                    Math.ceil(story.chapters.length / itemsPerPage)
                  }
                  className="rounded-full px-4 font-bold border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-30"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
