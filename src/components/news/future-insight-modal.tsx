/* eslint-disable @next/next/no-img-element */
"use client";
import ReactMarkdown from "react-markdown";
import {
  TrendingUp,
  Lock,
  Calendar,
  ExternalLinkIcon,
  Sparkles,
  Zap,
} from "lucide-react";
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
import { Badge } from "../ui/badge";

interface FutureInsightModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  insightResponse: string;
  insightLoading: boolean;
  insightError: string | null;
  token: string | null;
  article: NewsArticle | null;
  currentYear?: number;
  onProjectNext?: () => void;
}

export default function FutureInsightModal({
  isOpen,
  onOpenChange,
  insightResponse,
  insightLoading,
  insightError,
  token,
  article,
  currentYear = 1,
  onProjectNext,
}: FutureInsightModalProps) {
  if (!article) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-full sm:max-w-4xl md:max-w-7xl h-[85vh] p-0 overflow-hidden border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-xl flex flex-col md:flex-row gap-0">
        <DialogTitle className="sr-only">
          Forecast AI: {article.title}
        </DialogTitle>
        <DialogDescription className="sr-only">
          AI-powered predictive analysis and future implications of this news.
        </DialogDescription>

        {/* Full-Height Left Thumbnail (Desktop Only) */}
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
              <div className="px-4 py-1.5 rounded-full bg-cyan-600 text-white font-bold text-sm uppercase">
                {article.source?.name || "Global News"}
              </div>
              <div className="px-4 py-1.5 rounded-full bg-white text-black font-bold text-sm flex items-center gap-2 border border-zinc-200">
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
          <div className="flex-1 overflow-y-auto p-0 bg-zinc-50/10 dark:bg-zinc-900/5 selection:bg-cyan-100 dark:selection:bg-cyan-900/40">
            {/* Mobile Hero View (Static at top of scroll) */}
            <div className="md:hidden relative h-72 rounded-none overflow-hidden mb-0 shadow-2xl text-foreground">
              <img
                src={article.urlToImage || "/ReadHub_PlaceHolder.png"}
                alt={article.title}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/80" />
              <div className="absolute bottom-6 left-6 right-6 space-y-3">
                <div className="bg-cyan-600 text-[10px] font-black uppercase tracking-widest text-white px-3 py-1 w-fit rounded-full">
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
              <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/30 ring-1 ring-cyan-100 dark:ring-cyan-900/50 shadow-sm shrink-0">
                <Zap className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div className="flex flex-col min-w-0">
                <Typography
                  variant="muted"
                  className="text-[10px] uppercase font-bold tracking-[0.2em] text-cyan-600 dark:text-cyan-400 mb-0.5 truncate"
                >
                  Future Intelligence
                </Typography>
                <Typography
                  variant="h3"
                  className="text-xl font-black tracking-tight truncate"
                >
                  ReadHub AI Bureau Simulation
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
                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-cyan-600 transition-colors">
                  Source
                </span>
                <ExternalLinkIcon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-cyan-600 transition-colors" />
              </a>
            </div>

            <div className="px-6 sm:px-14 md:px-16 py-12">
              <section className="max-w-3xl mx-auto space-y-12">
                {!token ? (
                  <div className="py-20 text-center space-y-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl bg-zinc-50/50 dark:bg-zinc-900/20">
                    <div className="inline-flex bg-cyan-50 dark:bg-cyan-950/30 p-8 rounded-full shadow-inner">
                      <Lock className="w-12 h-12 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div className="space-y-3 max-w-sm mx-auto p-4">
                      <Typography variant="h4" className="text-2xl font-black">
                        Trajectory Locked
                      </Typography>
                      <Typography
                        variant="muted"
                        className="text-base leading-relaxed"
                      >
                        Authenticate to grant our **AI Bureau** full access to
                        project future trajectories for this news narrative.
                      </Typography>
                    </div>
                    <Button
                      asChild
                      className="rounded-full px-12 h-12 font-black uppercase tracking-widest text-[10px] cursor-pointer bg-cyan-600 hover:bg-cyan-700 shadow-xl shadow-cyan-600/20"
                    >
                      <Link href="/login" onClick={() => onOpenChange(false)}>
                        Request Access
                      </Link>
                    </Button>
                  </div>
                ) : insightLoading && !insightResponse ? (
                  <div className="py-32 flex flex-col items-center justify-center gap-10">
                    <div className="relative">
                      <div className="w-28 h-28 border-2 border-zinc-100 dark:border-zinc-800 rounded-full"></div>
                      <div className="absolute top-0 left-0 w-28 h-28 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin duration-700"></div>
                      <div className="absolute top-2 left-2 right-2 bottom-2 border-2 border-indigo-400/30 border-b-transparent rounded-full animate-spin-reverse duration-[2000ms]"></div>
                      <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-cyan-500 animate-pulse" />
                    </div>
                    <div className="space-y-2 text-center">
                      <Typography
                        variant="muted"
                        className="text-[12px] font-black tracking-[0.6em] uppercase text-cyan-600 dark:text-cyan-400"
                      >
                        Initializing
                      </Typography>
                      <Typography variant="muted" className="text-xs italic">
                        Temporal engines active. Simulating Year 1 trajectories...
                      </Typography>
                    </div>
                  </div>
                ) : insightError ? (
                  <div className="py-12 px-8 text-center space-y-6 border-2 border-red-100 dark:border-red-900/30 bg-red-50/30 dark:bg-red-950/10 rounded-3xl">
                    <div className="inline-flex bg-red-100 dark:bg-red-950/50 p-5 rounded-full">
                      <TrendingUp className="w-10 h-10 text-red-600 dark:text-red-400 rotate-180" />
                    </div>
                    <div className="space-y-2">
                      <Typography
                        variant="h4"
                        className="text-2xl font-black text-red-600"
                      >
                        Projection Failed
                      </Typography>
                      <Typography
                        variant="muted"
                        className="text-base leading-relaxed"
                      >
                        {insightError}
                      </Typography>
                    </div>
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-bottom-8 duration-[1200ms] space-y-12">
                    {/* Intelligence Dashboard */}
                    {insightResponse &&
                      insightResponse.includes("### Intelligence Data") && (
                        <div className="space-y-8 animate-in fade-in zoom-in duration-700 delay-300">
                          {/* Dashboard Header */}
                          <div className="flex items-center gap-3">
                            <div className="h-px flex-1 bg-linear-to-r from-transparent to-zinc-200 dark:to-zinc-800" />
                            <Typography className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
                              Intelligence Dashboard
                            </Typography>
                            <div className="h-px flex-1 bg-linear-to-l from-transparent to-zinc-200 dark:to-zinc-800" />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Disruption Meter - 4 Cols */}
                            <div className="md:col-span-4 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xl shadow-zinc-200/20 dark:shadow-none flex flex-col items-center justify-center space-y-4">
                              <Typography className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                Disruption Index
                              </Typography>
                              <div className="relative w-32 h-32 flex items-center justify-center">
                                {/* Simple circular gauge simulation */}
                                <svg className="w-full h-full -rotate-90">
                                  <circle
                                    cx="64"
                                    cy="64"
                                    r="58"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    className="text-zinc-100 dark:text-zinc-800"
                                  />
                                  <circle
                                    cx="64"
                                    cy="64"
                                    r="58"
                                    fill="transparent"
                                    stroke="url(#cyanIndigoGradient)"
                                    strokeWidth="10"
                                    strokeDasharray="364.4"
                                    strokeDashoffset={
                                      364.4 -
                                      (364.4 *
                                        parseInt(
                                          insightResponse.match(
                                            /Disruption Index:\*\*?\s*(\d+)/,
                                          )?.[1] || "50",
                                        )) /
                                        100
                                    }
                                    className="transition-all duration-[2000ms] delay-500 ease-out"
                                    strokeLinecap="round"
                                  />
                                  <defs>
                                    <linearGradient
                                      id="cyanIndigoGradient"
                                      x1="0%"
                                      y1="0%"
                                      x2="100%"
                                      y2="0%"
                                    >
                                      <stop offset="0%" stopColor="#06b6d4" />
                                      <stop offset="100%" stopColor="#6366f1" />
                                    </linearGradient>
                                  </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                  <span className="text-3xl font-black tracking-tighter">
                                    {insightResponse.match(
                                      /Disruption Index:\*\*?\s*(\d+)/,
                                    )?.[1] || "50"}
                                  </span>
                                  <span className="text-[8px] font-bold uppercase text-zinc-400">
                                    Impact
                                  </span>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-[9px] font-black uppercase px-3"
                              >
                                {insightResponse.match(
                                  /Certainty Level:\*\*?\s*(\w+)/,
                                )?.[1] || "Medium"}{" "}
                                Probability
                              </Badge>
                            </div>

                            {/* Ripple Map - 8 Cols */}
                            <div className="md:col-span-8 p-8 rounded-3xl bg-linear-to-br from-zinc-900 to-black text-white border border-zinc-800 shadow-2xl space-y-6 flex flex-col justify-center">
                              <Typography className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                Trajectory Map
                              </Typography>
                              <div className="grid grid-cols-3 gap-4 relative">
                                {/* Connecting Arrows */}
                                <div className="absolute top-1/2 left-[30%] -translate-y-1/2 text-zinc-700 animate-pulse hidden lg:block">
                                  ➔
                                </div>
                                <div className="absolute top-1/2 left-[64%] -translate-y-1/2 text-zinc-700 animate-pulse hidden lg:block">
                                  ➔
                                </div>

                                {/* Step nodes based on Causal Chain extraction */}
                                {(() => {
                                  const chain = insightResponse
                                    .match(/Causal Chain:\*\*?\s*(.+)/)?.[1]
                                    ?.split("->") || [
                                    "Catalyst",
                                    "System Shift",
                                    "Resolution",
                                  ];
                                  return chain.slice(0, 3).map((step, idx) => (
                                    <div key={idx} className="space-y-3">
                                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold shadow-lg shadow-cyan-500/20">
                                        {idx + 1}
                                      </div>
                                      <p className="text-[11px] font-medium leading-relaxed text-zinc-300 line-clamp-3">
                                        {step.trim()}
                                      </p>
                                    </div>
                                  ));
                                })()}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                    {/* High Impact Key Takeaways bulletins (extracted from 'Core Predictions' section) */}
                    {insightResponse &&
                      insightResponse.includes("### Core Predictions") && (
                        <div className="p-8 rounded-3xl bg-linear-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 border border-cyan-100 dark:border-cyan-900/30 shadow-sm">
                          <Typography
                            variant="h4"
                            className="text-lg font-black uppercase tracking-[0.1em] text-cyan-700 dark:text-cyan-400 mb-6 flex items-center gap-2"
                          >
                            Core Predictions
                          </Typography>
                          <div className="space-y-4">
                            {insightResponse
                              .split("### Detailed Analysis")[0]
                              .split("### Core Predictions")[1]
                              ?.split("\n")
                              .filter(
                                (line) =>
                                  line.includes("**") ||
                                  line.startsWith("-") ||
                                  line.startsWith("1.") ||
                                  line.startsWith("2.") ||
                                  line.startsWith("3."),
                              )
                              .slice(0, 5)
                              .map((point, idx) => (
                                <div key={idx} className="flex gap-4 items-start">
                                  <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-relaxed italic">
                                    {point
                                      .replace(/[\*\-\>]/g, "")
                                      .replace(/^\d\./, "")
                                      .trim()}
                                  </p>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                    {/* Enhanced Editorial Markdown (Only the Detailed Analysis part) */}
                    <div
                      className="prose prose-zinc dark:prose-invert max-w-none 
                      prose-headings:font-black prose-headings:tracking-tight 
                      prose-p:text-lg prose-p:leading-relaxed prose-p:text-zinc-800 dark:prose-p:text-zinc-300 
                      prose-strong:text-cyan-700 dark:prose-strong:text-cyan-400
                      prose-li:text-lg prose-li:text-zinc-700 dark:prose-li:text-zinc-300"
                    >
                      <ReactMarkdown
                        components={{
                          h4: ({ children }) => (
                            <div className="flex flex-col gap-6 mt-16 mb-8 first:mt-0">
                              <div className="h-px w-full bg-linear-to-r from-zinc-200 dark:from-zinc-800 via-zinc-200 dark:via-zinc-800 to-transparent" />
                              <div className="flex items-center gap-3">
                                <div className="px-5 py-2 rounded-xl bg-cyan-600 dark:bg-cyan-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-cyan-600/20">
                                  {children}
                                </div>
                              </div>
                            </div>
                          ),
                        }}
                      >
                        {insightResponse.includes("### Detailed Analysis")
                          ? insightResponse.split("### Detailed Analysis")[1]
                          : insightResponse}
                      </ReactMarkdown>
                    </div>

                    {/* Progressive Loading State for Year 2/3 */}
                    {insightLoading && currentYear > 1 && (
                      <div className="py-12 border-t border-dashed border-zinc-200 dark:border-zinc-800 animate-pulse space-y-4">
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" />
                          <Typography className="text-xs font-black uppercase tracking-widest text-cyan-500">
                            Extending Projection...
                          </Typography>
                        </div>
                        <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full w-3/4"></div>
                        <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-full w-1/2"></div>
                      </div>
                    )}

                    {/* Iterative Action Button */}
                    {currentYear < 3 && !insightLoading && (
                      <div className="pt-8 flex justify-center">
                        <Button
                          onClick={onProjectNext}
                          className="group relative px-10 h-14 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black uppercase tracking-[0.2em] text-[10px] overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl"
                        >
                          <div className="absolute inset-0 bg-linear-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <span className="relative z-10 flex items-center gap-3">
                            Read More (Year {currentYear + 1})
                            <TrendingUp className="w-4 h-4 translate-y-0.5" />
                          </span>
                        </Button>
                      </div>
                    )}

                    <Typography
                      variant="muted"
                      className="text-center text-xs italic tracking-wide pb-4 pt-12 border-t border-zinc-100 dark:border-zinc-800"
                    >
                      Experimental Intelligence by ReadHub AI Bureau • Future
                      events are unpredictable and projections are speculative
                    </Typography>
                  </div>
                )}
              </section>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
