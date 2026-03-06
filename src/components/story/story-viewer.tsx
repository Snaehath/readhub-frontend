"use client";

import { useState } from "react";
import { AIStory } from "@/types";
import {
  User,
  Tag,
  BookOpen,
  List,
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
import StoryReview from "./story-review";
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
  onReaderToggle?: (isReading: boolean) => void;
}

export default function StoryViewer({
  story,
  backUrl,
  backText,
  onStoryUpdate,
  onReaderToggle,
}: StoryViewerProps) {
  const [selectedChapter, setSelectedChapterState] = useState<{
    chapterNumber: number;
    title: string;
    content: string;
  } | null>(null);

  const setSelectedChapter = (
    chapter: {
      chapterNumber: number;
      title: string;
      content: string;
    } | null,
  ) => {
    setSelectedChapterState(chapter);
    if (onReaderToggle) onReaderToggle(!!chapter);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"lore" | "chapters">("lore");
  const [isForcing, setIsForcing] = useState(false);
  const [imageError, setImageError] = useState(false);
  const itemsPerPage = 3;
  const { user } = useUserStore();
  const isAdmin = user?.role === "admin";

  const coverBaseUrl = API_BASE_URL.replace("/api", "") + "/covers";

  const handleForceProgress = async () => {
    if (isForcing) return;

    setIsForcing(true);
    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch(`${API_BASE_URL}/story/myStory?force=true`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
        toast.success("Narrative advanced successfully! (Admin Force)");
      } else {
        toast.error("Failed to advance narrative.");
      }
    } catch (_err) {
      console.error("Error forcing progress:", _err);
      toast.error("Error while communicating with the creative agent.");
    } finally {
      setIsForcing(false);
    }
  };

  const [isAdvancing, setIsAdvancing] = useState(false);
  const handleDailyProgress = async () => {
    if (isAdvancing) return;
    setIsAdvancing(true);

    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch(`${API_BASE_URL}/story/myStory`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        const data = await res.json();
        const updatedSummary = data.story;

        // Fetch full content
        const fullRes = await fetch(
          `${API_BASE_URL}/story/${updatedSummary.id || updatedSummary.index}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (fullRes.ok) {
          const fullData = await fullRes.json();
          if (onStoryUpdate) onStoryUpdate(fullData.story);
        }

        toast.success("The narrative agents have been summoned!");
      } else {
        toast.error("The agents are currently dormant.");
      }
    } catch {
      toast.error("Communication interrupted.");
    } finally {
      setIsAdvancing(false);
    }
  };

  if (selectedChapter) {
    return (
      <div className="min-h-screen bg-background animate-in fade-in duration-500">
        {/* Reader Header */}
        <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedChapter(null)}
              className="gap-2 font-bold text-muted-foreground hover:text-muted-foreground/80"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Chapters
            </Button>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="hidden sm:flex font-black text-[10px] uppercase tracking-widest bg-blue-50 text-blue-600 border-blue-100"
              >
                Chapter 0{selectedChapter.chapterNumber}
              </Badge>
            </div>
          </div>
        </div>

        {/* Reader Content */}
        <article className="max-w-3xl mx-auto px-4 py-16 sm:py-24">
          <header className="mb-12 text-center">
            <Typography
              variant="small"
              className="text-blue-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block"
            >
              Part 0{selectedChapter.chapterNumber}
            </Typography>
            <Typography
              variant="h1"
              className="text-4xl sm:text-6xl font-black tracking-tighter mb-6 leading-tight"
            >
              {selectedChapter.title}
            </Typography>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground font-medium italic">
              <Typography variant="small">{story.title}</Typography>
              <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
              <Typography className="text-blue-600" variant="small">
                By {story.authorName}
              </Typography>
            </div>
          </header>

          <div className="prose dark:prose-invert max-w-none">
            <div className="text-xl leading-[1.8] text-foreground/90 space-y-8 first-letter:text-7xl first-letter:font-black first-letter:mr-4 first-letter:float-left first-letter:leading-[1] font-serif">
              {selectedChapter.content.split("\n\n").map((para, i) => (
                <p key={i} className="mb-8">
                  {para}
                </p>
              ))}
            </div>
          </div>

          <footer className="mt-24 pt-12 border-t flex flex-col items-center gap-8">
            <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
              <Sparkles
                className="w-5 h-5"
                style={{
                  stroke: "url(#ai-story-gradient)",
                  fill: "url(#ai-story-gradient)",
                  fillOpacity: 0.2,
                }}
              />
              <Typography variant="p">
                This chapter was crafted independently by our AI Agent.
              </Typography>
            </div>

            <div className="w-full max-w-md mx-auto mt-12">
              <StoryReview
                storyId={story.id || story.index}
                onSuccess={onStoryUpdate}
              />
            </div>
          </footer>
        </article>
      </div>
    );
  }

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

      <div className="grid gap-12 lg:grid-cols-4">
        {/* Sidebar - Hide if in Library mode */}
        {!backUrl && (
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none bg-background/60 backdrop-blur-xl shadow-2xl shadow-violet-500/5 gap-0 py-4">
              <CardHeader className="p-2">
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <List
                      className={`w-4 h-4 ${story.isCompleted ? "text-emerald-500" : "text-violet-500"}`}
                    />
                    Status
                  </div>
                  {story.isCompleted ? (
                    <Badge
                      variant="outline"
                      className="text-[9px] border-emerald-500/30 text-emerald-600 bg-emerald-500/5"
                    >
                      Finished
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-[9px] border-amber-500/30 text-amber-600 bg-amber-500/5 flex items-center gap-1"
                    >
                      <div className="w-1 h-1 rounded-full bg-amber-500 animate-pulse" />{" "}
                      Ongoing
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground font-medium">
                    Progress
                  </span>
                  <span
                    className={`font-bold ${story.isCompleted ? "text-emerald-600" : "text-blue-600"}`}
                  >
                    {story.isCompleted
                      ? "100%"
                      : `${Math.round((story.currentChapterCount / (story.maxChapters || 9)) * 100)}%`}
                  </span>
                </div>
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${story.isCompleted ? "bg-emerald-500" : "bg-linear-to-r from-blue-500 to-violet-500"}`}
                    style={{
                      width: story.isCompleted
                        ? "100%"
                        : `${(story.currentChapterCount / (story.maxChapters || 9)) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground italic leading-tight">
                  {story.isCompleted
                    ? "This narrative is fully realized. Explore the complete collection of chapters above."
                    : "Our AI crafts a new chapter every 24 hours to unfold this narrative."}
                </p>
                {!story.isCompleted && (
                  <div className="pt-2 border-t mt-4 space-y-3">
                    {isAdmin ? (
                      <Button
                        onClick={handleForceProgress}
                        disabled={isForcing}
                        variant="outline"
                        className="w-full text-xs font-black uppercase tracking-widest h-10 border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all gap-1.5"
                      >
                        {isForcing ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Writing...
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-3.5 h-3.5" />
                            Admin: Force Progress
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleDailyProgress}
                        disabled={isAdvancing}
                        variant="outline"
                        className="w-full text-xs font-black uppercase tracking-widest h-10 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-all gap-1.5"
                      >
                        {isAdvancing ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            Summoning...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            Summon New Chapter
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className={backUrl ? "lg:col-span-4" : "lg:col-span-3"}>
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            {/* Tabs Navigation - ONLY IN STORY ID PAGE */}
            {backUrl && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b pb-8">
                <div className="flex bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-[2rem] border border-zinc-200 dark:border-zinc-800">
                  <button
                    onClick={() => setActiveTab("lore")}
                    className={`flex items-center gap-2 px-8 py-3 rounded-[1.8rem] text-xs font-black uppercase tracking-widest transition-all ${
                      activeTab === "lore"
                        ? "bg-white dark:bg-zinc-800 shadow-lg text-blue-600 border border-zinc-200 dark:border-zinc-700"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Sparkles
                      className={`w-3.5 h-3.5 ${activeTab === "lore" ? "text-blue-500" : ""}`}
                    />
                    Lore & Setting
                  </button>
                  <button
                    onClick={() => setActiveTab("chapters")}
                    className={`flex items-center gap-2 px-8 py-3 rounded-[1.8rem] text-xs font-black uppercase tracking-widest transition-all ${
                      activeTab === "chapters"
                        ? "bg-white dark:bg-zinc-800 shadow-lg text-blue-600 border border-zinc-200 dark:border-zinc-700"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <BookOpen
                      className={`w-3.5 h-3.5 ${activeTab === "chapters" ? "text-blue-500" : ""}`}
                    />
                    Chapter Archives
                  </button>
                </div>
              </div>
            )}

            {/* Content Rendering based on Tab */}
            {(!backUrl || activeTab === "chapters") && (
              <section className="animate-in fade-in duration-700">
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
                      <Card
                        key={chapter.chapterNumber}
                        className="group overflow-hidden border-none shadow-xl cursor-pointer flex flex-col bg-background/40 backdrop-blur-sm transition-all hover:bg-background/60 gap-2"
                        onClick={() => setSelectedChapter(chapter)}
                      >
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
                    ))}
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
                            Math.ceil(
                              (story.chapters?.length || 0) / itemsPerPage,
                            ),
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
              </section>
            )}

            {/* 2. Synopsis Section - ONLY SHOW IN LORE TAB OR MAIN VIEW */}
            {backUrl && activeTab === "lore" && (
              <div className="space-y-24 animate-in fade-in duration-700">
                <section>
                  <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground whitespace-nowrap">
                      Synopsis
                    </h2>
                    <div className="h-[1px] w-full bg-linear-to-r from-border/50 to-transparent" />
                  </div>
                  <Typography
                    variant="p"
                    className="text-base sm:text-lg leading-relaxed text-foreground/80 italic font-medium max-w-4xl"
                  >
                    &ldquo;{story.synopsis || story.subject}&rdquo;
                  </Typography>
                </section>

                {/* 3. Dramatis Personae Section */}
                {story.characters && story.characters.length > 0 && (
                  <section>
                    <div className="flex items-center gap-4 mb-8">
                      <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground whitespace-nowrap">
                        Dramatis Personae
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
                            <h3 className="text-xl font-black text-foreground tracking-tight group-hover:text-blue-600 transition-colors">
                              {char.name}
                            </h3>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 text-right">
                              Principal
                            </span>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
