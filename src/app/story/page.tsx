"use client";

import { useState } from "react";
import { AIStory, StoryResponse } from "@/types";
import { Sparkles, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StoryViewer from "@/components/story/story-viewer";
import StoryLibrary from "@/components/story/story-library";
import Typography from "@/components/ui/custom/typography";
import { API_BASE_URL } from "@/constants";
import { useUserStore } from "@/lib/store/userStore";
import { toast } from "sonner";
import { AllStoriesResponse } from "@/types";

import useSWR, { mutate } from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const fetcherWithAuth = async (url: string) => {
  const token = localStorage.getItem("jwt");
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, { headers });
  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data.",
    ) as Error & { status?: number };
    error.status = res.status;
    throw error;
  }
  return res.json();
};

export default function StoryPage() {
  const [isReading, setIsReading] = useState(false);
  const { user } = useUserStore();
  const [isTriggeing, setIsTriggeing] = useState(false);

  // 1. Fetch discovery list from allStories (GET)
  const { data: allData, isLoading: allStoriesLoading } =
    useSWR<AllStoriesResponse>(`${API_BASE_URL}/story/allStories`, fetcher, {
      revalidateOnFocus: false,
    });

  // Identify the active global story (the latest one that's not completed)
  const activeStorySummary = allData?.stories?.find((s) => !s.isCompleted);
  const storyId = activeStorySummary?.id;

  // 2. Fetch full content if an active story is found (GET)
  const { data: fullData } = useSWR<StoryResponse>(
    storyId ? `${API_BASE_URL}/story/${storyId}` : null,
    fetcherWithAuth,
    {
      revalidateOnFocus: false,
    },
  );

  const loading = allStoriesLoading;

  const story = fullData?.story || activeStorySummary || null;

  const handleJoinNarrative = async () => {
    if (!user) return;
    setIsTriggeing(true);
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
        toast.success("Joined the Narrative Hub!");
        toast.success("The narrative agents have been summoned!");
        mutate(`${API_BASE_URL}/story/allStories`);
      } else {
        toast.error("The agents are currently dormant.");
      }
    } catch {
      toast.error("Communication interrupted.");
    } finally {
      setIsTriggeing(false);
    }
  };

  const handleStoryUpdate = (updatedStory: AIStory) => {
    // Optimistically update relevant cache entries
    mutate(`${API_BASE_URL}/story/allStories`);
    if (updatedStory.id) {
      mutate(
        `${API_BASE_URL}/story/${updatedStory.id}`,
        { story: updatedStory },
        false,
      );
    }
  };

  return (
    <div className="container mx-auto pb-20">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-pulse" />
          </div>
          <p className="text-muted-foreground animate-pulse font-medium">
            Our AI agent is retrieving your masterpiece...
          </p>
        </div>
      ) : !user ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="bg-blue-50 dark:bg-blue-950/30 p-6 rounded-full mb-4 relative group">
            <Lock className="w-8 h-8 text-blue-600 dark:text-blue-400 relative z-10" />
          </div>
          <h1 className="text-2xl font-bold mb-3">AI Serial Locked</h1>
          <p className="text-muted-foreground text-sm max-w-sm mb-6 leading-relaxed">
            Login to witness your personalized daily chapters crafted by our AI
            agent. In the meantime, you can still browse and read from our{" "}
            <b>Original Library</b> below!
          </p>
          <Button
            asChild
            className="rounded-full px-6 py-3 h-auto text-base font-bold shadow-lg transition-all hover:shadow-xl active:scale-95"
          >
            <Link href="/login">Login to Unlock My Story</Link>
          </Button>
        </div>
      ) : (
        <>
          {story && (
            <StoryViewer
              story={story}
              onStoryUpdate={handleStoryUpdate}
              onReaderToggle={(reading) => setIsReading(reading)}
            />
          )}
          {!story && (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
              <Typography
                variant="p"
                className="text-muted-foreground max-w-sm mb-6"
              >
                No global narrative has been initialized for today yet, or
                we&apos;re between epics. Be the one to spark the creative
                agents.
              </Typography>
              <Button
                onClick={handleJoinNarrative}
                disabled={isTriggeing}
                className="rounded-full px-8 py-4 h-auto text-base font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95 bg-linear-to-r from-blue-600 to-indigo-700 gap-2"
              >
                {isTriggeing ? (
                  "Manifesting..."
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 fill-white/20" />
                    Forge New Story Arc
                  </>
                )}
              </Button>
            </div>
          )}
        </>
      )}

      {!isReading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-20">
          <StoryLibrary />
        </div>
      )}
    </div>
  );
}
