/* eslint-disable @next/next/no-img-element */
"use client";
import ReactMarkdown from "react-markdown";
import { Zap, Lock, Calendar, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogDescription,
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

        {/* Full-Height Left Thumbnail (Desktop Only) */}
        <div className="hidden md:block w-[50%] relative flex-shrink-0 group overflow-hidden border-r border-zinc-100 dark:border-zinc-800">
          <img
            src={article.urlToImage || "/ReadHub_PlaceHolder.png"}
            alt={article.title}
            className="object-cover w-full h-full transition-transform duration-[2000ms] group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 bg-linear-to-b from-black/10 via-transparent to-black/90" />

          <div className="absolute inset-x-0 bottom-0 p-12 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-4 py-1.5 rounded-full bg-blue-500 text-white font-bold text-sm uppercase">
                {article.source?.name || "Global News"}
              </div>
              <div className="px-4 py-1.5 rounded-full bg-white text-black font-bold text-sm flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                {formatDate(new Date(article.publishedAt), "MMM d, yyyy")}
              </div>
            </div>

            <Typography
              variant="h2"
              className="text-3xl lg:text-4xl font-black text-white leading-tight tracking-[0.02em] drop-shadow-lg line-clamp-4"
            >
              {article.title}
            </Typography>
          </div>
        </div>

        {/* Scrollable Right Content Dashboard */}
        <div className="flex-1 flex flex-col h-full bg-white dark:bg-zinc-950 overflow-hidden">
          {/* Main Scroll Content Area */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-12 pt-4 space-y-4 bg-zinc-50/10 dark:bg-zinc-900/5">
            {/* Mobile Hero View (Headline on image for mobile too) */}
            <div className="md:hidden relative h-72 rounded-xl overflow-hidden mb-8 shadow-2xl">
              <img
                src={article.urlToImage || "/ReadHub_PlaceHolder.png"}
                alt={article.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/80" />
              <div className="absolute bottom-6 left-6 right-6 space-y-3">
                <div className="bg-blue-600 text-[10px] font-black uppercase tracking-widest text-white px-3 py-1 w-fit rounded-full">
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

            {/* Detailed AI Analysis */}
            <section className="space-y-4">
              <div className="flex items-center gap-4">
                <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <Typography
                  variant="h3"
                  className="text-xl font-black tracking-tight"
                >
                  AI Summary
                </Typography>
                <div className="h-[1.5px] flex-1 bg-linear-to-r from-zinc-200 dark:from-zinc-800 to-transparent" />
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 -mr-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                  title="View Source Article"
                >
                  <ExternalLinkIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </a>
              </div>

              {!token ? (
                <div className="py-20 text-center space-y-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                  <div className="inline-flex bg-indigo-50 dark:bg-indigo-950/30 p-6 rounded-full">
                    <Lock className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="space-y-3 max-w-sm mx-auto p-4">
                    <Typography variant="h4" className="text-2xl font-black">
                      Analysis Locked
                    </Typography>
                    <Typography
                      variant="muted"
                      className="text-sm leading-relaxed"
                    >
                      Authenticate to grant our AI agent full access to this
                      news narrative for deep synthesis.
                    </Typography>
                  </div>
                  <Button
                    asChild
                    className="rounded-full px-12 h-12 font-black uppercase tracking-widest text-[10px] cursor-pointer"
                  >
                    <Link href="/login" onClick={() => onOpenChange(false)}>
                      Secure Access
                    </Link>
                  </Button>
                </div>
              ) : aiLoading ? (
                <div className="py-24 flex flex-col items-center justify-center gap-8">
                  <div className="relative">
                    <div className="w-24 h-24 border-4 border-zinc-100 dark:border-zinc-800 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-24 h-24 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-indigo-600 animate-pulse" />
                  </div>
                  <Typography
                    variant="muted"
                    className="text-[10px] font-bold tracking-[0.5em] uppercase animate-pulse"
                  >
                    AI Agent is Analyzing
                  </Typography>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
                  <div className="prose dark:prose-invert max-w-none prose-sm sm:prose-base leading-loose text-foreground/85 font-medium">
                    <ReactMarkdown>{aiResponse}</ReactMarkdown>
                  </div>
                </div>
              )}
            </section>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
