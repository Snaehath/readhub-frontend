"use client";
import Link from "next/link";
import { BookOpen, Newspaper, Sparkles, Bot, Rocket } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useUserStore } from "@/lib/store/userStore";

export default function HomeContent() {
  const user = useUserStore((state) => state.user);

  return (
    <>
      <section className="relative mb-24 mt-12 w-full animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="text-center max-w-4xl mx-auto px-4 mb-14 space-y-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
            News · Books · AI research
          </p>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-foreground">
            Catch up, read, and explore
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Follow headlines from the US and India, discover books, and explore
            research reports and AI tools in one place.
          </p>

          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Button asChild size="lg" className="w-full rounded-xl sm:w-auto">
              <Link href="/news">Browse the news</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full rounded-xl sm:w-auto">
              <Link href="/library">Explore books</Link>
            </Button>
          </div>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground">
            Browse news and books without an account. Sign in to use the AI
            Assistant, get article insights, and save stories.
          </p>
          {!user && (
            <Link
              href="/register"
              className="inline-flex text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              Create a free account for AI tools
            </Link>
          )}
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
          {/* News Card */}
          <Card className="group relative flex h-full flex-col overflow-hidden border-border/50 bg-card/40 backdrop-blur-xl hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2 transition-all duration-500">
            <CardHeader className="relative z-10 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 text-foreground transition-all duration-500">
                <Newspaper className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tight">
                News Feed
              </CardTitle>
              <CardDescription className="min-h-12 text-base font-medium">
                Recent headlines from the US and India
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-muted-foreground leading-relaxed min-h-[5rem]">
                Browse headlines by region and topic, search stories, and
                open the original publisher source.
              </p>
            </CardContent>
            <CardFooter className="relative z-10 mt-auto pt-4">
              <Button
                asChild
                variant="default"
                className="h-10 w-full rounded-xl font-bold transition-all hover:scale-[1.02] shadow-sm"
              >
                <Link href="/news">Browse News</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Books Card */}
          <Card className="group relative flex h-full flex-col overflow-hidden border-border/50 bg-card/40 backdrop-blur-xl hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2 transition-all duration-500">
            <CardHeader className="relative z-10 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mb-4 text-foreground transition-all duration-500">
                <BookOpen className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tight">
                E-Book Archive
              </CardTitle>
              <CardDescription className="min-h-12 text-base font-medium">
                Find books and available reading links
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 flex-1">
              <p className="text-muted-foreground leading-relaxed min-h-[5rem]">
                Browse popular fiction or search the catalog. Reading links
                appear when a copy is available.
              </p>
            </CardContent>
            <CardFooter className="relative z-10 mt-auto pt-4">
              <Button
                asChild
                variant="default"
                className="h-10 w-full rounded-xl font-bold transition-all hover:scale-[1.02] shadow-sm"
              >
                <Link href="/library">Browse books</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* AI Reports Card */}
          <Card className="group relative flex h-full flex-col overflow-hidden border-border/50 bg-card/40 backdrop-blur-xl hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2 transition-all duration-500">
            {/* <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-pink-500/10 opacity-100" /> */}
            <CardHeader className="relative z-10 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-4 text-white shadow-lg transition-transform duration-500">
                <Sparkles className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tight text-indigo-950 dark:text-indigo-100">
                AI Reports
              </CardTitle>
              <CardDescription className="min-h-12 text-base font-medium">
                AI-generated research reports
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 flex-1">
              <p className="text-muted-foreground leading-relaxed min-h-[5rem]">
                Read published AI research reports with source links. Sign in
                to start a new investigation.
              </p>
            </CardContent>
            <CardFooter className="relative z-10 mt-auto pt-4">
              <Button
                asChild
                className="h-10 w-full rounded-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0 shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02]"
              >
                <Link href="/ai-news">Read AI Reports</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* AI Assistant Card */}
          <Card className="group relative flex h-full flex-col overflow-hidden border-border/50 bg-card/40 backdrop-blur-xl hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2 transition-all duration-500">
            <CardHeader className="relative z-10 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-100 flex items-center justify-center mb-4 text-white dark:text-zinc-900">
                <Bot className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-black tracking-tight">
                AI Assistant
              </CardTitle>
              <CardDescription className="min-h-12 text-base font-medium">
                Ask about news or find a book
              </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10 flex-1">
              <p className="text-muted-foreground leading-relaxed min-h-[5rem]">
                Get source-backed context on current stories or recommendations
                from the ReadHub book catalog. Sign-in required.
              </p>
            </CardContent>
            <CardFooter className="relative z-10 mt-auto pt-4">
              <Button asChild variant="outline" className="h-10 w-full rounded-xl font-bold">
                <Link href={user ? "/chatbot" : "/login"}>
                  {user ? "Open AI Assistant" : "Sign in to use AI"}
                </Link>
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
              What you can do with ReadHub
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
                Ask for a summary or background on a story using the news
                context available in ReadHub.
              </p>
            </div>

            {/* Future AI */}
            <div className="flex flex-col gap-4 p-8 rounded-[2rem] bg-purple-50/30 dark:bg-purple-950/20 border border-purple-500/10 hover:border-purple-500/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-900 border border-purple-100 dark:border-purple-900 flex items-center justify-center shadow-sm">
                <Rocket className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">Future AI</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Explore possible outcomes based on an article. Treat these
                scenarios as ideas, not predictions.
              </p>
            </div>

            {/* More to Come */}
            <div className="flex flex-col gap-4 p-8 rounded-[2rem] bg-orange-50/30 dark:bg-orange-950/20 border border-orange-500/10 hover:border-orange-500/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-white dark:bg-zinc-900 border border-orange-100 dark:border-orange-900 flex items-center justify-center shadow-sm">
                <BookOpen className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <h3 className="text-xl font-bold tracking-tight">
                Book recommendations
              </h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Tell the assistant what you enjoy and get recommendations from
                the ReadHub catalog.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
