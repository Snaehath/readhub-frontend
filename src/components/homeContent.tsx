"use client";

import Link from "next/link";
import { BookOpen, Bot, Newspaper, Sparkles, type LucideIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useUserStore } from "@/lib/store/userStore";

type Feature = { title: string; description: string; href: string; cta: string; icon: LucideIcon; requiresAuth?: boolean };

const FEATURES: Feature[] = [
  {
    title: "News feed",
    description: "Global and regional headlines by topic, country, and language. Ask AI to explain a story or forecast where it's heading.",
    href: "/news",
    cta: "Browse news",
    icon: Newspaper,
  },
  {
    title: "Book library",
    description: "Search Open Library by title, author, or subject and read available copies online.",
    href: "/library",
    cta: "Explore books",
    icon: BookOpen,
  },
  {
    title: "AI reports",
    description: "Original AI-written articles built from current coverage, with every claim linked to its source.",
    href: "/ai-news",
    cta: "Read reports",
    icon: Sparkles,
  },
  {
    title: "AI assistant",
    description: "Ask about current events and get cited answers, or describe what you like and get book picks.",
    href: "/chatbot",
    cta: "Open assistant",
    icon: Bot,
    requiresAuth: true,
  },
];

export default function HomeContent() {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  return (
    <section className="space-y-14">
      <div className="mx-auto max-w-3xl space-y-6 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">News · Books · AI</p>
        <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl">Catch up, read, and understand</h1>
        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Follow headlines from around the world, discover books, and use AI that cites its sources to get the context behind a story.
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-full rounded-xl sm:w-auto"><Link href="/news">Browse the news</Link></Button>
          <Button asChild size="lg" variant="outline" className="w-full rounded-xl sm:w-auto">
            <Link href={isAuthenticated ? "/chatbot" : "/register"}>{isAuthenticated ? "Ask the assistant" : "Create a free account"}</Link>
          </Button>
        </div>
        {!isAuthenticated && (
          <p className="text-sm text-muted-foreground">News and books are free to browse. An account unlocks the AI tools and saved stories.</p>
        )}
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {FEATURES.map(({ title, description, href, cta, icon: Icon, requiresAuth }) => {
          const locked = requiresAuth && !isAuthenticated;
          return (
            <article key={href} className="flex flex-col rounded-2xl border bg-card p-6 transition-shadow hover:shadow-lg">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="text-xl font-bold tracking-tight">{title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
              <Button asChild variant={locked ? "outline" : "default"} className="mt-6 w-full rounded-xl">
                <Link href={locked ? `/login?next=${encodeURIComponent(href)}` : href}>{locked ? "Sign in to use" : cta}</Link>
              </Button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
