"use client";
import Link from "next/link";
import { BookOpen, Newspaper, Sparkles, Bot, Rocket, Zap } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";

export default function HomeContent() {
  return (
    <>
      <section className="relative mb-24 mt-12 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
        {/* Background Ambience */}
        <div
          className="absolute inset-x-0 -top-20 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-40"
          aria-hidden="true"
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3b82f6] to-[#8b5cf6] opacity-10 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </div>

        <div className="text-center max-w-4xl mx-auto px-4 mb-20 space-y-8">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-foreground">
            Your Digital Reading <br className="hidden sm:block" />
            Companion
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto">
            Explore thousands of news articles, dive into timeless e-books, or
            immerse yourself in original AI-generated stories and much more to
            come.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
          {/* News Card */}
          <Card className="group relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-xl hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2 transition-all duration-500">
            <CardHeader className="relative z-10 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 text-foreground transition-all duration-500">
                <Newspaper className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tight">
                Global News
              </CardTitle>
              <CardDescription className="text-base font-medium">
                Real-time worldwide updates
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-muted-foreground leading-relaxed h-20">
                Access thousands of breaking articles from trusted sources
                globally, curated seamlessly in one place.
              </p>
            </CardContent>
            <CardFooter className="relative z-10 pt-4">
              <Button
                asChild
                variant="default"
                className="w-full rounded-xl font-bold transition-all hover:scale-[1.02] shadow-sm"
              >
                <Link href="/news">Browse News</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* E-Books Card */}
          <Card className="group relative overflow-hidden border-border/50 bg-card/40 backdrop-blur-xl hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2 transition-all duration-500">
            <CardHeader className="relative z-10 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 text-foreground transition-all duration-500">
                <BookOpen className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tight">
                E-Book Archive
              </CardTitle>
              <CardDescription className="text-base font-medium">
                Timeless classics & features
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-muted-foreground leading-relaxed h-20">
                Step into an expansive library of digital books across every
                genre. Read anytime, anywhere.
              </p>
            </CardContent>
            <CardFooter className="relative z-10 pt-4">
              <Button
                asChild
                variant="default"
                className="w-full rounded-xl font-bold transition-all hover:scale-[1.02] shadow-sm"
              >
                <Link href="/library">Browse E-Books</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* AI Story Card (Colorful Exception) */}
          <Card className="group relative overflow-hidden border-indigo-500/20 bg-indigo-50/30 dark:bg-indigo-950/20 backdrop-blur-xl hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 opacity-100" />
            <CardHeader className="relative z-10 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                <Sparkles className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tight text-indigo-950 dark:text-indigo-100">
                AI Epics
              </CardTitle>
              <CardDescription className="text-base font-medium text-indigo-700/70 dark:text-indigo-300/70">
                Original autonomous narratives
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-indigo-900/70 dark:text-indigo-200/70 leading-relaxed font-medium h-20">
                Immerse yourself in fully-realized stories generated
                continuously by our specialized AI author agents.
              </p>
            </CardContent>
            <CardFooter className="relative z-10 pt-4">
              <Button
                asChild
                className="w-full rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
              >
                <Link href="/story">Discover Stories</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* AI Features Overview Section */}
      <section className="mb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg text-white">
                <Sparkles className="w-5 h-5" />
              </span>
              Engineered with Intelligence
            </h2>
            <div className="h-[1px] flex-1 bg-linear-to-r from-border/50 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Ask AI */}
            <div className="flex flex-col gap-4 p-8 rounded-[2rem] bg-indigo-50/30 dark:bg-indigo-950/20 border border-indigo-500/10 hover:border-indigo-500/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-900 border border-indigo-100 dark:border-indigo-900 flex items-center justify-center shadow-sm">
                <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Ask AI</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Dive deeper into any news article. Ask AI intelligently scans
                your selected news, automatically extracts core subjects, and
                fetches related contextual articles to provide a comprehensive,
                unbiased explanation of the event.
              </p>
            </div>

            {/* Future AI */}
            <div className="flex flex-col gap-4 p-8 rounded-[2rem] bg-purple-50/30 dark:bg-purple-950/20 border border-purple-500/10 hover:border-purple-500/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-900 border border-purple-100 dark:border-purple-900 flex items-center justify-center shadow-sm">
                <Rocket className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Future AI</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Curious about what happens next? Future AI analyzes the current
                events within a news article and utilizes advanced generative
                logic to predict and simulate potential future headlines and
                outcomes based on real-time data.
              </p>
            </div>

            {/* More to Come */}
            <div className="flex flex-col gap-4 p-8 rounded-[2rem] bg-orange-50/30 dark:bg-orange-950/20 border border-orange-500/10 hover:border-orange-500/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-900 border border-orange-100 dark:border-orange-900 flex items-center justify-center shadow-sm">
                <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">
                Much More To Come
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Artificial Intelligence is evolving rapidly every single day,
                bringing limitless possibilities. As new ideas emerge at
                ReadHub, expect to discover exciting, unannounced AI-powered
                experiences seamlessly integrated into your reading journey.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
