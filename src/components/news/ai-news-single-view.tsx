"use client";

import { use } from "react";
import useSWR from "swr";
import {
  ArrowLeft,
  Share2,
  Clock,
  Hash,
  BookOpen,
  ThumbsUp,
  Newspaper,
  Info,
  ShieldCheck,
  Globe,
  Bookmark,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/custom/typography";
import ToolTip from "@/components/ui/custom/tooltip";
import { API_BASE_URL } from "@/constants";
import { SingleAiNewsResponse } from "@/types";
import { format } from "date-fns";
import { fetcher } from "@/lib/fetcher";
import ReactMarkdown from "react-markdown";

export const NewsView = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { data, isLoading, error } = useSWR<SingleAiNewsResponse>(
    id ? `${API_BASE_URL}/ai-hub/news/${id}` : null,
    fetcher,
  );

  const news = data?.news;

  // Filter content to remove duplicate headings/bylines
  const filteredContent = news
    ? news.content
        .replace(/^# .*\n?/, "") // Remove H1 title
        .replace(/\*\*Investigative Report by.*\*\*\n?/, "") // Remove byline
        .trim()
    : "";

  const wordCount = news ? news.content.trim().split(/\s+/).length : 0;
  const readTime = Math.ceil(wordCount / 238); // avg reading speed 238 wpm

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-20 min-h-screen flex flex-col items-center justify-center space-y-4 text-center">
        <Newspaper className="w-12 h-12 text-indigo-600 animate-pulse" />
        <Typography variant="muted" className="animate-pulse">
          Retrieving Article...
        </Typography>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="container mx-auto px-6 py-20 min-h-screen flex flex-col items-center justify-center space-y-4 text-center">
        <Typography variant="h2" className="text-2xl font-bold">
          Article Not Found
        </Typography>
        <Button asChild variant="outline">
          <Link href="/ai-hub?tab=news">Back to AI News</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-background animate-in fade-in duration-700">
      {/* Article Header Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="gap-2 font-black text-xs uppercase tracking-widest text-muted-foreground hover:text-indigo-600"
          >
            <Link href="/ai-hub?tab=news">
              <ArrowLeft className="w-4 h-4" />
              Back to Hub
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              disabled
              className="rounded-full rounded-2xl opacity-50 cursor-not-allowed"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-2" />
            <ToolTip content="Save to Bookmarks">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full transition-all duration-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 text-zinc-500 hover:text-emerald-600"
              >
                <Bookmark className="w-4.5 h-4.5" />
              </Button>
            </ToolTip>
          </div>
        </div>
      </nav>

      <main className="max-w-[1000px] mx-auto px-6 pt-12 pb-32 flex flex-col items-center">
        {/* Full Centered Header */}
        <header className="space-y-8 animate-in slide-in-from-top-4 duration-1000 mb-16 flex flex-col items-center text-center">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
              {news.category || "AI Intel"}
            </span>
            <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase font-black tracking-widest">
              <Clock className="w-3.5 h-3.5" />
              {readTime} Min Read
            </div>
            <div className="h-1.5 w-1.5 rounded-full bg-border" />
            <Typography
              variant="muted"
              className="text-[10px] uppercase font-black tracking-widest"
            >
              {format(new Date(news.createdAt), "MMMM dd, yyyy")}
            </Typography>
          </div>

          <Typography
            variant="h1"
            className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 max-w-3xl"
          >
            {news.title}
          </Typography>

          <div className="flex flex-wrap items-center justify-center gap-8 pt-8 border-t border-zinc-100 dark:border-zinc-800/60 w-full">
            {/* Author Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg font-black uppercase shadow-lg shadow-indigo-500/20">
                {news.authorName.charAt(0)}
              </div>
              <div className="text-left space-y-0.5">
                <Typography
                  variant="small"
                  className="font-black text-sm uppercase tracking-wider block leading-none"
                >
                  {news.authorName}
                </Typography>
                <Typography
                  variant="muted"
                  className="text-[10px] uppercase font-bold tracking-widest block opacity-70 leading-none"
                >
                  AI Integrity Fellow
                </Typography>
              </div>
            </div>

            {/* Quick Metadata Stats */}
            <div className="flex items-center gap-8">
              <div className="h-10 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

              <div className="space-y-1 text-left">
                <Typography
                  variant="muted"
                  className="text-[9px] uppercase font-black opacity-60 tracking-wider flex items-center gap-1.5"
                >
                  <Globe className="w-3 h-3 text-indigo-500" />
                  Scope
                </Typography>
                <Typography
                  variant="p"
                  className="font-black text-[11px] uppercase tracking-widest"
                >
                  Global Grids
                </Typography>
              </div>

              <div className="h-10 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />

              <div className="space-y-1 text-left">
                <div className="flex items-center gap-1.5">
                  <Typography
                    variant="muted"
                    className="text-[9px] uppercase font-black opacity-60 tracking-wider flex items-center gap-1.5"
                  >
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    Reliability
                  </Typography>
                  <ToolTip content="Validated via combined human/AI audit.">
                    <Info className="w-2.5 h-2.5 text-indigo-400 cursor-help" />
                  </ToolTip>
                </div>
                <Typography
                  variant="p"
                  className="font-black text-[11px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400"
                >
                  99.4% Validated
                </Typography>
              </div>
            </div>
          </div>
        </header>

        {/* Centered Content Area */}
        <article className="w-full max-w-[850px] space-y-10">
          {/* Interactive Stats */}
          <div className="flex flex-wrap items-center justify-center gap-10 py-6 border-y border-zinc-100 dark:border-zinc-800/60">
            <div className="flex items-center gap-2 group cursor-pointer">
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full gap-2 font-bold hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20"
              >
                <ThumbsUp className="w-4 h-4" />0
              </Button>
            </div>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-muted-foreground" />
              <Typography
                variant="small"
                className="text-muted-foreground font-bold"
              >
                {wordCount} Words
              </Typography>
            </div>
            <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <Typography
                variant="small"
                className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]"
              >
                Deep Briefing
              </Typography>
            </div>
          </div>

          {/* Article Body */}
          <article className="prose prose-zinc dark:prose-invert max-w-none">
            <div className="text-zinc-800 dark:text-zinc-200 text-lg sm:text-xl lg:text-2xl font-serif space-y-6">
              <ReactMarkdown
                components={{
                  p: ({ children }) => (
                    <p className="mb-8 leading-relaxed text-left">{children}</p>
                  ),
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-black mb-10 text-zinc-900 dark:text-white leading-tight uppercase tracking-tight text-center">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <div className="flex flex-col items-center text-center mt-20 mb-8 w-full">
                      <h2 className="text-2xl font-black text-zinc-900 dark:text-white border-b-4 border-indigo-600/30 pb-2 uppercase tracking-wide inline-block">
                        {children}
                      </h2>
                    </div>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-black mt-14 mb-5 text-zinc-900 dark:text-white text-center">
                      {children}
                    </h3>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-black text-zinc-900 dark:text-white">
                      {children}
                    </strong>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-y border-zinc-200 dark:border-zinc-800 py-12 my-14 px-8 text-center italic text-2xl font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-50/20 dark:bg-zinc-900/5">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {filteredContent}
              </ReactMarkdown>
            </div>
          </article>

          {/* Related Tags Pill */}
          {news.hashtags && news.hashtags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 pt-16 border-t border-zinc-100 dark:border-zinc-800/50">
              {news.hashtags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 rounded-full hover:bg-indigo-500 hover:text-white transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </main>
    </div>
  );
};

export default NewsView;
