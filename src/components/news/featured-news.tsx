import { getNewsPaginated } from "@/lib/data";
import FeaturedNewsCard from "./featuredNewsCard";

export default async function FeaturedNews() {
  const { news: featuredNews } = await getNewsPaginated(1, 3, 'science');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredNews.map((article, i) => (
        <FeaturedNewsCard key={i} article={article} />
      ))}
    </div>
  );
}
