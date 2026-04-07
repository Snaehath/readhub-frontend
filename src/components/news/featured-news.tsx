import { getNewsPaginated } from "@/lib/data";
import FeaturedNewsCard from "./featuredNewsCard";
import Typography from "../ui/custom/typography";

export default async function FeaturedNews() {
  const { news: featuredNews } = await getNewsPaginated(1, 3, "science");

  return (
    <section className="mb-32">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 text-center sm:text-left">
          <div className="space-y-4">
            <Typography
              variant="h2"
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight flex items-center gap-3 justify-center sm:justify-start"
            >
              Featured News
            </Typography>
            <div className="h-[2px] w-24 bg-zinc-900 dark:bg-zinc-100 mx-auto sm:mx-0" />
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
      </div>
    </section>
  );
}
