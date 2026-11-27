"use client";

import { use, useState } from "react";
import useSWR from "swr";
import {
  ArrowLeft,
  Share2,
  ExternalLink,
  Check,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/constants";
import { SingleAiNewsResponse } from "@/types";
import { format, isValid } from "date-fns";
import { fetcher } from "@/lib/api-client";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { linkCitations, readMinutes, safeHttpUrl } from "@/lib/utils";
import { AiReportArticleSkeleton } from "@/components/misc/skeletons";
import AiByline from "./ai-byline";

export const NewsView = ({ params }: { params: Promise<{ id: string }> }) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const [isCopied, setIsCopied] = useState(false);

  const { data, isLoading, error } = useSWR<SingleAiNewsResponse>(
    id ? `${API_BASE_URL}/ai-hub/news/${id}` : null,
    fetcher,
  );

  const news = data?.news;
  const linkedSources = (news?.sources ?? []).flatMap((source, sourceIndex) => {
    const parsed = safeHttpUrl(source.url);
    return parsed ? [{ ...source, citationNumber: source.citationNumber || sourceIndex + 1, safeUrl: parsed.toString(), host: parsed.hostname }] : [];
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

  // Drop a leading H1 that repeats the page title, then link [n] citations to the source list.
  const body = (news?.content || "").replace(/^# .*\n?/, "").trim();
  const filteredContent = linkCitations(body, linkedSources.map((source) => source.citationNumber), "report-source");
  const wordCount = body ? body.split(/\s+/).length : 0;
  const readTime = readMinutes(wordCount);
  const createdAt = news ? new Date(news.createdAt) : null;

  if (isLoading) return <AiReportArticleSkeleton />;

  if (error || !news) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-2xl font-bold">Report not found</h1>
        <Button asChild variant="outline">
          <Link href="/ai-news">Back to AI Reports</Link>
        </Button>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-5 pb-24 pt-6 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="-ml-3 gap-2 text-muted-foreground">
          <Link href="/ai-news">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All reports
          </Link>
        </Button>
        <Button variant="ghost" size="sm" onClick={handleShare} className="gap-2 text-muted-foreground">
          {isCopied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Share2 className="h-4 w-4" aria-hidden="true" />}
          {isCopied ? "Link copied" : "Share"}
        </Button>
      </div>

      <article>
        <header className="space-y-5 border-b pb-8">
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
              {news.reportType === "daily" ? "Daily edition" : "AI report"}
            </span>
            {createdAt && isValid(createdAt) && <time dateTime={news.createdAt}>{format(createdAt, "MMMM d, yyyy")}</time>}
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{readTime} min read</span>
          </p>
          <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl">{news.title}</h1>
          {news.summary && <p className="text-lg leading-relaxed text-muted-foreground">{news.summary}</p>}
          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <AiByline report={news} size="lg" showBio />
            <p className="text-xs text-muted-foreground sm:max-w-[16rem] sm:text-right">
              Written by AI from {linkedSources.length || "the"} linked {linkedSources.length === 1 ? "source" : "sources"}. Verify important details there.
            </p>
          </div>
        </header>

        <div className="prose prose-zinc mt-8 max-w-none dark:prose-invert sm:prose-lg prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary">
          <ReactMarkdown
            components={{
              a: ({ href, children }) =>
                href?.startsWith("#report-source-") ? (
                  <a href={href} aria-label={`Source ${children}`} className="font-semibold no-underline hover:underline">[{children}]</a>
                ) : (
                  <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
                ),
            }}
          >
            {filteredContent}
          </ReactMarkdown>
        </div>

        <footer className="mt-12 border-t pt-8">
          <section aria-labelledby="report-sources-heading">
            <h2 id="report-sources-heading" className="text-lg font-bold">Sources</h2>
            {linkedSources.length ? (
              <ol className="mt-4 space-y-2">
                {linkedSources.map((source, index) => (
                  <li key={`${source.safeUrl}-${index}`} id={`report-source-${source.citationNumber}`} className="scroll-mt-24">
                    <a
                      href={source.safeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 rounded-xl border bg-card px-4 py-3 text-sm transition-colors hover:border-primary/50"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">{source.citationNumber}</span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium group-hover:text-primary">{source.title || "Open source article"}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{source.sourceName || source.host}</span>
                      </span>
                      <ExternalLink aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    </a>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Source links were not saved for this report.</p>
            )}
          </section>
        </footer>
      </article>
    </main>
  );
};

export default NewsView;
