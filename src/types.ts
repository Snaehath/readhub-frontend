export type ChatMessage = {
  sender: "user" | "bot";
  message: string;
};

export type NewsArticle = {
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  dateOriginal:string;
  category: string[];
  id: string;
};

export type NewsCardProps = {
  articlesUS: NewsArticle[];
  articlesIN: NewsArticle[];
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
