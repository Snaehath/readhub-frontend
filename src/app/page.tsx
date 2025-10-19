import FeaturedNews from "@/components/news/featured-news";
import FeaturedBooks from "@/components/books/featured-books";
import HomeContent from "@/components/homeContent";
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <HomeContent/>
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured News</h2>
        <FeaturedNews />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Featured E-Books</h2>
        <FeaturedBooks />
      </section>
    </main>
  );
}
