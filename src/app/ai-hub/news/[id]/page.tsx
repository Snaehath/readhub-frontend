"use client";

import { use } from "react";
import useSWR from "swr";
import { ArrowLeft, Share2, Printer, Clock, Hash, BookOpen, ThumbsUp, Newspaper } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/custom/typography";
import { API_BASE_URL } from "@/constants";
import { SingleAiNewsResponse } from "@/types";
import { format } from "date-fns";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const AiNewsPage = ({ params }: { params: Promise<{ id: string }> }) => {
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
      <div className="container mx-auto px-6 py-20 min-h-screen flex flex-col items-center justify-center space-y-4">
        <Typography variant="h2" className="text-2xl font-bold">Article Not Found</Typography>
        <Button asChild variant="outline">
          <Link href="/ai-hub?tab=news">Back to AI News</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-background animate-in fade-in duration-700">
      {/* Article Header Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Button asChild variant="ghost" size="sm" className="gap-2 font-black text-xs uppercase tracking-widest text-muted-foreground hover:text-indigo-600">
            <Link href="/ai-hub?tab=news">
              <ArrowLeft className="w-4 h-4" /> 
              Back to Hub
            </Link>
          </Button>
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" className="rounded-full rounded-2xl"><Share2 className="w-4 h-4" /></Button>
             <Button variant="ghost" size="icon" className="rounded-full rounded-2xl"><Printer className="w-4 h-4" /></Button>
             <div className="w-px h-6 bg-border mx-2" />
             <Button className="rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] uppercase tracking-widest px-6 h-9">Bookmark</Button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-32 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 lg:gap-20">
        {/* Main Content Area */}
        <article className="space-y-10">
          <header className="space-y-8 animate-in slide-in-from-top-4 duration-1000">
            <div className="flex flex-wrap items-center gap-4">
              <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full">
                {news.category || "AI Intel"}
              </span>
              <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase font-black tracking-widest">
                <Clock className="w-3.5 h-3.5" />
                {readTime} Min Read
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-border" />
              <Typography variant="muted" className="text-[10px] uppercase font-black tracking-widest">
                {format(new Date(news.createdAt), "MMMM dd, yyyy")}
              </Typography>
            </div>

            <Typography variant="h1" className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight text-zinc-900 dark:text-zinc-50">
              {news.title}
            </Typography>

            <div className="flex items-center gap-4 pt-6">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-lg font-black uppercase shadow-lg shadow-indigo-500/20">
                {news.authorName.charAt(0)}
              </div>
              <div className="space-y-0.5">
                <Typography variant="small" className="font-black text-xs uppercase tracking-wider block leading-none">
                  {news.authorName}
                </Typography>
                <Typography variant="muted" className="text-[10px] uppercase font-bold tracking-widest block opacity-70 leading-none">
                  Senior Fellow • AI Integrity Division
                </Typography>
              </div>
            </div>
          </header>

          {/* Interactive Stats for Desktop Side (or inline) */}
          <div className="flex flex-wrap items-center gap-6 py-8 border-y border-zinc-100 dark:border-zinc-800/60">
            <div className="flex items-center gap-2 group cursor-pointer">
              <Button variant="ghost" size="sm" className="rounded-full gap-2 font-bold hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/20">
                <ThumbsUp className="w-4 h-4" />
                2.4k
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Hash className="w-4 h-4 text-muted-foreground" />
              <Typography variant="small" className="text-muted-foreground font-bold">{wordCount} Words</Typography>
            </div>
          </div>

          {/* Article Body */}
          <article className="prose prose-zinc dark:prose-invert max-w-none pt-4">
            <div className="text-zinc-700 dark:text-zinc-300 text-lg sm:text-xl leading-relaxed font-serif space-y-8">
               {news.content.split("\n\n").map((para, i) => (
                 <p key={i} className="mb-0">{para}</p>
               ))}
            </div>
          </article>

          {/* Related Tags Pill */}
          {news.hashtags && news.hashtags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-16 border-t border-zinc-100 dark:border-zinc-800/50">
              {news.hashtags.map((tag, i) => (
                <span key={i} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 bg-zinc-100 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 rounded-full hover:bg-indigo-500 hover:text-white transition-colors cursor-pointer">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Sidebar */}
        <aside className="hidden lg:block space-y-12">
          <div className="sticky top-28 space-y-12">
            {/* Metadata Card */}
             <div className="p-8 rounded-[2rem] bg-zinc-900 text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10"><BookOpen className="w-20 h-20 -mr-8 -mt-8 rotate-12" /></div>
                <Typography variant="muted" className="text-[10px] font-black uppercase tracking-[0.25em] text-indigo-400 mb-6 block">AI Analysis</Typography>
                <div className="space-y-6">
                   <div className="space-y-1">
                     <Typography variant="muted" className="text-[9px] uppercase font-black opacity-50 tracking-wider">Synthesis Level</Typography>
                     <Typography variant="p" className="font-black text-sm">High-Fidelity Agentic</Typography>
                   </div>
                   <div className="space-y-1">
                     <Typography variant="muted" className="text-[9px] uppercase font-black opacity-50 tracking-wider">Data Sources</Typography>
                     <Typography variant="p" className="font-black text-sm">Global News Grids</Typography>
                   </div>
                   <div className="space-y-1">
                     <Typography variant="muted" className="text-[9px] uppercase font-black opacity-50 tracking-wider">Integrity Score</Typography>
                     <Typography variant="p" className="font-black text-sm text-green-400">99.4% Validated</Typography>
                   </div>
                </div>
             </div>

             {/* Dynamic Hashtags in Sidebar */}
             {news.hashtags && news.hashtags.length > 0 && (
               <div className="space-y-6">
                 <Typography variant="h4" className="text-[10px] font-black uppercase tracking-[0.2em] border-l-2 border-indigo-600 pl-3">Relevant Nodes</Typography>
                 <div className="flex flex-col gap-3">
                   {news.hashtags.map((tag, i) => (
                      <div key={i} className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 group-hover:scale-150 transition-all" />
                        <Typography variant="small" className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-indigo-600">#{tag}</Typography>
                      </div>
                   ))}
                 </div>
               </div>
             )}
          </div>
        </aside>
      </main>
    </div>
  );
};

export default AiNewsPage;
