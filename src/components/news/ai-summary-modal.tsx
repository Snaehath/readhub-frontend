/* eslint-disable @next/next/no-img-element */
"use client";
import ReactMarkdown from "react-markdown";
import { Zap, Lock, Calendar, ExternalLinkIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Button } from "../ui/button";
import Typography from "../ui/custom/typography";
import { NewsArticle } from "@/types";
import { formatDate } from "date-fns";

interface AiSummaryModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  aiResponse: string;
  aiLoading: boolean;
  token: string | null;
  article: NewsArticle | null;
}

export default function AiSummaryModal({
  isOpen,
  onOpenChange,
  aiResponse,
  aiLoading,
  token,
  article,
}: AiSummaryModalProps) {
  if (!article) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full sm:max-w-4xl md:max-w-7xl h-[85vh] p-0 overflow-hidden border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-xl flex flex-col md:flex-row gap-0">
        <DialogTitle className="sr-only">
          AI Analysis: {article.title}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Detailed intelligence report and summary powered by AI.
        </DialogDescription>

        {/* Full-Height Left Thumbnail (Desktop Only) - 40% Width */}
        <div className="hidden md:block w-[40%] relative flex-shrink-0 group overflow-hidden border-r border-zinc-100 dark:border-zinc-800">
          <img
            src={article.urlToImage || "/ReadHub_PlaceHolder.png"}
            alt={article.title}
            className="object-cover w-full h-full transition-transform duration-[2000ms] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/90" />

          <div className="absolute inset-x-0 bottom-0 p-12 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-1.5 rounded-full bg-indigo-600 text-white font-bold text-sm uppercase">
                {article.source?.name || "Global News"}
              </div>
              <div className="px-4 py-1.5 rounded-full bg-white text-black font-bold text-sm flex items-center gap-2 border border-zinc-200 shadow-sm">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(new Date(article.publishedAt), "MMM d, yyyy")}
              </div>
            </div>

            <Typography
              variant="h2"
              className="text-2xl lg:text-3xl font-black text-white leading-tight tracking-[0.02em] drop-shadow-lg line-clamp-5"
            >
              {article.title}
            </Typography>
          </div>
        </div>

        {/* Scrollable Right Content Dashboard - 60% Width */}
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-zinc-950 overflow-hidden">
          {/* Main Scroll Content Area */}
          <div className="flex-1 overflow-y-auto p-0 bg-zinc-50/10 dark:bg-zinc-900/5 selection:bg-indigo-100 dark:selection:bg-indigo-900/40">
            {/* Mobile Hero View (Static at top of scroll) */}
            <div className="md:hidden relative h-72 rounded-none overflow-hidden mb-0 shadow-2xl">
              <img
                src={article.urlToImage || "/ReadHub_PlaceHolder.png"}
                alt={article.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/80" />
              <div className="absolute bottom-6 left-6 right-6 space-y-3">
                <div className="bg-indigo-600 text-[10px] font-black uppercase tracking-widest text-white px-3 py-1 w-fit rounded-full">
                  {article.source?.name}
                </div>
                <Typography
                  variant="h3"
                  className="text-xl font-black text-white leading-tight"
                >
                  {article.title}
                </Typography>
              </div>
            </div>

            {/* Sticky Intelligence Header */}
            <div className="sticky top-0 z-30 px-6 sm:px-14 md:px-16 py-8 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-4">
              <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 ring-1 ring-indigo-100 dark:ring-indigo-900/50 shadow-sm shrink-0">
                <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex flex-col min-w-0">
                <Typography
                  variant="muted"
                  className="text-[10px] uppercase font-bold tracking-[0.2em] text-indigo-600 dark:text-indigo-400 mb-0.5 truncate"
                >
                  Deep Synthesis Intelligence
                </Typography>
                <Typography
                  variant="h3"
                  className="text-xl font-black tracking-tight truncate"
                >
                  ReadHub AI Bureau Summarizer
                </Typography>
              </div>
              <div className="h-[1.5px] flex-1 bg-linear-to-r from-zinc-200 dark:from-zinc-800 to-transparent hidden sm:block" />
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer box-border shrink-0"
                title="View Source Article"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-indigo-600 transition-colors">
                  Source
                </span>
                <ExternalLinkIcon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-indigo-600 transition-colors" />
              </a>
            </div>

            <div className="px-6 sm:px-14 md:px-16 py-12">
              <section className="max-w-3xl mx-auto space-y-10">
                {!token ? (
                  <div className="py-20 text-center space-y-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/20">
                    <div className="inline-flex bg-indigo-50 dark:bg-indigo-950/30 p-8 rounded-full shadow-inner">
                      <Lock className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="space-y-3 max-w-sm mx-auto p-4">
                      <Typography variant="h4" className="text-2xl font-black">
                        Analysis Locked
                      </Typography>
                      <Typography
                        variant="muted"
                        className="text-base leading-relaxed"
                      >
                        Authenticate to grant our **AI Agent** full access to
                        this news narrative for deep synthesis and context
                        mapping.
                      </Typography>
                    </div>
                    <Button
                      asChild
                      className="rounded-full px-12 h-12 font-black uppercase tracking-widest text-[10px] cursor-pointer bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20"
                    >
                      <Link href="/login" onClick={() => onOpenChange(false)}>
                        Request Access
                      </Link>
                    </Button>
                  </div>
                ) : aiLoading ? (
                  <div className="py-32 flex flex-col items-center justify-center gap-10">
                    <div className="relative">
                      <div className="w-28 h-28 border-2 border-zinc-100 dark:border-zinc-800 rounded-full"></div>
                      <div className="absolute top-0 left-0 w-28 h-28 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin duration-700"></div>
                      <div className="absolute top-2 left-2 right-2 bottom-2 border-2 border-violet-400/30 border-b-transparent rounded-full animate-spin-reverse duration-[2000ms]"></div>
                      <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-500 animate-pulse" />
                    </div>
                    <div className="space-y-2 text-center">
                      <Typography
                        variant="muted"
                        className="text-[12px] font-black tracking-[0.6em] uppercase text-indigo-600 dark:text-indigo-400"
                      >
                        Synthesizing
                      </Typography>
                      <Typography variant="muted" className="text-xs italic">
                        Mapping narrative threads and intelligence patterns...
                      </Typography>
                    </div>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-8 duration-[1200ms] space-y-12 pb-20">
                    {/* Enhanced Editorial Markdown */}
                    <div
                      className="prose prose-zinc dark:prose-invert max-w-none 
                      prose-headings:font-black prose-headings:tracking-tight 
                      prose-p:text-lg prose-p:leading-relaxed prose-p:text-zinc-800 dark:prose-p:text-zinc-300 
                      prose-strong:text-indigo-700 dark:prose-strong:text-indigo-400
                      prose-li:text-lg prose-li:text-zinc-700 dark:prose-li:text-zinc-300"
                    >
                      <ReactMarkdown
                        components={{
                          h3: ({ children }) => (
                            <div className="flex flex-col gap-6 mt-16 mb-8 first:mt-0">
                              <div className="h-px w-full bg-linear-to-r from-zinc-200 dark:from-zinc-800 via-zinc-200 dark:via-zinc-800 to-transparent" />
                              <div className="flex items-center gap-3">
                                <span className="px-5 py-2 rounded-xl bg-indigo-600 dark:bg-indigo-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-indigo-600/20">
                                  {children}
                                </span>
                              </div>
                            </div>
                          ),
                        }}
                      >
                        {aiResponse}
                      </ReactMarkdown>
                    </div>

                    <Typography
                      variant="muted"
                      className="text-center text-xs italic tracking-wide pb-4 pt-12 border-t border-zinc-100 dark:border-zinc-800"
                    >
                      Briefing provided by ReadHub AI Bureau • Intelligence
                      curated in real-time
                    </Typography>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>

        <DialogFooter className="p-4 border-t border-black/20 dark:border-white/20 bg-white dark:bg-zinc-950 flex items-center justify-center sm:justify-center">
          <Button
            size={"sm"}
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto uppercase tracking-widest cursor-pointer"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
