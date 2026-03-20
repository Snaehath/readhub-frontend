import FeaturedNews from "@/components/news/featured-news";
import HomeContent from "@/components/homeContent";
import FeaturedStorySection from "@/components/story/featured-story-card";
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12 space-y-24">
      <HomeContent />

      <FeaturedStorySection />

      <FeaturedNews />
    </main>
  );
}
