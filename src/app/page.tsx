import FeaturedNews from "@/components/news/featured-news";
import HomeContent from "@/components/homeContent";

// Featured headlines are fetched server-side and revalidated every 5 minutes.
export const revalidate = 300;

export default function Home() {
  return (
    <main className="container mx-auto space-y-20 px-4 py-12">
      <HomeContent />
      <FeaturedNews />
    </main>
  );
}
