import { CardSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6 ml-8">📰 Loading Latest News...</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    </div>
  );
}
