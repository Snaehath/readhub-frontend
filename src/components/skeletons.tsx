// Tailwind shimmer animation style
const shimmer =
  "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export function CardSkeleton() {
  return (
    <div
      className={`${shimmer} relative overflow-hidden rounded-xl bg-white shadow-sm border`}
    >
      {/* Image */}
      <div className="h-44 w-full bg-gray-200" />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Badges */}
        <div className="flex gap-2">
          <div className="h-5 w-14 rounded-full bg-gray-200" />
          <div className="h-5 w-16 rounded-full bg-gray-200" />
        </div>

        {/* Title */}
        <div className="h-5 w-4/5 rounded-md bg-gray-200" />
        <div className="h-5 w-3/4 rounded-md bg-gray-200" />

        {/* Description */}
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-5/6 rounded bg-gray-200" />
      </div>

      {/* Footer */}
      <div className="flex items-center gap-2 px-4 pb-4">
        <div className="h-8 w-8 rounded-full bg-gray-200" />
        <div className="h-4 w-24 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

export function BookCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-white shadow-sm border">
      {/* Shimmer overlay */}
      <div className={`${shimmer} absolute inset-0`} />

      {/* Cover Image Placeholder */}
      <div className="h-72 w-full bg-gray-200" />

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Tag */}
        <div className="h-5 w-16 rounded-full bg-gray-200" />

        {/* Title (2 lines) */}
        <div className="h-6 w-3/4 rounded-md bg-gray-200" />
        <div className="h-6 w-1/2 rounded-md bg-gray-200" />

        {/* Author */}
        <div className="h-4 w-1/3 rounded bg-gray-200" />
      </div>

      {/* Footer: "Read now" + icon */}
      <div className="flex items-center justify-between px-4 pb-4">
        <div className="h-4 w-16 rounded bg-gray-200" />
        <div className="h-6 w-6 rounded-full bg-gray-200" />
      </div>
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

export function BooksSkeleton() {
  return (
    <div className="animate-pulse">
      <BookCardSkeleton />
    </div>
  );
}
