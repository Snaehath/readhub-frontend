import { Metadata } from "next";
import AiNewsHub from "@/components/news/ai-news-hub";

export const metadata: Metadata = {
  title: "AI Reports",
  description:
    "Read original AI-written news reports grounded in published source articles.",
};

const AiNewsPage = () => {
  return (
    <div className="container mx-auto pb-20 pt-10 px-4 sm:px-8">
      {/* Header */}
      <div className="flex flex-col items-center mb-10 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <h1 className="text-4xl sm:text-5xl font-black mb-3 text-primary">
          AI Reports
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg font-medium">
          Read original articles written by ReadHub AI from current news
          coverage. Each report links to its source articles; verify important
          claims with the publishers.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <AiNewsHub />
      </div>
    </div>
  );
};

export default AiNewsPage;
