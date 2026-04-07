"use client";

import { useState } from "react";
import useSWR from "swr";
import { AIStory } from "@/types";
import {
  User,
  Tag,
  BookOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Star,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import ReviewModal from "./review-modal";
import { Button } from "@/components/ui/button";
import Typography from "@/components/ui/custom/typography";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserStore } from "@/lib/store/userStore";
import { API_BASE_URL } from "@/constants";
import { getCoverBaseUrl } from "@/lib/utils";
import { toast } from "sonner";
import { Wand2, Loader2 } from "lucide-react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface StoryViewerProps {
  story: AIStory;
  backUrl?: string;
  backText?: string;
  onStoryUpdate?: (updatedStory: AIStory) => void;
}

const StoryViewer = ({
  story,
  backUrl,
  backText,
  onStoryUpdate,
}: StoryViewerProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retriedPng, setRetriedPng] = useState(false);
  const itemsPerPage = 3;
  const { user } = useUserStore();
  const isAdmin = user?.role === "admin";

  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const {
    data: reviewsData,
    isLoading: isLoadingReviews,
    mutate: mutateReviews,
  } = useSWR<{ reviews: AIStory["reviews"] }>(
    `${API_BASE_URL}/ai-hub/story/${story.index || story.id}/reviews`,
    fetcher,
  );

  const reviews = reviewsData?.reviews || [];

  const showGenerationButton = !story.isCompleted && !!user;
  const totalItems =
    (story.chapters?.length || 0) + (showGenerationButton ? 1 : 0);
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  const coverBaseUrl = getCoverBaseUrl();

  const handleGenerateChapter = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    try {
      const token = localStorage.getItem("jwt");
      const endpoint = isAdmin
        ? `${API_BASE_URL}/ai-hub/story/myStory?force=true`
        : `${API_BASE_URL}/ai-hub/story/myStory`;

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
          `${API_BASE_URL}/ai-hub/story/${updatedStory.id || updatedStory.index}`,
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

  const handleRate = (val: number) => {
    setRating(val);
    setIsReviewOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-8">
      {backUrl && (
        <Button
          variant="ghost"
          asChild
          className="mb-8 gap-2 group cursor-pointer rounded-full"
        >
          <Link href={backUrl}>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <Typography variant="small" className="font-bold">
              {backText || "Back"}
            </Typography>
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
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={
                  retriedPng
                    ? `${coverBaseUrl}/cover_${story.id}.png`
                    : story.coverImage ||
                      `${coverBaseUrl}/cover_${story.id}.jpg`
                }
                alt={story.title}
                className="object-contain w-full h-full"
                onError={() => {
                  if (!retriedPng && !story.coverImage) {
                    setRetriedPng(true);
                  } else {
                    setImageError(true);
                  }
                }}
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
                  ReadHub Original
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

              {/* Rating Section */}
              <div className="flex items-center gap-1 bg-background/50 backdrop-blur-sm px-3 py-1.5 rounded-full border shadow-xs">
                <div className="flex items-center gap-0.5 mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => handleRate(star)}
                      className="group transition-transform active:scale-95 focus:outline-hidden cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 transition-all ${
                          star <=
                          (hoveredRating ||
                            rating ||
                            Math.round(
                              story.averageRating ??
                                (story.reviewCount && story.reviewCount > 0
                                  ? (story.ratingSum || 0) / story.reviewCount
                                  : 0),
                            ))
                            ? "text-amber-500 fill-amber-500"
                            : "text-zinc-300 dark:text-zinc-700"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <Typography variant="small" className="text-xs font-black">
                  {(
                    story.averageRating ??
                    (story.reviewCount && story.reviewCount > 0
                      ? (story.ratingSum || 0) / story.reviewCount
                      : 0)
                  ).toFixed(1)}
                </Typography>
                <Typography
                  variant="muted"
                  className="text-xs font-bold uppercase"
                >
                  ({story.reviewCount || 0})
                </Typography>
              </div>
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
                Lore
              </TabsTrigger>
              <TabsTrigger
                value="chapters"
                className="flex items-center gap-2 px-8 py-3 rounded-[1.8rem] text-xs font-black uppercase tracking-widest transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-lg data-[state=active]:text-blue-600 data-[state=active]:border data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-700 data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
              >
                <BookOpen className="w-3.5 h-3.5" />
                Chapters
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="flex items-center gap-2 px-8 py-3 rounded-[1.8rem] text-xs font-black uppercase tracking-widest transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-lg data-[state=active]:text-blue-600 data-[state=active]:border data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-700 data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Reviews
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Content Rendering based on Tab */}
          <TabsContent
            value="chapters"
            className="animate-in fade-in duration-700 mt-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <Typography
                variant="muted"
                className="text-[10px] font-black uppercase tracking-[0.4em] whitespace-nowrap leading-none"
              >
                Chapters
              </Typography>
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
                    href={`/ai-hub/story/${story.index || story.id}/chapter/${chapter.chapterNumber}`}
                    className="block h-full outline-none"
                  >
                    <Card className="h-full group overflow-hidden border-none shadow-xl cursor-pointer flex flex-col bg-background/40 backdrop-blur-sm transition-all hover:bg-background/60 gap-2">
                      {/* Stylized Title Block (Replaces Image) */}
                      <div className="h-48 relative overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center p-6 text-center">
                        <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 via-transparent to-violet-600/10 opacity-50" />
                        <div className="absolute top-4 left-4 text-4xl font-black text-blue-500/40">
                          0{chapter.chapterNumber}
                        </div>
                        <Typography
                          variant="h3"
                          className="relative z-10 text-xl font-black tracking-tight leading-tight bg-linear-to-br from-foreground to-foreground/60 bg-clip-text"
                        >
                          {chapter.title}
                        </Typography>
                      </div>

                      <CardHeader className="px-4 pt-4 pb-0">
                        <Typography
                          variant="muted"
                          className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-1 leading-none"
                        >
                          Entry {chapter.chapterNumber}
                        </Typography>
                        <Typography className="text-sm font-bold line-clamp-1 leading-none">
                          {story.title}: Part {chapter.chapterNumber}
                        </Typography>
                      </CardHeader>

                      <CardContent className="px-4 pt-0 pb-4 flex-1">
                        <Typography
                          variant="muted"
                          className="text-xs line-clamp-3 leading-relaxed italic"
                        >
                          {chapter.content}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                ))}

              {/* Generate Chapter Button Card */}
              {showGenerationButton && currentPage === totalPages && (
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
                      <Typography
                        variant="h3"
                        className="mb-1 text-blue-600 dark:text-blue-400"
                      >
                        {isGenerating
                          ? "Manifesting..."
                          : isAdmin
                            ? "Admin: Force Next Chapter"
                            : "Summon New Chapter"}
                      </Typography>
                      <Typography
                        variant="muted"
                        className="text-xs font-medium"
                      >
                        Trigger the AI Agent to continue the narrative journey.
                      </Typography>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Pagination Controls */}
            {totalItems > itemsPerPage && (
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
                <Typography
                  variant="muted"
                  className="text-xs font-black uppercase tracking-widest leading-none"
                >
                  Page {currentPage} of {totalPages}
                </Typography>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
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
                <Typography
                  variant="muted"
                  className="text-[10px] font-black uppercase tracking-[0.4em] whitespace-nowrap leading-none"
                >
                  Synopsis
                </Typography>
                <div className="h-[1px] w-full bg-linear-to-r from-border/50 to-transparent" />
              </div>
              <Typography className=" sm:text-lg leading-relaxed text-foreground/80 italic font-medium">
                {story.synopsis || story.subject}
              </Typography>
            </section>

            {/* 3. Characters Lore Section */}
            {story.characters && story.characters.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <Typography
                    variant="muted"
                    className="text-[10px] font-black uppercase tracking-[0.4em] whitespace-nowrap leading-none"
                  >
                    Characters
                  </Typography>
                  <div className="h-[1px] w-full bg-linear-to-r from-border/50 to-transparent" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {story.characters?.map((char, i) => (
                    <div
                      key={i}
                      className="bg-zinc-50/50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50 rounded-[2rem] p-8 flex flex-col gap-4 transition-all hover:shadow-md hover:border-blue-500/20 group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Typography
                          variant="h3"
                          className="text-xl font-black text-foreground tracking-tight transition-colors"
                        >
                          {char.name}
                        </Typography>
                      </div>
                      <Typography
                        variant="muted"
                        className="text-sm leading-relaxed font-medium"
                      >
                        {char.description}
                      </Typography>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. World Setting Section */}
            {story.worldBuilding && (
              <section>
                <div className="flex items-center gap-4 mb-8">
                  <Typography
                    variant="muted"
                    className="text-[10px] font-black uppercase tracking-[0.4em] whitespace-nowrap leading-none"
                  >
                    World Setting
                  </Typography>
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

          {/* 5. Reviews Section */}
          <TabsContent
            value="reviews"
            className="animate-in fade-in duration-700 mt-8"
          >
            <div className="flex items-center gap-4 mb-8">
              <Typography
                variant="muted"
                className="text-[10px] font-black uppercase tracking-[0.4em] whitespace-nowrap leading-none"
              >
                Reviews
              </Typography>
              <div className="h-[1px] w-full bg-linear-to-r from-border/50 to-transparent" />
            </div>

            {isLoadingReviews ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <Typography
                  variant="muted"
                  className="text-sm font-black uppercase tracking-widest animate-pulse"
                >
                  Unveiling reader feedback...
                </Typography>
              </div>
            ) : reviews && reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reviews.map((rev, i) => (
                  <Card
                    key={i}
                    className="border-none shadow-xl bg-background/40 backdrop-blur-md rounded-[2rem] overflow-hidden group hover:bg-background/60 transition-all p-8 flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500/20 to-violet-500/20 flex items-center justify-center font-black text-blue-600 text-sm">
                          {(rev.reviewerName || "A")[0].toUpperCase()}
                        </div>
                        <div>
                          <Typography
                            variant="small"
                            className="font-black text-sm text-foreground"
                          >
                            {rev.reviewerName || "Anonymous Reader"}
                          </Typography>
                          <Typography
                            variant="muted"
                            className="text-[10px] font-bold uppercase tracking-wider"
                          >
                            {new Date(rev.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </Typography>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= rev.rating
                                ? "text-amber-500 fill-amber-500"
                                : "text-zinc-200 dark:text-zinc-800"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {rev.review && (
                      <Typography
                        variant="muted"
                        className="text-sm text-foreground/80 leading-relaxed font-medium italic"
                      >
                        &ldquo;{rev.review}&rdquo;
                      </Typography>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-6 bg-zinc-50/50 dark:bg-zinc-900/20 rounded-[3rem] border border-dashed border-zinc-200 dark:border-zinc-800">
                <div className="w-16 h-16 rounded-full bg-background flex items-center justify-center shadow-inner">
                  <MessageSquare className="w-8 h-8 text-zinc-300" />
                </div>
                <div className="space-y-1">
                  <Typography
                    variant="h3"
                    className="text-lg font-black tracking-tight"
                  >
                    No insights yet.
                  </Typography>
                  <Typography
                    variant="muted"
                    className="text-xs font-medium max-w-[240px]"
                  >
                    Be the first to share your journey through this narrative
                    with the world.
                  </Typography>
                </div>
                <Button
                  variant="outline"
                  className="rounded-full px-8 font-black text-xs uppercase tracking-widest border-blue-200 text-blue-600 hover:bg-blue-50"
                  onClick={() => setIsReviewOpen(true)}
                >
                  Post First Review
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <ReviewModal
        isOpen={isReviewOpen}
        onOpenChange={(open) => {
          setIsReviewOpen(open);
          if (!open) setRating(0);
        }}
        story={story}
        rating={rating}
        username={user?.username}
        onSuccess={(updatedStory) => {
          if (onStoryUpdate) onStoryUpdate(updatedStory);
          mutateReviews();
        }}
      />
    </div>
  );
};

export default StoryViewer;
