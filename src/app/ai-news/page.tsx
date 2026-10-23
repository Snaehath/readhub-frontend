import { Metadata } from "next";
import AiNewsHub from "@/components/news/ai-news-hub";

export const metadata: Metadata = {
  title: "AI News",
  description:
    "Read AI-generated research reports with links to available source articles.",
};

const AiNewsPage = () => {
  return (
    <div className="container mx-auto pb-20 pt-10 px-4 sm:px-8">
      {/* Header */}
      <div className="flex flex-col items-center mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl sm:text-5xl font-black mb-3 text-primary">
          AI News
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg font-medium">
          AI-generated research based on saved news articles. Reports may contain errors; open the source links to verify important claims.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <AiNewsHub />
      </div>
    </div>
  );
};

export default AiNewsPage;
