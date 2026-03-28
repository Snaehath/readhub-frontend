"use client";

import { use } from "react";
import useSWR from "swr";
import { ArrowLeft, Share2, Printer, Clock, Hash, BookOpen, Bookmark, ThumbsUp, Newspaper } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/custom/typography";
import { API_BASE_URL } from "@/constants";
import { SingleAiNewsResponse } from "@/types";
import { format } from "date-fns";
import { toast } from "sonner";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function AiNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { data, isLoading, error } = useSWR<SingleAiNewsResponse>(
    `${API_BASE_URL}/ai-hub/news/${id}`,
    fetcher
  );

  const news = data?.news;

  const wordCount = news ? news.content.trim().split(/\s+/).length : 0;
  const readTime = Math.ceil(wordCount / 238); // avg reading speed 238 wpm

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-20 min-h-screen flex flex-col items-center justify-center space-y-4">
         <Newspaper className="w-12 h-12 text-indigo-600 animate-pulse" />
         <Typography variant="muted" className="animate-pulse">Retrieving Article...</Typography>
      </div>
    );
  }

  if (error || !news) {
    return (
      <div className="container mx-auto px-6 py-20 min-h-screen text-center">
         <Typography variant="h2" className="text-3xl font-black mb-4">Article Not Found</Typography>
         <Typography variant="p" className="text-muted-foreground mb-8">This article may have been archived or removed.</Typography>
         <Button asChild className="rounded-full px-8">
            <Link href="/ai-hub" className="gap-2"><ArrowLeft className="w-4 h-4" /> Back to Hub</Link>
         </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 pb-24">
      {/* Article Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 py-12">
        <div className="container mx-auto px-4 max-w-4xl space-y-10">
           <Button asChild variant="ghost" className="rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 gap-2 mb-2">
              <Link href="/ai-hub">
                <ArrowLeft className="w-4 h-4" /> Back to AI Hub
              </Link>
           </Button>

           <div className="space-y-6">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 rounded-full">
                  {news.category || "General"}
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full">
                  {news.topic}
                </span>
              </div>
              
              <Typography variant="h1" className="text-4xl sm:text-6xl font-black leading-[1.1] tracking-tight text-balance">
                {news.title}
              </Typography>

              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center font-black text-xs uppercase">
                       {news.authorName.charAt(0)}
                    </div>
                    <div className="space-y-0.5">
                       <p className="text-sm font-black uppercase tracking-wider">{news.authorName}</p>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase">{format(new Date(news.createdAt), "MMMM d, yyyy")}</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-4 ml-auto">
                    <Button variant="outline" size="icon" className="rounded-full border-zinc-200 dark:border-zinc-800" onClick={() => toast.success("Link copied to clipboard!")}>
                       <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-full border-zinc-200 dark:border-zinc-800" onClick={() => window.print()}>
                       <Printer className="w-4 h-4" />
                    </Button>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Article Body */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
           {/* Sidebar - Interactions */}
           <div className="lg:col-span-1 flex lg:flex-col items-center justify-center lg:justify-start gap-6 lg:sticky lg:top-24 h-fit py-4">
              <div className="flex flex-col items-center gap-1 group">
                 <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 group-hover:text-red-600 transition-all">
                    <ThumbsUp className="w-6 h-6" />
                 </Button>
                 <span className="text-[10px] font-black text-muted-foreground uppercase">Like</span>
              </div>
              <div className="flex flex-col items-center gap-1 group">
                 <Button variant="ghost" size="icon" className="rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/30 group-hover:text-blue-600 transition-all">
                    <Bookmark className="w-6 h-6" />
                 </Button>
                 <span className="text-[10px] font-black text-muted-foreground uppercase">Save</span>
              </div>
           </div>

           {/* Content */}
           <div className="lg:col-span-8 space-y-12">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 p-8 sm:p-12 rounded-[2.5rem]">
                 <div className="max-w-none prose prose-zinc dark:prose-invert 
                  prose-p:text-lg prose-p:leading-relaxed prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-p:mb-6
                  prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100">
                    <ReactMarkdown>{news.content}</ReactMarkdown>
                 </div>
              </div>

              {/* Author Footer */}
              <div className="bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-10 rounded-[2.5rem] flex flex-col md:flex-row gap-8 items-center md:items-start">
                  <div className="w-20 h-20 bg-indigo-600 text-white rounded-3xl flex items-center justify-center text-4xl font-black shrink-0">
                    {news.authorName.charAt(0)}
                  </div>
                  <div className="space-y-3 text-center md:text-left">
                     <Typography variant="h4" className="text-xl font-black">About {news.authorName}</Typography>
                     <p className="text-muted-foreground leading-relaxed">
                        {news.authorName} is an AI-generated journalist identity powered by the ReadHub Neural Network.
                        All articles are synthesized from global data signals and are intended as analytical readings rather than verified reporting.
                     </p>
                  </div>
              </div>
           </div>

           {/* Sidebar - Metadata */}
           <div className="lg:col-span-3 space-y-6">
              <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl space-y-6">
                 <Typography variant="h4" className="text-xs font-black uppercase tracking-widest text-zinc-400">Article Info</Typography>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">Read Time</span>
                       </div>
                       <span className="text-sm font-black">{readTime} min</span>
                    </div>
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2 text-muted-foreground">
                          <BookOpen className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">Words</span>
                       </div>
                       <span className="text-sm font-black">{wordCount.toLocaleString()}</span>
                    </div>
                 </div>

                 {news.hashtags && news.hashtags.length > 0 && (
                    <div className="space-y-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                       <div className="flex items-center gap-2 text-muted-foreground">
                          <Hash className="w-4 h-4" />
                          <span className="text-xs font-black uppercase tracking-widest">Tags</span>
                       </div>
                       <div className="flex flex-wrap gap-2">
                          {news.hashtags.map((tag) => (
                             <span key={tag} className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                                {tag}
                             </span>
                          ))}
                       </div>
                    </div>
                 )}
              </div>

              <div className="bg-indigo-600 p-6 rounded-3xl text-white space-y-3">
                 <Typography variant="h4" className="text-xs font-black uppercase tracking-widest text-indigo-200">AI Disclaimer</Typography>
                 <p className="text-sm leading-relaxed text-indigo-50 font-medium">
                    This article is fully generated by artificial intelligence. While it references plausible data and trends, it should be read as an analytical synthesis rather than verified reporting.
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
