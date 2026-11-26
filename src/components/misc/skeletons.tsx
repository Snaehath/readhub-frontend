export function CardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col h-full animate-pulse">
      {/* Image Placeholder with shimmer effect */}
      <div className="relative h-44 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>

      {/* Content */}
      <div className="p-5 space-y-4 flex-1">
        {/* Badges */}
        <div className="flex gap-2">
          <div className="h-5 w-14 rounded-full bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-5 w-16 rounded-full bg-zinc-100 dark:bg-zinc-800" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 w-full rounded-md bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-5 w-3/4 rounded-md bg-zinc-100 dark:bg-zinc-800" />
        </div>

        {/* Description */}
        <div className="space-y-1">
          <div className="h-4 w-full rounded bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-4 w-5/6 rounded bg-zinc-100 dark:bg-zinc-800" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 p-5 pt-0 mt-auto">
        <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800" />
        <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800 rounded" />
      </div>
    </div>
  );
}


export function BookCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col h-full animate-pulse">
      {/* Cover Image Placeholder with shimmer effect */}
      <div className="relative h-52 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>

      {/* Content */}
      <div className="p-5 space-y-4 flex-1">
        {/* Tag */}
        <div className="h-5 w-20 rounded-full bg-zinc-100 dark:bg-zinc-800" />

        {/* Title (2 lines) */}
        <div className="space-y-2">
          <div className="h-4 w-full rounded-md bg-zinc-100 dark:bg-zinc-800" />
          <div className="h-4 w-2/3 rounded-md bg-zinc-100 dark:bg-zinc-800" />
        </div>

        {/* Author */}
        <div className="h-3 w-1/3 rounded bg-zinc-50 dark:bg-zinc-800/50" />
      </div>

      {/* Footer: "Read now" + icon */}
      <div className="flex items-center justify-between p-5 pt-0 mt-auto">
        <div className="h-4 w-16 rounded bg-zinc-100 dark:bg-zinc-800" />
        <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800" />
      </div>
    </div>
  );
}

export function CardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }, (_, index) => <CardSkeleton key={index} />)}
    </div>
  );
}
