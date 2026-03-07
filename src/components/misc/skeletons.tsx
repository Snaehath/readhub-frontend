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

export function StoryCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col h-full flex-1">
      {/* Cover Image Placeholder with shimmer effect */}
      <div className="relative aspect-[4/5] w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>

      {/* Metadata Section */}
      <div className="p-4 sm:p-5 flex flex-col gap-3 flex-grow bg-gradient-to-b from-transparent to-background/50 z-10">
        {/* Title */}
        <div className="h-5 w-full rounded-md bg-zinc-100 dark:bg-zinc-800" />

        {/* Author */}
        <div className="flex items-center gap-2.5">
          <div className="w-6 h-6 rounded-full bg-zinc-100 dark:bg-zinc-800 flex-shrink-0" />
          <div className="h-3 w-1/2 rounded bg-zinc-50 dark:bg-zinc-800/50" />
        </div>
      </div>
    </div>
  );
}

export function BookCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm flex flex-col h-full animate-pulse">
      {/* Cover Image Placeholder with shimmer effect */}
      <div className="relative h-72 w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
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

export function StoriesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8 animate-pulse">
      <StoryCardSkeleton />
      <StoryCardSkeleton />
      <StoryCardSkeleton />
      <StoryCardSkeleton />
      <StoryCardSkeleton />
    </div>
  );
}

export function AiInsightSkeleton() {
  return (
    <div className="space-y-4 py-2">
      <div className="space-y-3 pt-2">
        <div className="h-4 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-md w-full animate-pulse"></div>
        <div className="h-4 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-md w-[90%] animate-pulse delay-75"></div>
        <div className="h-4 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-md w-[95%] animate-pulse delay-150"></div>
        <div className="h-4 bg-indigo-100/50 dark:bg-indigo-900/20 rounded-md w-[85%] animate-pulse delay-300"></div>
      </div>

      <div className="flex items-center gap-1.5 pt-2">
        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
        <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
      </div>
    </div>
  );
}
