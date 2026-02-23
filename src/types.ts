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

export type AIStory = {
  title: string;
  authorName: string;
  genre: string;
  subject: string;
  index: string;
  tableOfContents: {
    chapterNumber: number;
    title: string;
  }[];
  chapters: {
    chapterNumber: number;
    title: string;
    content: string;
  }[];
  currentChapterCount: number;
  isCompleted?: boolean;
};

export type StoryResponse = {
  message: string;
  story: AIStory;
};

export type AllStoriesResponse = {
  message: string;
  stories: AIStory[];
};
