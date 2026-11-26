import { Metadata } from "next";
import NewsView from "@/components/news/ai-news-single-view";
import { getAiReportServer } from "@/lib/data";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const report = await getAiReportServer(id);
  if (!report) return { title: "Report not found" };
  return {
    title: report.title,
    description: report.summary || report.content?.slice(0, 160),
    openGraph: { title: report.title, description: report.summary, type: "article" },
  };
}

export default function AiNewsReportPage({ params }: { params: Promise<{ id: string }> }) {
  return <NewsView params={params} />;
}
