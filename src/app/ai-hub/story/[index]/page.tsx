import { Metadata } from "next";
import StoryView from "@/components/story/ai-story-single-view";
import { API_BASE_URL } from "@/constants";
import { StoryResponse } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ index: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const index = resolvedParams.index;
  
  try {
    const res = await fetch(`${API_BASE_URL}/ai-hub/story/${index}`);
    const data: StoryResponse = await res.json();
    const story = data.story;

    if (!story) return { title: "Story Not Found" };

    return {
      title: story.title,
      description: story.synopsis || `An original AI-generated story: ${story.title}`,
    };
  } catch {
    return { title: "AI Story Archive" };
  }
}

const StoryArchivePage = async ({ params }: { params: Promise<{ index: string }> }) => {
  const resolved = await params;
  return <StoryView index={resolved.index} />;
};

export default StoryArchivePage;
