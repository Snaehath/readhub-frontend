import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Loading placeholders for every content surface. Each mirrors the layout of the
// component it stands in for, so nothing jumps when the real content arrives.

/** Screen-reader announcement + container shared by the grid skeletons. */
function Loading({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div role="status" aria-label={label} className={className}>
      {children}
      <span className="sr-only">{label}</span>
    </div>
  );
}

const repeat = (count: number, render: (index: number) => React.ReactNode) => Array.from({ length: count }, (_, index) => render(index));

// --- News --------------------------------------------------------------------

export const NEWS_GRID = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export function NewsCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="flex items-center justify-between px-3 pt-3">
        <Skeleton className="h-6 w-20 rounded-full" />
        <div className="flex gap-1.5">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
      <div className="space-y-2 px-3 pt-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="space-y-1.5 px-3 pb-3 pt-3">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      <div className="mt-auto flex items-center justify-between border-t px-3 py-2.5">
        <Skeleton className="h-4 w-20" />
        <div className="flex gap-1.5">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function NewsGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <Loading label="Loading articles" className={NEWS_GRID}>
      {repeat(count, (index) => <NewsCardSkeleton key={index} />)}
    </Loading>
  );
}

/** Headline ticker strip while its headlines load. */
export function TickerSkeleton() {
  return (
    <div className="flex h-12 items-center gap-6 overflow-hidden border-y bg-muted/40 px-4 sm:px-6" aria-hidden="true">
      <Skeleton className="h-6 w-24 shrink-0 rounded-full bg-primary/20" />
      {repeat(4, (index) => (
        <div key={index} className="flex shrink-0 items-center gap-3">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-4 w-64" />
        </div>
      ))}
    </div>
  );
}

/** Whole news page (ticker, header, filter bar, grid) for the route-level fallback. */
export function NewsPageSkeleton() {
  return (
    <>
      <TickerSkeleton />
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-48 rounded-full" />
          </div>
          <div className="flex w-full gap-2 lg:max-w-md">
            <Skeleton className="h-11 flex-1 rounded-full" />
            <Skeleton className="h-11 w-11 rounded-full" />
          </div>
        </div>
        <ChipRowSkeleton className="mb-6" />
        <NewsGridSkeleton />
      </div>
    </>
  );
}

// --- Library -------------------------------------------------------------------

export const BOOK_GRID = "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";

export function BookCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card">
      <Skeleton className="h-52 w-full rounded-none" />
      <div className="flex-1 space-y-2 px-3 py-2.5">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="mt-auto flex items-center justify-between border-t px-3 py-2.5">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

export function BookGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <Loading label="Loading books" className={BOOK_GRID}>
      {repeat(count, (index) => <BookCardSkeleton key={index} />)}
    </Loading>
  );
}

// --- Shared ----------------------------------------------------------------------

/** A row of filter chips (same h-10 size as CategoryFilter chips). */
export function ChipRowSkeleton({ count = 7, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("flex gap-2 overflow-hidden", className)} aria-hidden="true">
      {repeat(count, (index) => <Skeleton key={index} className="h-10 w-28 shrink-0 rounded-full" />)}
    </div>
  );
}

// --- AI reports -------------------------------------------------------------------

export const REPORT_GRID = "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3";

function BylineSkeleton() {
  return (
    <div className="flex items-center gap-2.5">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="space-y-1.5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-2.5 w-16" />
      </div>
    </div>
  );
}

export function AiReportCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-2xl border bg-card p-6">
      <div className="mb-6 flex items-center gap-2">
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="ml-auto h-3 w-28" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-4/5" />
      </div>
      <div className="mt-4 space-y-1.5">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3.5 w-2/3" />
      </div>
      <div className="mt-auto flex items-center justify-between border-t pt-6">
        <BylineSkeleton />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

/** Daily edition feature block. */
export function DailyEditionSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border bg-card">
      <div className="flex items-center justify-between gap-3 border-b bg-muted/40 px-5 py-4 sm:px-7">
        <Skeleton className="h-6 w-32 rounded-full" />
        <Skeleton className="h-3.5 w-40" />
      </div>
      <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(260px,0.72fr)] lg:gap-10">
        <div className="space-y-4">
          <BylineSkeleton />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <div className="space-y-2 pt-1">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <Skeleton className="mt-2 h-10 w-44 rounded-full" />
        </div>
        <div className="space-y-4 rounded-2xl border bg-muted/20 p-4 sm:p-5">
          <Skeleton className="h-4 w-40" />
          {repeat(4, (index) => (
            <div key={index} className="flex gap-3">
              <Skeleton className="h-6 w-6 shrink-0 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** AI Reports hub: daily edition, section rule and report grid. */
export function AiReportsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <Loading label="Loading AI reports" className="space-y-12">
      <DailyEditionSkeleton />
      <div className="space-y-10">
        <div className="flex items-center gap-6" aria-hidden="true">
          <Skeleton className="h-3 w-32 shrink-0" />
          <Separator className="flex-1" />
        </div>
        <div className={REPORT_GRID}>{repeat(count, (index) => <AiReportCardSkeleton key={index} />)}</div>
      </div>
    </Loading>
  );
}

/** Single AI report page. */
export function AiReportArticleSkeleton() {
  return (
    <Loading label="Loading report" className="mx-auto max-w-3xl px-5 pb-24 pt-6 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="space-y-5 border-b pb-8">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-20" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-2/3" />
        </div>
        <Skeleton className="h-5 w-full" />
        <BylineSkeleton />
      </div>
      <div className="space-y-8 pt-8">
        {repeat(3, (section) => (
          <div key={section} className="space-y-3">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </Loading>
  );
}

// --- Profile & chat ---------------------------------------------------------------

/** Profile page: sticky profile card beside the preferences card. */
export function ProfileSkeleton() {
  return (
    <Loading label="Loading your profile" className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <Skeleton className="mb-6 h-8 w-40" />
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <div className="flex flex-col items-center gap-3 rounded-3xl border-2 bg-card p-6">
          <Skeleton className="h-24 w-24 rounded-full" />
          <Skeleton className="h-7 w-40" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-5 w-36 rounded-full" />
          <div className="mt-4 grid w-full grid-cols-2 gap-4 border-t pt-6">
            <Skeleton className="h-20 rounded-2xl" />
            <Skeleton className="h-20 rounded-2xl" />
          </div>
          <Skeleton className="mt-2 h-10 w-full rounded-full" />
        </div>
        <div className="space-y-5 rounded-xl border bg-card p-6">
          <div className="space-y-2">
            <Skeleton className="h-6 w-44" />
            <Skeleton className="h-4 w-72 max-w-full" />
          </div>
          <div className="grid gap-6 md:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
            <Skeleton className="h-10 rounded-full" />
            <div className="space-y-3">
              <div className="flex gap-1.5">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <Skeleton className="h-56 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </Loading>
  );
}

/** A question and answer pair, used while a saved conversation loads. */
export function ChatMessagesSkeleton() {
  return (
    <div className="space-y-6 py-6" aria-hidden="true">
      {repeat(2, (index) => (
        <div key={index} className="space-y-4">
          <Skeleton className="ml-auto h-10 w-2/5 rounded-2xl" />
          <div className="w-full max-w-2xl space-y-2 rounded-2xl border bg-card px-5 py-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Chat page while the session check runs: toolbar, a few message bubbles, composer. */
export function ChatSkeleton() {
  return (
    <Loading label="Loading the assistant" className="mx-auto flex h-[calc(100svh-4rem)] max-w-4xl flex-col px-4">
      <div className="flex items-center justify-between py-3">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-28" />
      </div>
      <div className="flex-1">
        <ChatMessagesSkeleton />
      </div>
      <div className="pb-4">
        <Skeleton className="h-14 w-full rounded-2xl" />
      </div>
    </Loading>
  );
}
