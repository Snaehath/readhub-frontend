"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, Globe2, Newspaper, RefreshCcw, SearchX, Settings2, SlidersHorizontal } from "lucide-react";
import { PoweredBy } from "../misc/powered-by";
import { CategoryFilter } from "../misc/filter-chip";
import { SearchInput } from "../misc/search-input";
import ToolTip from "../ui/custom/tooltip";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Spinner } from "../ui/spinner";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SearchableSelect, SelectOption } from "../misc/searchable-select";
import { CountryFlag } from "../misc/country-flag";
import { NewsGridSkeleton, TickerSkeleton } from "../misc/skeletons";
import NewsCardItems from "./news-card-items";
import NewsTicker from "./news-ticker";
import ArticleAiModal from "./article-ai-modal";
import { NewsArticle, PaginatedNewsResponse } from "@/types";
import { newsCategories, newsCountries } from "@/constants";
import { fetchNews } from "@/api/news";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useArticleAi } from "@/lib/hooks/useArticleAi";
import { useUserStore } from "@/lib/store/userStore";
import { effectivePreferences } from "@/lib/preferences";

const PAGE_SIZE = 12;
const FRESHNESS_OPTIONS = [
  { id: "any", name: "Any time" },
  { id: "24h", name: "Past 24 hours" },
  { id: "7d", name: "Past week" },
  { id: "30d", name: "Past month" },
];
const PROVIDERS = {
  GDELT: { name: "GDELT Project", href: "https://www.gdeltproject.org/", icon: Globe2 },
  GNews: { name: "GNews", href: "https://gnews.io/", icon: Newspaper },
  NewsAPI: { name: "NewsAPI", href: "https://newsapi.org/", icon: Newspaper },
} as const;

// Filters that live in the URL. Language is not one of them: it comes from the
// user's profile preferences (English for guests).
type Filters = { q: string; category: string; country: string; sort: string; freshness: string };

const pick = (value: string | null, allowed: { id: string }[], fallback: string) =>
  value && allowed.some(({ id }) => id === value) ? value : fallback;

/** Read filters from the URL; the country must be one of the regions this user can switch between. */
function readFilters(params: URLSearchParams, regions: string[]): Filters {
  const country = params.get("country");
  return {
    q: (params.get("query") || "").slice(0, 100),
    category: pick(params.get("category"), newsCategories, "all"),
    country: country && regions.includes(country) ? country : regions[0],
    sort: params.get("sort") === "oldest" ? "oldest" : "latest",
    freshness: pick(params.get("freshness"), FRESHNESS_OPTIONS, "any"),
  };
}

const URL_KEYS: Record<Exclude<keyof Filters, "country">, { key: string; fallback: string }> = {
  q: { key: "query", fallback: "" },
  category: { key: "category", fallback: "all" },
  sort: { key: "sort", fallback: "latest" },
  freshness: { key: "freshness", fallback: "any" },
};

const ALL_REGION_IDS = newsCountries.map(({ id }) => id);

type FeedState = { articles: NewsArticle[]; page: number; hasMore: boolean; total: number; totalIsEstimate: boolean; provider: NonNullable<PaginatedNewsResponse["provider"]>; updatedAt?: string };
const EMPTY_FEED: FeedState = { articles: [], page: 0, hasMore: false, total: 0, totalIsEstimate: false, provider: "GDELT" };

export default function NewsCard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const authStatus = useUserStore((state) => state.status);
  const user = useUserStore((state) => state.user);
  const ai = useArticleAi(isAuthenticated);

  // Signed-in users see only the regions and language from their profile;
  // guests get every region in English.
  const preferences = effectivePreferences(user);
  const language = isAuthenticated ? preferences.language : "en";
  const regions = isAuthenticated ? preferences.regions : ALL_REGION_IDS;
  const regionsKey = regions.join(",");

  // The URL is the single source of truth for filters so links and back/forward work.
  const filters = useMemo(
    () => readFilters(new URLSearchParams(searchParams.toString()), regionsKey.split(",")),
    [searchParams, regionsKey],
  );
  const updateFilters = useCallback((patch: Partial<Filters>) => {
    const params = new URLSearchParams(window.location.search);
    for (const [field, value] of Object.entries(patch) as [keyof Filters, string][]) {
      if (field === "country") {
        // The first region is the user's default, so it needs no URL parameter.
        if (value && value !== regionsKey.split(",")[0]) params.set("country", value);
        else params.delete("country");
        continue;
      }
      const { key, fallback } = URL_KEYS[field];
      if (value && value !== fallback) params.set(key, value);
      else params.delete(key);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router, regionsKey]);

  // Search input is local while typing and written to the URL once debounced.
  const [searchInput, setSearchInput] = useState(filters.q);
  const debouncedSearch = useDebounce(searchInput.trim(), 400);
  const lastWrittenQuery = useRef(filters.q);
  useEffect(() => {
    if (debouncedSearch === filters.q) return;
    lastWrittenQuery.current = debouncedSearch;
    updateFilters({ q: debouncedSearch });
  }, [debouncedSearch, filters.q, updateFilters]);
  useEffect(() => {
    // Sync the box only for external URL changes (e.g. back navigation), not our own writes.
    if (filters.q !== lastWrittenQuery.current) {
      lastWrittenQuery.current = filters.q;
      setSearchInput(filters.q);
    }
  }, [filters.q]);

  const [feed, setFeed] = useState<FeedState>(EMPTY_FEED);
  const [status, setStatus] = useState<"loading" | "loadingMore" | "ready" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  // Set by the refresh button so only that reload asks the backend for new headlines.
  const forceRefresh = useRef(false);
  const generation = useRef(0);

  const loadPage = useCallback(async (page: number, signal?: AbortSignal, refresh = false) => {
    const currentGeneration = generation.current;
    setStatus(page === 1 ? "loading" : "loadingMore");
    try {
      const res = await fetchNews({ ...filters, language, page, limit: PAGE_SIZE, refresh }, signal);
      if (currentGeneration !== generation.current) return;
      setFeed((previous) => ({
        articles: page === 1 ? res.news : [...previous.articles, ...res.news.filter((item) => !previous.articles.some((existing) => existing.id === item.id))],
        page: res.currentPage,
        hasMore: res.hasMore,
        total: res.totalArticles,
        totalIsEstimate: Boolean(res.totalIsEstimate),
        provider: res.provider || "GDELT",
        updatedAt: page === 1 ? res.updatedAt : previous.updatedAt,
      }));
      setStatus("ready");
    } catch (error) {
      if (signal?.aborted || currentGeneration !== generation.current) return;
      setErrorMessage(error instanceof Error ? error.message : "News is temporarily unavailable.");
      setStatus("error");
    }
  }, [filters, language]);

  useEffect(() => {
    // Wait for the session check so a signed-in user's feed isn't fetched twice.
    if (authStatus === "loading") return;
    generation.current += 1;
    const controller = new AbortController();
    const refresh = forceRefresh.current;
    forceRefresh.current = false;
    void loadPage(1, controller.signal, refresh);
    return () => controller.abort();
  }, [loadPage, refreshKey, authStatus]);

  const refreshFeed = () => {
    forceRefresh.current = true;
    setRefreshKey((key) => key + 1);
  };

  const hasMore = feed.hasMore;

  return (
    <>
      {authStatus === "loading" ? <TickerSkeleton /> : <NewsTicker country={filters.country} language={language} />}
      <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <ArticleAiModal
          article={ai.article}
          mode={ai.mode}
          explanation={ai.explanation}
          forecast={ai.forecast}
          basis={ai.basis}
          loading={ai.loading}
          error={ai.error}
          isAuthenticated={isAuthenticated}
          onClose={ai.close}
          onRetry={ai.retry}
        />

        <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">News</h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <PoweredBy {...PROVIDERS[feed.provider]} />
              {feed.updatedAt && status !== "loading" && (
                <span className="text-xs text-muted-foreground">Updated {formatDistanceToNow(new Date(feed.updatedAt), { addSuffix: true })}</span>
              )}
            </div>
            <p className="sr-only" aria-live="polite">{status === "loading" ? "Loading articles" : `${feed.articles.length} articles shown`}</p>
          </div>
          <div className="flex w-full items-center gap-2 lg:max-w-md">
            <SearchInput
              aria-label="Search news articles"
              placeholder="Search news…"
              value={searchInput}
              maxLength={100}
              onChange={(event) => setSearchInput(event.target.value)}
              onClear={() => setSearchInput("")}
            />
            <ToolTip content="Check for new headlines">
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 shrink-0 rounded-full"
                onClick={refreshFeed}
                disabled={status === "loading"}
                aria-label="Refresh news"
              >
                <RefreshCcw className={`h-4 w-4 ${status === "loading" ? "animate-spin" : ""}`} />
              </Button>
            </ToolTip>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <CategoryFilter
            label="Filter by topic"
            options={newsCategories}
            value={filters.category}
            onChange={(category) => updateFilters({ category })}
            className="min-w-0"
          />
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <RegionSwitcher
              value={filters.country}
              regions={regions}
              isAuthenticated={isAuthenticated}
              onChange={(country) => updateFilters({ country })}
            />
            <FeedFilters sort={filters.sort} freshness={filters.freshness} onChange={updateFilters} />
          </div>
        </div>

        {status === "error" && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle />
            <AlertTitle>Couldn&apos;t load the news</AlertTitle>
            <AlertDescription>
              <p>{errorMessage}</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={refreshFeed}>Try again</Button>
            </AlertDescription>
          </Alert>
        )}

        {status === "loading" && feed.articles.length === 0 ? (
          <NewsGridSkeleton />
        ) : (
          <div className={status === "loading" ? "opacity-60 transition-opacity" : ""}>
            <NewsCardItems articles={feed.articles} onOpenAi={ai.open} />
          </div>
        )}

        {status === "ready" && feed.articles.length === 0 && (
          <Empty className="mt-6 border border-dashed">
            <EmptyHeader>
              <EmptyMedia variant="icon"><SearchX /></EmptyMedia>
              <EmptyTitle>No articles found</EmptyTitle>
              <EmptyDescription>
                {filters.q ? `Nothing matches “${filters.q}”. Try another search or clear it.` : "Try another topic, region or time window."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        {hasMore && status !== "loading" && (
          <div className="mt-8 flex justify-center pb-8">
            <Button variant="outline" onClick={() => void loadPage(feed.page + 1)} disabled={status === "loadingMore"}>
              {status === "loadingMore" && <Spinner />}
              Load more
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

const regionOption = (id: string): SelectOption => ({
  id,
  name: newsCountries.find((country) => country.id === id)?.name ?? id,
  icon: <CountryFlag code={id} />,
});

/**
 * Region switcher. Signed-in users choose among their profile regions (a plain
 * badge when there is only one); guests can pick any region.
 */
function RegionSwitcher({ value, regions, isAuthenticated, onChange }: { value: string; regions: string[]; isAuthenticated: boolean; onChange: (id: string) => void }) {
  const footer = isAuthenticated ? (
    <Link href="/profile#preferences" className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-primary hover:underline">
      <Settings2 className="h-3.5 w-3.5" aria-hidden="true" /> Manage regions &amp; language
    </Link>
  ) : (
    <Link href="/login?next=/news" className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-primary hover:underline">
      <Settings2 className="h-3.5 w-3.5" aria-hidden="true" /> Sign in to personalise
    </Link>
  );

  if (regions.length === 1) {
    const only = regionOption(regions[0]);
    return (
      <ToolTip content="Add more regions in your profile">
        <Link href="/profile#preferences" className="inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm hover:bg-accent">
          {only.icon}
          {only.name}
          <Settings2 className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
        </Link>
      </ToolTip>
    );
  }

  return (
    <SearchableSelect
      label="Region"
      value={value}
      options={regions.map(regionOption)}
      searchPlaceholder="Search regions…"
      onChange={onChange}
      footer={footer}
      className="w-[180px]"
    />
  );
}
const SORT_OPTIONS = [{ id: "latest", name: "Newest first" }, { id: "oldest", name: "Oldest first" }];

/** Labelled single-choice pill row (shadcn ToggleGroup). */
function Segment({ options, value, onSelect, label }: { options: { id: string; name: string }[]; value: string; onSelect: (id: string) => void; label: string }) {
  const id = `segment-${label.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <div className="space-y-2">
      <p id={id} className="text-xs font-medium text-muted-foreground">{label}</p>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(next) => next && onSelect(next)}
        variant="outline"
        size="sm"
        spacing={1.5}
        aria-labelledby={id}
        className="flex-wrap"
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.id}
            value={option.id}
            className="rounded-full px-3 data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            {option.name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

/** Sort and time window change rarely, so they live in a compact popover. */
function FeedFilters({ sort, freshness, onChange }: { sort: string; freshness: string; onChange: (patch: Partial<Filters>) => void }) {
  const active = (sort !== "latest" ? 1 : 0) + (freshness !== "any" ? 1 : 0);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-10 gap-2 rounded-full px-4 font-normal" aria-label={active ? `Sort and date filters, ${active} active` : "Sort and date filters"}>
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters
          {active > 0 && <Badge className="h-5 min-w-5 rounded-full px-1 tabular-nums">{active}</Badge>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 space-y-4">
        <Segment label="Sort by" options={SORT_OPTIONS} value={sort} onSelect={(id) => onChange({ sort: id })} />
        <Segment label="Published" options={FRESHNESS_OPTIONS} value={freshness} onSelect={(id) => onChange({ freshness: id })} />
        {active > 0 && (
          <Button variant="ghost" size="sm" className="w-full" onClick={() => onChange({ sort: "latest", freshness: "any" })}>
            Reset filters
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}
