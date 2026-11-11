"use client";

import { useState } from "react";
import {
  Newspaper,
  Sparkles,
  Loader2,
  ArrowRight,
  Calendar,
  Microscope,
  Clock3,
  ExternalLink,
} from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/custom/typography";
import { API_BASE_URL } from "@/constants";
import { AiNews, AiNewsResponse } from "@/types";
import { useUserStore } from "@/lib/store/userStore";
import { format, isValid } from "date-fns";

function DailyEditionFeature({ article }: { article: AiNews }) {
  const wordCount = article.content.trim().split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 220));
  const editionSources = (article.sources || []).flatMap((source, sourceIndex) => {
    try {
      const parsed = new URL(source.url || "");
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return [];
      return [{ ...source, url: parsed.toString(), citationNumber: source.citationNumber || sourceIndex + 1 }];
    } catch {
      return [];
    }
  });
  const editionDate = new Date(`${article.editionDate}T12:00:00`);
  const isCurrentEdition = article.editionDate === new Date().toISOString().slice(0, 10);

  return (
    <section aria-labelledby="daily-edition-title" className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-5 py-4 sm:px-7">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">{isCurrentEdition ? "Today’s edition" : "Latest daily edition"}</span>
          <span className="text-xs font-medium text-muted-foreground">AI-written · {editionSources.length} sources</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <time dateTime={article.editionDate}>{isValid(editionDate) ? format(editionDate, "EEEE, MMM d") : "Daily edition"}</time>
          <span aria-hidden="true">·</span>
          <Clock3 className="h-3.5 w-3.5" />
          <span>{readMinutes} min read</span>
        </div>
      </div>

      <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.72fr)] lg:gap-10">
        <div className="flex flex-col items-start">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">ReadHub AI · Daily Report Writer</p>
          <h2 id="daily-edition-title" className="text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">{article.title}</h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">{article.summary}</p>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">An AI-written synthesis of published reporting. Follow the source links to check the underlying coverage.</p>
          <Button asChild className="mt-6 rounded-full px-5">
            <Link href={`/ai-news/${article._id}`}>
              Read the full report <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <aside aria-label="Coverage in this edition" className="rounded-2xl border border-border bg-muted/20 p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-foreground">Coverage in this edition</h3>
          {editionSources.length ? (
            <ol className="mt-3 divide-y divide-border">
              {editionSources.map((source) => (
                <li key={`${source.citationNumber}-${source.url}`} className="py-3 first:pt-1 last:pb-1">
                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{source.citationNumber}</span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium leading-5 text-foreground group-hover:text-primary">{source.title || "Open source article"}</span>
                      <span className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        {source.category && <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium capitalize text-primary">{source.category}</span>}
                        {source.sourceName || "Publisher"}
                        {source.publishedAt && isValid(new Date(source.publishedAt)) ? ` · ${format(new Date(source.publishedAt), "MMM d, h:mm a")}` : ""}
                        <ExternalLink aria-hidden="true" className="h-3 w-3" />
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">Source links aren’t available for this edition.</p>
          )}
        </aside>
      </div>
    </section>
  );
}

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
    toast.loading("Writing an AI report from current coverage...", { id: "gen-news" });

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
        toast.success("AI report published.", { id: "gen-news" });
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
  const dailyEdition = articles.find((article) => article.reportType === "daily" && article.editionDate);
  const archiveArticles = articles.filter((article) => article._id !== dailyEdition?._id);

  return (
      <div className="space-y-12">
      {dailyEdition && <DailyEditionFeature article={dailyEdition} />}

      {/* Generate Interface (Admin Only) */}
      {_hasHydrated && user?.role === "admin" && (
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary"><Microscope className="h-5 w-5" /></div>
            <div>
              <h2 className="font-semibold text-foreground">Create a one-off report</h2>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">Write an AI article from current saved coverage. Daily editions publish automatically when the scheduled workflow is configured.</p>
            </div>
          </div>
          <Button onClick={handleGenerateNews} disabled={loading} className="h-11 shrink-0 cursor-pointer rounded-full px-5">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {loading ? "Writing report…" : "Generate report"}
          </Button>
        </div>
      )}

      {/* Articles Grid */}
      <div className="space-y-10">
        {archiveArticles.length > 0 && <div className="flex items-center gap-6">
          <Typography
            variant="muted"
            className="text-xs font-black uppercase tracking-[0.3em] whitespace-nowrap text-indigo-600"
          >
            {dailyEdition ? "Previous reports" : "AI reports"}
          </Typography>
          <div className="h-px w-full bg-indigo-500/10" />
        </div>}

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
              No AI reports have been published yet.
            </Typography>
          </div>
        ) : archiveArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {archiveArticles.map((article) => (
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
                    {article.reportType === "daily" ? "Daily edition" : "AI report"}
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
                        {article.authorName || "ReadHub AI"}
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
        ) : null}
      </div>
    </div>
  );
};

export default AiNewsHub;
