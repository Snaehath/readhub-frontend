"use client";

import { useState } from "react";
import {
  Newspaper,
  Sparkles,
  Loader2,
  ArrowRight,
  Calendar,
  Microscope,
} from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/custom/typography";
import { API_BASE_URL } from "@/constants";
import { AiNewsResponse } from "@/types";
import { useUserStore } from "@/lib/store/userStore";
import { format, isValid } from "date-fns";

const AiNewsHub = () => {
  const { user, _hasHydrated } = useUserStore();
  const [loading, setLoading] = useState(false);

  const aiNewsKey = `${API_BASE_URL}/ai-hub/news/all`;
  const { data, isLoading, error } = useSWR<AiNewsResponse>(
    aiNewsKey,
    fetcher,
  );

  const handleGenerateNews = async () => {
    if (!user) return;
    setLoading(true);
    toast.loading("Generating an AI research report...", { id: "gen-news" });

    try {
      const res = await fetch(`${API_BASE_URL}/ai-hub/news/trigger`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ topic: "Top trending global news" }),
      });

      if (res.ok) {
        toast.success("AI research report generated.", { id: "gen-news" });
        mutate(`${API_BASE_URL}/ai-hub/news/all`);
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "AI nodes are currently saturated.", {
          id: "gen-news",
        });
      }
    } catch (err) {
      console.error("AI news generation error:", err);
      toast.error("Global data synchronization failed.", { id: "gen-news" });
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
          Loading AI reports...
        </Typography>
      </div>
    );
  }

  const articles = data?.news || [];

  return (
      <div className="space-y-16">
      {/* Generate Interface (Admin Only) */}
      {_hasHydrated && user?.role === "admin" && (
        <div className="relative group bg-linear-to-br from-indigo-600/5 via-violet-600/5 to-fuchsia-600/5 backdrop-blur-md p-10 sm:p-14 rounded-[3rem] border border-indigo-500/10 shadow-sm overflow-hidden flex flex-col items-center text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] -mr-32 -mt-32 rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-500/5 blur-[100px] -ml-32 -mb-32 rounded-full" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="bg-indigo-600/10 text-indigo-600 p-3 rounded-2xl w-fit mx-auto">
              <Microscope className="w-6 h-6" />
            </div>
            <Typography variant="h2" className="text-3xl font-black">
              AI research reports
            </Typography>
            <Typography variant="p" className="text-muted-foreground">
              Generate a report from saved news articles. Each report is
              AI-generated and should be checked against its linked sources.
            </Typography>

            <div className="pt-4">
              <Button
                onClick={handleGenerateNews}
                disabled={loading}
                className="h-12 px-8 rounded-full font-black uppercase tracking-widest bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-500/20 gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98] group"
              >
                {loading ? (
                  <Loader2 className="w-4.5 h-4.5 animate-spin text-white" />
                ) : (
                  <Sparkles className="w-4.5 h-4.5 text-indigo-200 group-hover:rotate-12 transition-transform" />
                )}
                {loading ? "Generating report..." : "Generate a report"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Articles Grid */}
      <div className="space-y-10">
        <div className="flex items-center gap-6">
          <Typography
            variant="muted"
            className="text-xs font-black uppercase tracking-[0.3em] whitespace-nowrap text-indigo-600"
          >
            AI-generated reports
          </Typography>
          <div className="h-px w-full bg-indigo-500/10" />
        </div>

        {error ? (
          <div role="alert" className="py-16 text-center space-y-4">
            <Typography variant="muted">Could not load AI reports. Check your connection and try again.</Typography>
            <Button variant="outline" onClick={() => mutate(aiNewsKey)}>Try again</Button>
          </div>
        ) : articles.length === 0 ? (
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
                href={`/ai-news/${article._id}`}
                className="group flex flex-col h-full bg-card hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 rounded-[2.5rem] border border-zinc-200/60 dark:border-zinc-800/60 p-6 transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-2 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                  <Newspaper className="w-24 h-24 -mr-12 -mt-12 rotate-[-15deg]" />
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <span className="text-[10px] font-black uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 px-3 py-1 rounded-full">
                    AI-generated
                  </span>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase font-bold tracking-widest ml-auto">
                    <Calendar className="w-3 h-3" />
                    {isValid(new Date(article.createdAt))
                      ? format(new Date(article.createdAt), "MMM d, yyyy")
                      : "Date unavailable"}
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
                    {article.summary || article.content}
                  </Typography>

                  <div className="mt-auto pt-6 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/50">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-[10px] font-black uppercase">
                        R
                      </div>
                      <Typography
                        variant="small"
                        className="text-[11px] font-black uppercase tracking-wider truncate max-w-[120px]"
                      >
                        ReadHub AI
                      </Typography>
                    </div>

                    <div className="flex items-center gap-2">
                      {article.sources?.length ? (
                        <span className="text-[10px] text-muted-foreground">
                          {article.sources.length} {article.sources.length === 1 ? "source" : "sources"}
                        </span>
                      ) : null}
                      <div className="bg-zinc-100 dark:bg-zinc-800 p-2 rounded-full group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <ArrowRight className="w-4 h-4" />
                      </div>
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
