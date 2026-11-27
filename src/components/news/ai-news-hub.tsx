"use client";

import { useState } from "react";
import { ArrowRight, Calendar, Clock3, ExternalLink, Loader2, Microscope, Newspaper, Sparkles } from "lucide-react";
import { apiRequest, fetcher } from "@/lib/api-client";
import useSWR, { mutate } from "swr";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/constants";
import { AiNews, AiNewsResponse } from "@/types";
import { useUserStore } from "@/lib/store/userStore";
import { format, isValid } from "date-fns";
import { Input } from "@/components/ui/input";
import { readMinutes, safeHttpUrl } from "@/lib/utils";
import { AiReportsSkeleton, REPORT_GRID } from "@/components/misc/skeletons";
import AiByline from "./ai-byline";
import AiReportCard from "./ai-report-card";

function DailyEditionFeature({ article }: { article: AiNews }) {
  const editionSources = (article.sources || []).flatMap((source, sourceIndex) => {
    const url = safeHttpUrl(source.url);
    return url ? [{ ...source, url: url.toString(), citationNumber: source.citationNumber || sourceIndex + 1 }] : [];
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
          <span>{readMinutes(article.wordCount)} min read</span>
        </div>
      </div>

      <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.72fr)] lg:gap-10">
        <div className="flex flex-col items-start">
          <div className="mb-4"><AiByline report={article} /></div>
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
  const isAdmin = useUserStore((state) => state.user?.role === "admin");
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState("");

  const aiNewsKey = `${API_BASE_URL}/ai-hub/news/all`;
  const { data, isLoading, error } = useSWR<AiNewsResponse>(
    aiNewsKey,
    fetcher,
  );

  const handleGenerateNews = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTopic = topic.trim();
    if (!isAdmin || !trimmedTopic) return;
    setLoading(true);
    toast.loading("Writing an AI report from saved coverage…", { id: "gen-news" });
    try {
      await apiRequest("/ai-hub/news/trigger", {
        method: "POST",
        body: { topic: trimmedTopic },
        errorMessage: "The report could not be written. Please try again.",
      });
      toast.success("AI report published.", { id: "gen-news" });
      setTopic("");
      void mutate(aiNewsKey);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "The report could not be written.", { id: "gen-news" });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <AiReportsSkeleton />;

  const articles = data?.news || [];
  const dailyEdition = articles.find((article) => article.reportType === "daily" && article.editionDate);
  const archiveArticles = articles.filter((article) => article._id !== dailyEdition?._id);

  return (
    <div className="space-y-12">
      {dailyEdition && <DailyEditionFeature article={dailyEdition} />}

      {isAdmin && (
        <form onSubmit={handleGenerateNews} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5 text-primary"><Microscope className="h-5 w-5" /></div>
            <div>
              <h2 className="font-semibold text-foreground">Write a report</h2>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">Admin only. Enter a topic; the AI researches saved US and India coverage and publishes a cited article.</p>
            </div>
          </div>
          <div className="flex w-full gap-2 lg:max-w-md">
            <Input value={topic} onChange={(event) => setTopic(event.target.value)} maxLength={200} placeholder="e.g. India stock market, AI regulation" aria-label="Report topic" disabled={loading} />
            <Button type="submit" disabled={loading || !topic.trim()} className="h-11 shrink-0 rounded-full px-5">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              {loading ? "Writing…" : "Generate"}
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-10">
        {archiveArticles.length > 0 && (
          <div className="flex items-center gap-6">
            <h2 className="whitespace-nowrap text-xs font-black uppercase tracking-[0.3em] text-primary">
              {dailyEdition ? "Previous reports" : "AI reports"}
            </h2>
            <div className="h-px w-full bg-primary/10" />
          </div>
        )}

        {error ? (
          <div role="alert" className="py-16 text-center space-y-4">
            <p className="text-sm text-muted-foreground">Could not load AI reports. Check your connection and try again.</p>
            <Button variant="outline" onClick={() => mutate(aiNewsKey)}>Try again</Button>
          </div>
        ) : articles.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-dashed bg-muted/40">
              <Newspaper className="h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
            </div>
            <p className="text-sm text-muted-foreground">No AI reports have been published yet.</p>
          </div>
        ) : archiveArticles.length > 0 ? (
          <div className={REPORT_GRID}>
            {archiveArticles.map((article) => <AiReportCard key={article._id} report={article} />)}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default AiNewsHub;
