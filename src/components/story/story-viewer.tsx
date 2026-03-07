"use client";

import { useState } from "react";
import { AIStory } from "@/types";
import {
  User,
  Tag,
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/custom/typography";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStore } from "@/lib/store/userStore";
import { API_BASE_URL } from "@/constants";
import { toast } from "sonner";
import { Wand2, Loader2 } from "lucide-react";
import Image from "next/image";

interface StoryViewerProps {
  story: AIStory;
  backUrl?: string;
  backText?: string;
  onStoryUpdate?: (updatedStory: AIStory) => void;
}

export default function StoryViewer({
  story,
  backUrl,
  backText,
  onStoryUpdate,
}: StoryViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageError, setImageError] = useState(false);
  const itemsPerPage = 3;
  const { user } = useUserStore();
  const isAdmin = user?.role === "admin";

  const coverBaseUrl = API_BASE_URL.replace("/api", "") + "/covers";

  const handleGenerateChapter = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    try {
      const token = localStorage.getItem("jwt");
      const endpoint = isAdmin
        ? `${API_BASE_URL}/story/myStory?force=true`
        : `${API_BASE_URL}/story/myStory`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ storyId: story.id || story.index }),
      });

      if (res.ok) {
        const data = await res.json();
        let updatedStory = data.story;

        // Fetch full content for the updated story
        const fullRes = await fetch(
          `${API_BASE_URL}/story/${updatedStory.id || updatedStory.index}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (fullRes.ok) {
          const fullData = await fullRes.json();
          updatedStory = fullData.story;
        }

        if (onStoryUpdate) onStoryUpdate(updatedStory);
        toast.success(
          isAdmin
            ? "Narrative advanced successfully! (Admin Force)"
            : "A new chapter has been forged!",
        );
      } else {
        toast.error(
          isAdmin
            ? "Failed to advance narrative."
            : "Failed to manifest a new chapter.",
        );
      }
    } catch (_err) {
      console.error("Error generating progress:", _err);
      toast.error("Error while communicating with the creative agent.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-8">
      {backUrl && (
        <Button variant="ghost" asChild className="mb-8 gap-2 group">
          <Link href={backUrl}>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            {backText || "Back"}
          </Link>
        </Button>
      )}
      {/* AI Gradient Definition */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient
            id="ai-story-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="50%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#db2777" />
          </linearGradient>
        </defs>
      </svg>
      {/* Header Section */}
      <div className="relative mb-16 animate-in fade-in slide-in-from-top-8 duration-700">
        <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-end">
          {/* Cover Image */}
          <div className="relative w-48 h-64 sm:w-64 sm:h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-background shrink-0 group">
            {!imageError ? (
              <Image
                src={`${coverBaseUrl}/cover_${story.id}.jpg`}
                alt={story.title}
                fill
                className="object-cover transition-transform group-hover:scale-110 duration-700"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 via-indigo-600/10 to-violet-600/210 flex items-center justify-center">
                <BookOpen className="w-16 h-16 opacity-10" />
              </div>
            )}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-6">
            <div className="flex flex-col items-center sm:items-start gap-4">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 text-blue-600 px-4 py-1"
                >
                  <Sparkles
                    className="w-3 h-3 mr-2 inline"
                    style={{
                      stroke: "url(#ai-story-gradient)",
                      fill: "url(#ai-story-gradient)",
                      fillOpacity: 0.2,
                    }}
                  />{" "}
                  AI Generated Original
                </Badge>
                {story.isCompleted && (
                  <Badge
                    variant="secondary"
                    className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50 font-black uppercase tracking-widest text-[10px]"
                  >
                    Completed
                  </Badge>
                )}
              </div>
              <Typography
                variant="h1"
                className="text-4xl sm:text-5xl font-black tracking-tight leading-tight"
              >
                {story.title}
              </Typography>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm font-medium">
              <Badge
                variant="secondary"
                className="flex items-center gap-1.5 px-4 py-1.5 bg-background shadow-sm border"
              >
                <User className="w-3.5 h-3.5 text-blue-500" />
                {story.authorName}
              </Badge>
              <Badge
                variant="secondary"
                className="flex items-center gap-1.5 px-4 py-1.5 bg-background shadow-sm border"
              >
                <Tag className="w-3.5 h-3.5 text-indigo-500" />
                {story.genre}
              </Badge>
              <Badge
                variant="secondary"
                className="flex items-center gap-1.5 px-4 py-1.5 bg-background shadow-sm border"
              >
                <BookOpen className="w-3.5 h-3.5 text-violet-500" />
                {story.currentChapterCount} / {story.maxChapters} Chapters
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 mt-12">
        <Tabs defaultValue="chapters" className="w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <TabsList className="bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 h-auto">
              <TabsTrigger
                value="lore"
                className="flex items-center gap-2 px-8 py-3 rounded-[1.8rem] text-xs font-black uppercase tracking-widest transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-lg data-[state=active]:text-blue-600 data-[state=active]:border data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-700 data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Lore & Setting
              </TabsTrigger>
              <TabsTrigger
                value="chapters"
                className="flex items-center gap-2 px-8 py-3 rounded-[1.8rem] text-xs font-black uppercase tracking-widest transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-lg data-[state=active]:text-blue-600 data-[state=active]:border data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-700 data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Chapter Archives
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Content Rendering based on Tab */}
          <TabsContent
            value="chapters"
            className="animate-in fade-in duration-700 mt-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground whitespace-nowrap">
                Chapter Archives
              </h2>
              <div className="h-[1px] w-full bg-linear-to-r from-border/50 to-transparent" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {story.chapters
                ?.slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage,
                )
                .map((chapter) => (
                  <Link
                    key={chapter.chapterNumber}
                    href={`/story/${story.index || story.id}/chapter/${chapter.chapterNumber}`}
                    className="block h-full outline-none"
                  >
                    <Card className="h-full group overflow-hidden border-none shadow-xl cursor-pointer flex flex-col bg-background/40 backdrop-blur-sm transition-all hover:bg-background/60 gap-2">
                      {/* Stylized Title Block (Replaces Image) */}
                      <div className="h-48 relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center p-6 text-center">
                        <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 via-transparent to-violet-600/10 opacity-50" />
                        <div className="absolute top-4 left-4 text-4xl font-black text-blue-500/40">
                          0{chapter.chapterNumber}
                        </div>
                        <h3 className="relative z-10 text-xl font-black tracking-tight leading-tight bg-linear-to-br from-foreground to-foreground/60 bg-clip-text">
                          {chapter.title}
                        </h3>
                      </div>

                      <CardHeader className="px-4 pt-4 pb-0">
                        <div className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1">
                          Entry {chapter.chapterNumber}
                        </div>
                        <CardTitle className="text-sm font-bold line-clamp-1">
                          {story.title}: Part {chapter.chapterNumber}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="px-4 pt-0 pb-4 flex-1">
                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed italic">
                          {chapter.content}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}

              {/* Generate Chapter Button Card */}
              {!story.isCompleted && user && (
                <Card
                  className="group overflow-hidden border-2 border-dashed border-blue-500/30 shadow-sm cursor-pointer flex flex-col items-center justify-center bg-blue-50/10 dark:bg-blue-900/10 transition-all hover:bg-blue-50/30 dark:hover:bg-blue-900/30 min-h-[16rem]"
                  onClick={handleGenerateChapter}
                >
                  <div className="flex flex-col items-center text-center p-6 gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                      {isGenerating ? (
                        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
                      ) : isAdmin ? (
                        <Wand2 className="w-6 h-6 text-blue-600" />
                      ) : (
                        <Sparkles className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-black tracking-tight text-blue-600 dark:text-blue-400 mb-1">
                        {isGenerating
                          ? "Manifesting..."
                          : isAdmin
                            ? "Admin: Force Next Chapter"
                            : "Summon New Chapter"}
                      </h3>
                      <p className="text-xs text-muted-foreground font-medium">
                        Trigger the AI Agent to continue the narrative journey.
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Pagination Controls */}
            {story.chapters && story.chapters.length > itemsPerPage && (
              <div className="flex items-center justify-center gap-4 pt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-full px-4 font-bold border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-30"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <div className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                  Page {currentPage} of{" "}
                  {Math.ceil((story.chapters?.length || 0) / itemsPerPage)}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        Math.ceil((story.chapters?.length || 0) / itemsPerPage),
                        prev + 1,
                      ),
                    )
                  }
                  disabled={
                    currentPage ===
                    Math.ceil((story.chapters?.length || 0) / itemsPerPage)
                  }
                  className="rounded-full px-4 font-bold border-blue-200 text-blue-600 hover:bg-blue-50 disabled:opacity-30"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}
          </TabsContent>

          {/* 2. Synopsis Section - ONLY SHOW IN LORE TAB OR MAIN VIEW */}
          <TabsContent
            value="lore"
            className="space-y-24 animate-in fade-in duration-700 mt-8"
          >
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground whitespace-nowrap">
                  Synopsis
                </h2>
                <div className="h-[1px] w-full bg-linear-to-r from-border/50 to-transparent" />
              </div>
              <Typography className=" sm:text-lg leading-relaxed text-foreground/80 italic font-medium">
                &ldquo;{story.synopsis || story.subject}&rdquo;
              </Typography>
            </section>

            {/* 3. Characters Lore Section */}
            {story.characters && story.characters.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground whitespace-nowrap">
                    Characters
                  </h2>
                  <div className="h-[1px] w-full bg-linear-to-r from-border/50 to-transparent" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {story.characters?.map((char, i) => (
                    <div
                      key={i}
                      className="bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50 rounded-[2rem] p-8 flex flex-col gap-4 transition-all hover:shadow-md hover:border-blue-500/20 group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-black text-foreground tracking-tight transition-colors">
                          {char.name}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                        {char.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. World Setting Section */}
            {story.worldBuilding && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground whitespace-nowrap">
                    World Setting
                  </h2>
                  <div className="h-[1px] w-full bg-linear-to-r from-border/50 to-transparent" />
                </div>
                <div className="bg-orange-50/20 dark:bg-orange-950/5 border border-orange-100/30 dark:border-orange-900/10 rounded-[2.5rem] p-8 sm:p-14 shadow-sm">
                  <Typography
                    variant="p"
                    className="text-sm sm:text-base leading-relaxed text-foreground/70 font-medium"
                  >
                    {story.worldBuilding}
                  </Typography>
                </div>
              </section>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
