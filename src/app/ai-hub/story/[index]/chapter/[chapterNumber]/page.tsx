import { Metadata } from "next";
import ChapterViewer from "@/components/story/chapter-viewer";
import { API_BASE_URL } from "@/constants";
import { StoryResponse } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ index: string, chapterNumber: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { index, chapterNumber: chNumStr } = resolvedParams;
  const chapterNumber = parseInt(chNumStr, 10);
  
  try {
    const res = await fetch(`${API_BASE_URL}/ai-hub/story/${index}`);
    const data: StoryResponse = await res.json();
    const story = data.story;

    if (!story) return { title: "Chapter Not Found" };

    const chapter = story.chapters?.find(c => c.chapterNumber === chapterNumber);
    if (!chapter) return { title: story.title };

    return {
      title: `${chapter.title} | ${story.title}`,
      description: chapter.content.substring(0, 160),
    };
  } catch {
    return { title: "Read Chapter" };
  }
}

const ChapterViewerPage = async ({ params }: { params: Promise<{ index: string, chapterNumber: string }> }) => {
  const resolved = await params;
  const index = resolved.index;
  const chapterNumber = parseInt(resolved.chapterNumber, 10);

  return <ChapterViewer index={index} chapterNumber={chapterNumber} />;
};

export default ChapterViewerPage;
