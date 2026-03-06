export type ChatMessage = {
  sender: "user" | "bot";
  message: string;
};

export type NewsArticle = {
  id: string;
  _id: string;
  content: string;
  source: {
    name: string;
  };
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  dateOriginal: string;
  category: string[];
};

export type NewsCardProps = {
  articlesUS: NewsArticle[];
};

export type Book = {
  key: string;
  cover_edition_key?: string;
  cover_id?: number;
  title: string;
  author_name: string[];
  author_key: string;
  lending_identifier_s: string;
  work_key: string;
  tag: string;
};
export type BookCopy = {
  authors: string;
  _id: string;
  work_id: string;
  title: string;
  author_name: string[];
  author_key: string[];
  coverImage: string;
  readUrl: string;
  summaries: string[];
  category: string[];
  gutenbergId: number;
  tag: string;
};

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

export type StorySummary = {
  id: string;
  index: string;
  title: string;
  authorName: string;
  genre: string;
  subject: string;
  synopsis?: string;
  currentChapterCount: number;
  maxChapters: number;
  isCompleted?: boolean;
  averageRating?: number;
  reviewCount?: number;
};

export type AIStory = StorySummary & {
  tableOfContents?: {
    chapterNumber: number;
    title: string;
  }[];
  chapters?: {
    chapterNumber: number;
    title: string;
    content: string;
  }[];
  characters?: {
    name: string;
    description: string;
  }[];
  worldBuilding?: string;
  reviews?: {
    userId: string;
    rating: number;
    review?: string;
    createdAt: string;
  }[];
};

export type StoryResponse = {
  message: string;
  story: AIStory;
  isInitializing?: boolean;
};

export type AllStoriesResponse = {
  message: string;
  stories: StorySummary[];
};
