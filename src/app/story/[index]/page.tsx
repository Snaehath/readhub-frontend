"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AIStory, StoryResponse } from "@/types";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import StoryViewer from "@/components/story/story-viewer";
import Typography from "@/components/ui/custom/typography";

export default function StoryArchivePage() {
  const params = useParams();
  const index = params.index as string;
  const [story, setStory] = useState<AIStory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          "https://readhub-backend.onrender.com/api";

        // Fetch all stories and find the one with the matching index
        // This is a workaround if there is no direct "storyByIndex" endpoint
        const res = await fetch(`${baseUrl}/story/${index}`, {
          cache: "no-store",
        });

        if (res.ok) {
          const data: StoryResponse = await res.json();
          setStory(data.story || null);
        }
      } catch (error) {
        console.error("Error fetching story from archive:", error);
      } finally {
        setLoading(false);
      }
    };

    if (index) fetchStory();
  }, [index]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
          <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-blue-600 animate-pulse" />
        </div>
        <p className="text-muted-foreground animate-pulse font-medium">
          Retrieving from archive...
        </p>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <Typography variant="h2" className="text-2xl font-bold mb-4">
          Story Not Found
        </Typography>
        <p className="text-muted-foreground mb-8">
          The story you are looking for does not exist in our archive.
        </p>
        <Button asChild className="rounded-full px-8">
          <Link href="/story">Back to AI Serial</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto pb-20">
      <StoryViewer
        story={story}
        backUrl="/story"
        backText="Back to Collection"
      />
    </div>
  );
}
