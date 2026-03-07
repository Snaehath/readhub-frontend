import FeaturedNews from "@/components/news/featured-news";
import HomeContent from "@/components/homeContent";
import FeaturedStorySection from "@/components/story/featured-story-card";
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <HomeContent />

      <FeaturedStorySection />

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured News</h2>
        <FeaturedNews />
      </section>
    </main>
  );
}
