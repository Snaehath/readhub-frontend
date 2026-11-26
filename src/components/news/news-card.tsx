"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Globe2, Languages, Loader2, Newspaper, RefreshCcw, SlidersHorizontal } from "lucide-react";
import { PoweredBy } from "../misc/powered-by";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SearchableSelect, SelectOption } from "../misc/searchable-select";
import { CountryFlag } from "../misc/country-flag";
import { CardsSkeleton } from "../misc/skeletons";
import NewsCardItems from "./news-card-items";
import NewsTicker from "./news-ticker";
import ArticleAiModal from "./article-ai-modal";
import { NewsArticle, PaginatedNewsResponse } from "@/types";
import { newsCategories, newsCountries, newsLanguages } from "@/constants";
import { fetchNews } from "@/api/news";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useArticleAi } from "@/lib/hooks/useArticleAi";
import { useUserStore } from "@/lib/store/userStore";

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

type Filters = { q: string; category: string; country: string; language: string; sort: string; freshness: string };

const pick = (value: string | null, allowed: { id: string }[], fallback: string) =>
  value && allowed.some(({ id }) => id === value) ? value : fallback;

function readFilters(params: URLSearchParams): Filters {
  return {
    q: (params.get("query") || "").slice(0, 100),
    category: pick(params.get("category"), newsCategories, "all"),
    country: pick(params.get("country"), newsCountries, "world"),
    language: pick(params.get("language"), newsLanguages, "en"),
    sort: params.get("sort") === "oldest" ? "oldest" : "latest",
    freshness: pick(params.get("freshness"), FRESHNESS_OPTIONS, "any"),
  };
}

const URL_KEYS: Record<keyof Filters, { key: string; fallback: string }> = {
  q: { key: "query", fallback: "" },
  category: { key: "category", fallback: "all" },
  country: { key: "country", fallback: "world" },
  language: { key: "language", fallback: "en" },
  sort: { key: "sort", fallback: "latest" },
  freshness: { key: "freshness", fallback: "any" },
};

type FeedState = { articles: NewsArticle[]; page: number; hasMore: boolean; total: number; totalIsEstimate: boolean; provider: NonNullable<PaginatedNewsResponse["provider"]> };
const EMPTY_FEED: FeedState = { articles: [], page: 0, hasMore: false, total: 0, totalIsEstimate: false, provider: "GDELT" };

export default function NewsCard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  const ai = useArticleAi(isAuthenticated);

  // The URL is the single source of truth for filters so links and back/forward work.
  const filters = useMemo(() => readFilters(new URLSearchParams(searchParams.toString())), [searchParams]);
  const updateFilters = useCallback((patch: Partial<Filters>) => {
    const params = new URLSearchParams(window.location.search);
    for (const [field, value] of Object.entries(patch) as [keyof Filters, string][]) {
      const { key, fallback } = URL_KEYS[field];
      if (value && value !== fallback) params.set(key, value);
      else params.delete(key);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [pathname, router]);

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
  const generation = useRef(0);

  const loadPage = useCallback(async (page: number, signal?: AbortSignal) => {
    const currentGeneration = generation.current;
    setStatus(page === 1 ? "loading" : "loadingMore");
    try {
      const res = await fetchNews({ ...filters, page, limit: PAGE_SIZE }, signal);
      if (currentGeneration !== generation.current) return;
      setFeed((previous) => ({
        articles: page === 1 ? res.news : [...previous.articles, ...res.news.filter((item) => !previous.articles.some((existing) => existing.id === item.id))],
        page: res.currentPage,
        hasMore: res.hasMore,
        total: res.totalArticles,
        totalIsEstimate: Boolean(res.totalIsEstimate),
        provider: res.provider || "GDELT",
      }));
      setStatus("ready");
    } catch (error) {
      if (signal?.aborted || currentGeneration !== generation.current) return;
      setErrorMessage(error instanceof Error ? error.message : "News is temporarily unavailable.");
      setStatus("error");
    }
  }, [filters]);

  useEffect(() => {
    generation.current += 1;
    const controller = new AbortController();
    void loadPage(1, controller.signal);
    return () => controller.abort();
  }, [loadPage, refreshKey]);

  const hasMore = feed.hasMore;

  return (
    <>
      <NewsTicker country={filters.country} language={filters.language} />
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
            <PoweredBy {...PROVIDERS[feed.provider]} />
            <p className="sr-only" aria-live="polite">{status === "loading" ? "Loading articles" : `${feed.articles.length} articles shown`}</p>
          </div>
          <div className="flex w-full items-center gap-2 lg:max-w-md">
            <Input
              type="search"
              aria-label="Search news articles"
              placeholder="Search news…"
              value={searchInput}
              maxLength={100}
              onChange={(event) => setSearchInput(event.target.value)}
              onClear={() => setSearchInput("")}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-full"
              onClick={() => setRefreshKey((key) => key + 1)}
              disabled={status === "loading"}
              aria-label="Refresh news"
              title="Refresh"
            >
              <RefreshCcw className={`h-4 w-4 ${status === "loading" ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div role="group" aria-label="Filter by topic" className="-mx-1 flex min-w-0 gap-2 overflow-x-auto px-1 py-0.5">
            {newsCategories.map((category) => (
              <button
                type="button"
                key={category.id}
                onClick={() => updateFilters({ category: category.id })}
                aria-pressed={filters.category === category.id}
                className={`min-h-9 shrink-0 rounded-full px-4 text-sm transition-colors ${
                  filters.category === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <SearchableSelect
              label="Country / region"
              value={filters.country}
              options={COUNTRY_OPTIONS}
              searchPlaceholder="Search countries…"
              onChange={(country) => updateFilters({ country, ...(country === "us" || country === "in" ? { language: "en" } : {}) })}
              className="w-[170px]"
            />
            <SearchableSelect
              label="Language"
              value={filters.language}
              options={LANGUAGE_OPTIONS}
              searchPlaceholder="Search languages…"
              onChange={(language) => updateFilters({ language })}
              className="w-[150px]"
            />
            <FeedFilters sort={filters.sort} freshness={filters.freshness} onChange={updateFilters} />
          </div>
        </div>

        {status === "error" && (
          <div role="alert" className="mb-6 flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-6 text-center text-sm">
            <p className="text-destructive">{errorMessage}</p>
            <Button variant="outline" size="sm" onClick={() => setRefreshKey((key) => key + 1)}>Try again</Button>
          </div>
        )}

        {status === "loading" && feed.articles.length === 0 ? (
          <CardsSkeleton />
        ) : (
          <div className={status === "loading" ? "opacity-60 transition-opacity" : ""}>
            <NewsCardItems articles={feed.articles} onOpenAi={ai.open} />
          </div>
        )}

        {status === "ready" && feed.articles.length === 0 && (
          <p className="mt-10 text-center text-sm text-muted-foreground">
            {filters.q ? `No articles match “${filters.q}”. Try another search or clear it.` : "No articles found for these filters."}
          </p>
        )}

        {hasMore && status !== "loading" && (
          <div className="mt-8 flex justify-center pb-8">
            <Button variant="outline" onClick={() => void loadPage(feed.page + 1)} disabled={status === "loadingMore"}>
              {status === "loadingMore" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Load more
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

const COUNTRY_OPTIONS: SelectOption[] = newsCountries.map(({ id, name }) => ({ id, name, icon: <CountryFlag code={id} /> }));
const LANGUAGE_OPTIONS: SelectOption[] = newsLanguages.map(({ id, name }) => ({ id, name, icon: <Languages className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" /> }));
const SORT_OPTIONS = [{ id: "latest", name: "Newest first" }, { id: "oldest", name: "Oldest first" }];

function Segment({ options, value, onSelect, label }: { options: { id: string; name: string }[]; value: string; onSelect: (id: string) => void; label: string }) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs font-medium text-muted-foreground">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            aria-pressed={value === option.id}
            className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${value === option.id ? "border-primary bg-primary text-primary-foreground" : "hover:bg-accent"}`}
          >
            {option.name}
          </button>
        ))}
      </div>
    </fieldset>
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
          {active > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">{active}</span>}
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
