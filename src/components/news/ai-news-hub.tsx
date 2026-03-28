"use client";

import { useState } from "react";
import {
  Newspaper,
  Sparkles,
  Loader2,
  ArrowRight,
  Calendar,
  User,
  Microscope,
  Lock as LockIcon,
} from "lucide-react";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Typography from "@/components/ui/custom/typography";
import { API_BASE_URL } from "@/constants";
import { AiNewsResponse } from "@/types";
import { useUserStore } from "@/lib/store/userStore";
import { format } from "date-fns";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AiNewsHub() {
  const { user, _hasHydrated } = useUserStore();
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useSWR<AiNewsResponse>(
    `${API_BASE_URL}/ai-hub/news/all`,
    fetcher,
  );

  const allNews = data?.news || [];

  const handleTrigger = async () => {
    if (!user) {
      toast.error("Please login to generate AI reports!");
      return;
    }

    setLoading(true);
    toast.loading("Analyzing global data and drafting report...", {
      id: "gen-news",
    });
    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch(`${API_BASE_URL}/ai-hub/news/trigger`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ suggestion }),
      });

      if (res.ok) {
        toast.success("AI Investigation Complete!", { id: "gen-news" });
        mutate(`${API_BASE_URL}/ai-hub/news/all`);
        setSuggestion("");
      } else {
        toast.error("AI nodes are currently saturated.", { id: "gen-news" });
      }
    } catch (_err) {
      toast.error("Network synchronization failed.", { id: "gen-news" });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-8 text-center bg-zinc-50 dark:bg-zinc-900/50 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800 shadow-sm min-h-[400px]">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <Typography variant="muted">
          Synchronizing Intelligence Reports...
        </Typography>
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-right-8 duration-700">
      {/* 1. Header & Investigation Prompt */}
      <div className="px-6 pt-4 pb-10 lg:px-8">
        <div className="mx-auto max-w-2xl text-center space-y-8 relative z-10">
          {/* Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 border border-indigo-200 dark:border-indigo-700/50 text-indigo-600 dark:text-indigo-400">
              <Microscope className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                AI News
              </span>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <Typography
              variant="h2"
              className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.1]"
            >
              AI-Generated{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                News Articles
              </span>
              .
            </Typography>
            <Typography
              variant="p"
              className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto leading-relaxed"
            >
              Suggest a topic and our AI will generate a full, in-depth news
              article on it — no journalists, just intelligence.
            </Typography>
          </div>

          {/* Input — hydration-safe auth gate */}
          {!_hasHydrated ? (
            // Skeleton while store rehydrates from localStorage
            <div className="h-16 max-w-xl mx-auto w-full rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          ) : user ? (
            <>
              <div className="flex items-center gap-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-2 pl-5 focus-within:border-indigo-400 dark:focus-within:border-indigo-600 transition-all max-w-xl mx-auto">
                <Input
                  placeholder="What topic should be analyzed today?"
                  className="flex-grow border-none bg-transparent text-base font-medium placeholder:text-muted-foreground/50 focus-visible:ring-0 focus-visible:ring-offset-0 h-11"
                  value={suggestion}
                  onChange={(e) => setSuggestion(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    !loading &&
                    suggestion.trim() &&
                    handleTrigger()
                  }
                />
                <Button
                  onClick={handleTrigger}
                  disabled={loading || !suggestion.trim()}
                  className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition-all active:scale-95 gap-2 shrink-0"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">Generate</span>
                </Button>
              </div>

              {/* Quick topic badges */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mr-1">
                  Try:
                </span>
                {[
                  { tag: "Neural Ethics", query: "The Ethics of Neural Links" },
                  { tag: "Chip Wars", query: "Global Microchip Geopolitics" },
                  {
                    tag: "Quantum Safe",
                    query: "Quantum Cryptography Shields",
                  },
                ].map((item) => (
                  <button
                    key={item.tag}
                    onClick={() => setSuggestion(item.query)}
                    className="px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/40 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-all"
                  >
                    {item.tag}
                  </button>
                ))}
              </div>
            </>
          ) : (
            /* Locked state for guests */
            <div className="flex flex-col items-center gap-4 py-6 px-8 bg-card/60 backdrop-blur-sm rounded-3xl border border-border/60 max-w-md mx-auto">
              <div className="bg-indigo-50 dark:bg-indigo-950/30 p-4 rounded-full">
                <LockIcon className="w-6 h-6 text-indigo-500" />
              </div>
              <div className="text-center space-y-1">
                <Typography variant="h4" className="font-black text-base">
                  Login to Generate Articles
                </Typography>
                <Typography variant="muted" className="text-sm">
                  Sign in to submit topics and generate AI news articles.
                  Reading is free for everyone.
                </Typography>
              </div>
              <Button
                asChild
                size="sm"
                className="rounded-full px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
              >
                <Link href="/login">Login</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Investigation Grid */}
      <div className="space-y-10">
        <div className="flex items-end justify-between border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <div className="space-y-1">
            <Typography
              variant="h3"
              className="text-2xl font-black uppercase tracking-tight"
            >
              Live Archive
            </Typography>
            <Typography
              variant="muted"
              className="text-xs font-bold uppercase tracking-widest"
            >
              Global Intelligence Feed
            </Typography>
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
            {allNews.length} {allNews.length === 1 ? "Article" : "Articles"}{" "}
            Generated
          </div>
        </div>

        {allNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allNews.map((news) => (
              <Link
                key={news._id}
                href={`/ai-hub/news/${news._id}`}
                className="group"
              >
                <article className="h-full flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:border-indigo-500/30 transition-all duration-500">
                  {/* Header: Metadata */}
                  <div className="p-8 pb-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 rounded-full">
                        {news.category || "General"}
                      </span>
                      <Typography
                        variant="muted"
                        className="text-[10px] font-bold uppercase flex items-center gap-1.5"
                      >
                        <Calendar className="w-3 h-3" />
                        {format(new Date(news.createdAt), "MMM d, yyyy")}
                      </Typography>
                    </div>

                    <Typography
                      variant="h4"
                      className="text-xl font-black leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2"
                    >
                      {news.title}
                    </Typography>
                  </div>

                  {/* Summary */}
                  <div className="px-8 flex-grow">
                    <Typography
                      variant="p"
                      className="text-sm text-muted-foreground leading-relaxed line-clamp-4"
                    >
                      {news.summary}
                    </Typography>
                  </div>

                  {/* Footer */}
                  <div className="p-8 pt-6 mt-auto border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                        <User className="w-3 h-3 text-zinc-500" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                        {news.authorName}
                      </span>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center space-y-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800">
            <Newspaper className="w-12 h-12 text-zinc-300 mx-auto" />
            <Typography variant="p" className="text-muted-foreground">
              The neural archives are currently empty.
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}
