"use client";

import { useState, useEffect, Suspense } from "react";
import { Sparkles, Lock, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { StoryLibraryLoader as StoryLibrary } from "@/components/misc/card-loader";
import Typography from "@/components/ui/custom/typography";
import { API_BASE_URL } from "@/constants";
import { useUserStore } from "@/lib/store/userStore";
import { toast } from "sonner";
import { fetcher } from "@/lib/fetcher";
import useSWR, { mutate } from "swr";
import { AllStoriesResponse } from "@/types";
import { Input } from "@/components/ui/input";
import AiNewsHub from "@/components/news/ai-news-hub";
import NewBadge from "@/components/ui/custom/new-badge";
import { useRouter, useSearchParams } from "next/navigation";

const HubContent = () => {
  const { user } = useUserStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<"stories" | "news">("stories");
  const [isTriggeing, setIsTriggeing] = useState(false);
  const [suggestion, setSuggestion] = useState("");

  // Sync tab with URL on load/change
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "news" || tab === "stories") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: "stories" | "news") => {
    setActiveTab(tab);
    router.push(`/ai-hub?tab=${tab}`, { scroll: false });
  };

  const { data: allData, isLoading } = useSWR<AllStoriesResponse>(
    `${API_BASE_URL}/ai-hub/story/allStories`,
    fetcher,
    { revalidateOnFocus: false },
  );

  const hasOngoingStory = allData?.stories?.some((s) => !s.isCompleted);

  const handleJoinNarrative = async () => {
    if (!user) return;
    setIsTriggeing(true);
    try {
      const token = localStorage.getItem("jwt");
      const res = await fetch(`${API_BASE_URL}/ai-hub/story/myStory`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: suggestion }),
      });

      if (res.ok) {
        toast.success("Joined the Narrative Hub!");
        toast.success("The narrative agents have been summoned!");
        mutate(`${API_BASE_URL}/ai-hub/story/allStories`);
        setSuggestion("");
      } else {
        toast.error("The agents are currently dormant.");
      }
    } catch {
      toast.error("Communication interrupted.");
    } finally {
      setIsTriggeing(false);
    }
  };

  return (
    <div className="container mx-auto pb-20 pt-10 px-4 sm:px-8">
      {/* Hub Header */}
      <div className="flex flex-col items-center mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <Typography
          variant="h1"
          className="text-4xl sm:text-5xl font-black mb-3 text-primary"
        >
          AI Hub
        </Typography>
        <Typography
          variant="p"
          className="text-muted-foreground max-w-2xl text-lg font-medium"
        >
          Where creative narratives meet factual intelligence. Access advanced
          AI-generated content tailored for you.
        </Typography>
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <button
            onClick={() => handleTabChange("stories")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "stories"
                ? "bg-white dark:bg-zinc-800 text-primary shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI Stories
          </button>
          <button
            onClick={() => handleTabChange("news")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "news"
                ? "bg-white dark:bg-zinc-800 text-primary shadow-sm ring-1 ring-zinc-200 dark:ring-zinc-700"
                : "text-muted-foreground hover:text-primary"
            }`}
          >
            <Newspaper className="w-4 h-4" />
            AI News
            <NewBadge />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {activeTab === "stories" ? (
          <div className="animate-in fade-in slide-in-from-left-8 duration-700">
            {/* Call to Action Section (Logged out wrapper) */}
            {!user ? (
              <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-card/40 backdrop-blur-md rounded-[2.5rem] border border-border/50 shadow-sm mb-12">
                <div className="bg-blue-50 dark:bg-blue-950/30 p-5 rounded-full mb-6 relative group">
                  <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400 relative z-10" />
                </div>
                <Typography variant="h2" className="text-3xl font-black mb-3">
                  AI Story Locked
                </Typography>
                <Typography
                  variant="p"
                  className="text-muted-foreground text-base max-w-md mb-8 leading-relaxed"
                >
                  Login to access AI creation mode. Where AI generates the
                  story.
                </Typography>
                <Button size={"lg"} asChild>
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            ) : null}

            <StoryLibrary />

            {/* Forge New Story form, shown below library, only if logged in and no ongoing history */}
            {user && !isLoading && !hasOngoingStory && (
              <div className="mt-16 flex flex-col items-center justify-center py-10 px-6 sm:px-12 text-center bg-linear-to-br from-blue-600/5 via-indigo-600/5 to-violet-600/5 backdrop-blur-md rounded-[2.5rem] border border-blue-500/10 shadow-sm animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="mb-6 max-w-xl">
                  <Typography
                    variant="h2"
                    className="text-2xl font-black tracking-tight mb-2"
                  >
                    Shape the Next Epic
                  </Typography>
                  <Typography
                    variant="p"
                    className="text-muted-foreground text-sm leading-relaxed"
                  >
                    Our archive is fully updated. Suggest a core concept to
                    trigger the agents to write the next daily narrative.
                  </Typography>
                </div>

                <div className="flex flex-col sm:flex-row w-full max-w-lg gap-3">
                  <Input
                    type="text"
                    placeholder="What should the agents write next?"
                    value={suggestion}
                    onChange={(e) => setSuggestion(e.target.value)}
                    className="rounded-full bg-background border border-muted-foreground/30 focus-visible:ring-blue-500 focus-visible:border-blue-500 px-6 h-12 flex-grow shadow-inner text-sm"
                  />
                  <Button
                    onClick={handleJoinNarrative}
                    disabled={isTriggeing || !suggestion.trim()}
                    className="rounded-full px-8 h-12 font-bold shadow-md transition-all hover:scale-105 active:scale-95 bg-linear-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 gap-2 shrink-0 text-white"
                  >
                    {isTriggeing ? (
                      "Forging..."
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 fill-white/20" />
                        Forge
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <AiNewsHub />
        )}
      </div>
    </div>
  );
};

export const HubView = () => {
  return (
    <Suspense fallback={
      <div className="container mx-auto pb-20 pt-10 px-4 sm:px-8 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4" />
        <p className="text-muted-foreground animate-pulse font-medium text-sm uppercase tracking-widest">Initialising AI Hub...</p>
      </div>
    }>
      <HubContent />
    </Suspense>
  );
};

export default HubView;
