"use client";

import { use, useState } from "react";
import useSWR from "swr";
import {
  ArrowLeft,
  Share2,
  ExternalLink,
  Check,
  Clock,
  Newspaper,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/custom/typography";
import { API_BASE_URL } from "@/constants";
import { SingleAiNewsResponse } from "@/types";
import { format, isValid } from "date-fns";
import { fetcher } from "@/lib/fetcher";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

export const NewsView = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [isCopied, setIsCopied] = useState(false);

  const { data, isLoading, error } = useSWR<SingleAiNewsResponse>(
    id ? `${API_BASE_URL}/ai-hub/news/${id}` : null,
    fetcher,
  );

  const news = data?.news;
  const linkedSources = (news?.sources ?? []).flatMap((source) => {
    try {
      const parsed = new URL(source.url || "");
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return [];
      return [{ ...source, safeUrl: parsed.toString(), host: parsed.hostname }];
    } catch {
      return [];
    }
  });

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: news?.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setIsCopied(true);
        window.setTimeout(() => setIsCopied(false), 2000);
        toast.success("Report link copied.");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Could not share this report.");
      }
    }
  };

  // Filter content to remove duplicate headings/bylines
  const filteredContent = news
    ? news.content
        .replace(/^# .*\n?/, "") // Remove H1 title
        .replace(/\*\*Investigative Report by.*\*\*\n?/, "") // Remove byline
        .trim()
    : "";

  const wordCount = news ? news.content.trim().split(/\s+/).length : 0;
  const readTime = Math.ceil(wordCount / 238); // avg reading speed 238 wpm
  const createdAt = news ? new Date(news.createdAt) : null;
  const formattedCreatedAt = createdAt && isValid(createdAt)
    ? format(createdAt, "MMMM dd, yyyy")
    : "Date unavailable";

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
          <Link href="/ai-news">Back to AI News</Link>
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
            <Link href="/ai-news">
              <ArrowLeft className="w-4 h-4" />
              Back to News
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              aria-label={isCopied ? "Report link copied" : "Share this report"}
              title={isCopied ? "Report link copied" : "Share this report"}
              className="rounded-full rounded-2xl"
            >
              {isCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            </Button>
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
              {formattedCreatedAt}
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
                  R
              </div>
              <div className="text-left space-y-0.5">
                <Typography
                  variant="small"
                  className="font-black text-sm uppercase tracking-wider block leading-none"
                >
                  ReadHub AI
                </Typography>
                <Typography
                  variant="muted"
                  className="text-[10px] uppercase font-bold tracking-widest block opacity-70 leading-none"
                >
                  AI-generated report
                </Typography>
              </div>
            </div>

          </div>
        </header>

        {/* Centered Content Area */}
        <article className="w-full max-w-[850px] space-y-10">
          <div className="flex items-center justify-center py-4 border-y border-zinc-100 dark:border-zinc-800/60 text-sm text-muted-foreground">
            {readTime} min read · {wordCount} words
          </div>

          <section aria-labelledby="report-sources-heading" className="rounded-2xl border border-indigo-500/15 bg-indigo-500/[0.03] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="report-sources-heading" className="font-bold text-foreground">Sources</h2>
                <p className="mt-1 text-sm text-muted-foreground">Open the original articles to verify details. AI-generated reports can contain errors.</p>
              </div>
              <span className="shrink-0 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                {linkedSources.length}
              </span>
            </div>
            {linkedSources.length ? (
              <ul className="mt-4 space-y-2">
                {linkedSources.map((source, index) => (
                    <li key={`${source.safeUrl}-${index}`}>
                      <a href={source.safeUrl} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between gap-3 rounded-xl border border-border/70 bg-background px-4 py-3 text-sm hover:border-indigo-500/50 hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                        <span>
                          <span className="block font-medium">{source.title || "Open source article"}</span>
                          <span className="mt-1 block text-xs text-muted-foreground">{source.sourceName || source.host}</span>
                        </span>
                        <ExternalLink aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                      </a>
                    </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">Source links were not saved for this report.</p>
            )}
          </section>

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
                  className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 rounded-full"
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
