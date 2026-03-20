import { getNewsPaginated } from "@/lib/data";
import FeaturedNewsCard from "./featuredNewsCard";
import Typography from "../ui/custom/typography";

export default async function FeaturedNews() {
  const { news: featuredNews } = await getNewsPaginated(1, 3, "science");

  return (
    <section className="mb-24 relative overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
        <div className="space-y-2">
          <Typography
            variant="h2"
            className="text-3xl sm:text-4xl font-black tracking-tight flex items-center gap-3"
          >
            Featured News
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredNews.map((article, i) => (
          <div
            key={i}
            className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
            style={{ animationDelay: `${i * 150}ms` }}
          >
            <FeaturedNewsCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
