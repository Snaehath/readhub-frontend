"use client";

import { useParams } from "next/navigation";
import ChapterViewer from "@/components/story/chapter-viewer";

export default function ChapterViewerPage() {
  const params = useParams();
  const index = params.index as string;
  const chapterNumber = parseInt(params.chapterNumber as string, 10);

  return <ChapterViewer index={index} chapterNumber={chapterNumber} />;
}
