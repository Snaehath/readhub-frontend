export type AgentEvent = {
  type: "status" | "tool_call" | "tool_result" | "final" | "error";
  message: string;
  tool?: string;
  args?: Record<string, unknown>;
  timestamp?: string;
};

export type ChatSourceReference = {
  citationNumber: number;
  title: string;
  publisher: string;
  url: string;
};

export type ChatMessage = {
  _id?: string;
  sender: "user" | "bot";
  message: string;
  /** Legacy reasoning log stored by earlier versions; newer messages use `events`. */
  thoughts?: string[];
  latency?: string;
  sources?: ChatSourceReference[];
  events?: AgentEvent[];
  status?: "error" | "neutral";
  feedback?: "helpful" | "not_helpful";
};

export type ChatSession = {
  sessionId: string;
  title: string;
  updatedAt: string;
  messageCount: number;
};

export type NewsArticle = {
  id: string;
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: { name: string };
  category: string[];
  sourceCountry?: string;
  sourceLanguage?: string;
  dateLabel?: string;
  /** Set for articles stored in ReadHub's US/India archive; these support likes and bookmarks. */
  savedRegion?: "us" | "in";
};

export type ForecastScenario = {
  name: string;
  likelihood: "high" | "medium" | "low";
  summary: string;
  drivers: string[];
};

export type ArticleForecast = {
  outlook: string;
  timeline: { horizon: string; development: string }[];
  scenarios: ForecastScenario[];
  signals: string[];
  assumptions: string[];
};

export interface PaginatedNewsResponse {
  news: NewsArticle[];
  totalPages: number;
  currentPage: number;
  totalArticles: number;
  hasMore: boolean;
  /** True when more articles exist than `totalArticles` (global feed fetches in batches). */
  totalIsEstimate?: boolean;
  provider?: "GDELT" | "GNews" | "NewsAPI";
}

export interface RawNewsArticle {
  _id?: string;
  id?: string;
  title: string;
  description?: string;
  url: string;
  urlToImage?: string | null;
  publishedAt: string;
  source?: { name: string };
  category?: string[];
  sourceCountry?: string;
  sourceLanguage?: string;
  dateLabel?: string;
}

export type Book = {
  title: string;
  author_name: string[];
  cover_id?: number;
  cover_edition_key?: string;
  lending_identifier_s?: string;
  work_key: string;
  tag: string;
};

export interface OpenLibraryBook {
  title: string;
  key: string;
  author_name?: string[];
  authors?: Array<{ key?: string; name?: string }>;
  cover_id?: number;
  cover_i?: number;
  cover_edition_key?: string;
  lending_identifier_s?: string;
  lending_identifier?: string;
}

export type Category =
  | "technology"
  | "sports"
  | "science"
  | "health"
  | "business"
  | "politics"
  | "entertainment"
  | "history"
  | "horror"
  | "children";

export type AiNewsSource = {
  citationNumber?: number;
  title?: string;
  url?: string;
  sourceName?: string;
  category?: string;
  publishedAt?: string;
};

export type AiNews = {
  _id: string;
  reportType?: "manual" | "daily";
  editionDate?: string;
  title: string;
  topic: string;
  summary: string;
  authorName: string;
  /** AI writing persona; absent on reports created before personas existed. */
  persona?: { id: string; penName: string; desk: string; bio: string };
  /** Present on the single-report endpoint only. */
  content?: string;
  /** Present on the list endpoint, which omits `content`. */
  wordCount?: number;
  category: string;
  createdAt: string;
  sources?: AiNewsSource[];
};

export type AiNewsResponse = { news: AiNews[] };
export type SingleAiNewsResponse = { news: AiNews };
