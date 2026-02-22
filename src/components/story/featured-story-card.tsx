"use client";

import { useEffect, useState } from "react";
import { AIStory } from "@/types";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ArrowRight, BookOpen } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/custom/typography";

export default function FeaturedStorySection() {
  const [story, setStory] = useState<AIStory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          setLoading(false);
          return;
        }

        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://readhub-backend.onrender.com/api";

        const res = await fetch(`${baseUrl}/story/myStory`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (res.ok) {
          const data = await res.json();
          setStory(data.story);
        }
      } catch (error) {
        console.error("Error fetching featured story:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, []);

  if (loading || !story) return null;

  return (
    <section className="mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* AI Gradient Definition */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="ai-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex items-center justify-between mb-6">
        <Typography
          variant="h2"
          className="text-xl font-bold tracking-tight flex items-center gap-2"
        >
          AI Serial{" "}
          <Sparkles
            className="w-5 h-5"
            style={{
              stroke: "url(#ai-gradient)",
              fill: "url(#ai-gradient)",
              fillOpacity: 0.1,
            }}
          />
        </Typography>
        <Link href="/story" className="group transition-colors">
          <Typography
            variant="small"
            className="font-semibold text-muted-foreground group-hover:text-foreground flex items-center gap-1"
          >
            Explore All
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Typography>
        </Link>
      </div>

      <Link href="/story" className="block group">
        <Card className="overflow-hidden border shadow-sm transition-colors hover:bg-muted/50">
          <div className="grid md:grid-cols-5">
            {/* Typographic Header Block */}
            <div className="md:col-span-2 relative h-44 md:h-auto bg-linear-to-br from-blue-600/15 via-indigo-600/5 to-violet-600/15 flex items-center justify-center p-8 border-r overflow-hidden">
              {/* Background Decorative Icon */}
              <div className="absolute -top-4 -right-4 p-4 opacity-20 transform scale-125">
                <BookOpen
                  className="w-32 h-32 rotate-12"
                  style={{
                    stroke: "url(#ai-gradient)",
                    fill: "url(#ai-gradient)",
                    fillOpacity: 0.05,
                  }}
                />
              </div>

              <div className="relative z-10 text-center">
                <Badge
                  variant="outline"
                  className="mb-3 uppercase text-[10px] tracking-[0.2em] font-black border-2 border-primary/20 bg-background/50"
                >
                  Original Series
                </Badge>
                <Typography
                  variant="h3"
                  className="text-2xl md:text-3xl font-black tracking-tight leading-tight mb-2"
                >
                  {story.title}
                </Typography>
                <Typography
                  variant="small"
                  className="font-black tracking-widest uppercase text-[10px] bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                >
                  By {story.authorName}
                </Typography>
              </div>
            </div>

            {/* Content Preview */}
            <div className="md:col-span-3 p-6 flex flex-col justify-center">
              <CardHeader className="p-0 mb-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <Typography
                    variant="small"
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Chapter {story.currentChapterCount}
                  </Typography>
                </div>
                <Typography
                  variant="h4"
                  className="text-lg font-bold italic leading-tight text-foreground/90"
                >
                  &quot;{story.subject}&quot;
                </Typography>
              </CardHeader>

              <CardContent className="p-0 mb-4">
                <Typography
                  variant="p"
                  className="text-sm text-muted-foreground leading-relaxed line-clamp-2 font-medium"
                >
                  {story.chapters?.[story.chapters.length - 1]?.content ||
                    "Your narrative journey is unfolding. New chapters are crafted daily by our AI agent."}
                </Typography>
              </CardContent>

              <CardFooter className="p-0">
                <Button size="sm" className="rounded-md font-bold">
                  Keep Reading
                </Button>
              </CardFooter>
            </div>
          </div>
        </Card>
      </Link>
    </section>
  );
}
