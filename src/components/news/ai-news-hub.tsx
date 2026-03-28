"use client";

import { useState } from "react";
import {
  Newspaper,
  Sparkles,
  Loader2,
  ArrowRight,
  Calendar,
  Microscope,
  Lock as LockIcon,
} from "lucide-react";
import { fetcher } from "@/lib/fetcher";
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

const AiNewsHub = () => {
  const { user, _hasHydrated } = useUserStore();
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useSWR<AiNewsResponse>(
    `${API_BASE_URL}/ai-hub/news/all`,
    fetcher
  );

  const handleGenerateNews = async () => {
    if (!user) return;
    setLoading(true);
    toast.loading("Deploying AI Journalist...", { id: "gen-news" });

    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch(`${API_BASE_URL}/ai-hub/news/generate`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: suggestion }),
      });

      if (res.ok) {
        toast.success("AI Investigation Complete!", { id: "gen-news" });
        mutate(`${API_BASE_URL}/ai-hub/news/all`);
        setSuggestion("");
      } else {
        toast.error("AI nodes are currently saturated.", { id: "gen-news" });
      }
    } catch {
      toast.error("Network synchronization failed.", { id: "gen-news" });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <Typography
          variant="muted"
          className="text-sm font-black uppercase tracking-widest animate-pulse"
        >
          Scanning Global Data Grids...
        </Typography>
      </div>
    );
  }

  const articles = data?.news || [];

  return (
    <div className="space-y-16">
      {/* Generate Interface (Auth Gated) */}
      {!_hasHydrated ? (
        <div className="h-40 w-full bg-zinc-100 dark:bg-zinc-900 rounded-[2.5rem] animate-pulse" />
      ) : user ? (
        <div className="relative group bg-linear-to-br from-indigo-600/5 via-violet-600/5 to-fuchsia-600/5 backdrop-blur-md p-10 sm:p-14 rounded-[3rem] border border-indigo-500/10 shadow-sm overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/5 blur-[100px] -ml-32 -mb-32 rounded-full" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="bg-indigo-600/10 text-indigo-600 p-3 rounded-2xl w-fit mx-auto">
              <Microscope className="w-6 h-6" />
            </div>
            <Typography variant="h2" className="text-3xl font-black">
              Generate AI News
            </Typography>
            <Typography variant="p" className="text-muted-foreground">
              Direct the AI Bureau to investigate any topic. From global shifts
              to technical trends, get a comprehensive journalistic briefing.
            </Typography>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Input
                placeholder="What should our AI investigate?"
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                className="rounded-full bg-background/50 border-zinc-200 dark:border-zinc-800 h-14 px-8 text-base shadow-inner focus:ring-indigo-500"
              />
              <Button
                onClick={handleGenerateNews}
                disabled={loading || !suggestion.trim()}
                className="h-14 px-10 rounded-full font-black uppercase tracking-wide bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/20 gap-2 shrink-0 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                Investigate
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-8 text-center bg-zinc-50/50 dark:bg-zinc-900/10 rounded-[3rem] border border-zinc-200/50 dark:border-zinc-800/50">
          <div className="bg-zinc-100 dark:bg-zinc-800/50 p-5 rounded-full mb-6 relative">
            <LockIcon className="w-8 h-8 text-zinc-400" />
            <div className="absolute inset-0 bg-indigo-500/10 blur-xl rounded-full" />
          </div>
          <Typography variant="h3" className="text-2xl font-black mb-2">
            Journalist Mode Locked
          </Typography>
          <Typography
            variant="p"
            className="text-muted-foreground text-sm max-w-sm mb-8"
          >
            Login to access advanced AI generation. Direct our investigative
            agents to create custom deep-briefings.
          </Typography>
          <Button asChild className="rounded-full px-10 h-12 font-bold shadow-lg">
            <Link href="/login">Authenticate to Access</Link>
          </Button>
        </div>
      )}

      {/* Articles Grid */}
      <div className="space-y-10">
        <div className="flex items-center gap-6">
          <Typography
            variant="muted"
            className="text-xs font-black uppercase tracking-[0.3em] whitespace-nowrap text-indigo-600"
          >
            Daily Briefings
          </Typography>
          <div className="h-px w-full bg-indigo-500/10" />
        </div>

        {articles.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-full flex items-center justify-center mx-auto">
              <Newspaper className="w-8 h-8 text-zinc-300" />
            </div>
            <Typography variant="muted">
              No briefings have been generated yet.
            </Typography>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article._id}
                href={`/ai-hub/news/${article._id}`}
                className="group flex flex-col h-full bg-card hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-200/60 dark:border-zinc-800/60 p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                  <Newspaper className="w-24 h-24 -mr-12 -mt-12 rotate-[-15deg]" />
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 px-3 py-1 rounded-full">
                    {article.category || "AI Intel"}
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-bold tracking-widest ml-auto">
                    <Calendar className="w-3 h-3" />
                    {format(new Date(article.createdAt), "MMM d")}
                  </div>
                </div>

                <div className="space-y-4 flex-grow flex flex-col">
                  <Typography
                    variant="h3"
                    className="text-xl font-bold leading-snug group-hover:text-indigo-600 transition-colors"
                  >
                    {article.title}
                  </Typography>

                  <Typography
                    variant="muted"
                    className="text-sm line-clamp-3 mb-6"
                  >
                    {article.content}
                  </Typography>

                  <div className="mt-auto pt-6 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-black uppercase">
                        {article.authorName.charAt(0)}
                      </div>
                      <Typography
                        variant="small"
                        className="text-[11px] font-black uppercase tracking-wider truncate max-w-[120px]"
                      >
                        {article.authorName}
                      </Typography>
                    </div>

                    <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiNewsHub;
