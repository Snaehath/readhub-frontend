import { Metadata } from "next";
import NewsView from "@/components/news/ai-news-single-view";
import { API_BASE_URL } from "@/constants";
import { SingleAiNewsResponse } from "@/types";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  try {
    const res = await fetch(`${API_BASE_URL}/ai-hub/news/${id}`);
    const data: SingleAiNewsResponse = await res.json();
    const news = data.news;

    if (!news) return { title: "Article Not Found" };

    return {
      title: news.title,
      description: news.summary || news.content.substring(0, 160),
    };
  } catch {
    return { title: "AI News Article" };
  }
}

const AiNewsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  return <NewsView params={params} />;
};

export default AiNewsPage;
