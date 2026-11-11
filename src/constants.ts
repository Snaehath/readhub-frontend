export const newsCategories = [
  { id: "all", name: "All" },
  { id: "technology", name: "Technology" },
  { id: "business", name: "Business" },
  { id: "politics", name: "Politics" },
  { id: "health", name: "Health" },
  { id: "sports", name: "Sports" },
  { id: "science", name: "Science" },
  { id: "entertainment", name: "Entertainment" },
];

export const NEWS_CATEGORY_COLORS: Record<string, string> = {
  technology: "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800",
  sports: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800",
  science: "bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950 dark:text-purple-200 dark:border-purple-800",
  health: "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-800",
  business: "bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-800",
  politics: "bg-orange-100 text-orange-950 border-orange-300 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800",
  entertainment: "bg-pink-100 text-pink-900 border-pink-300 dark:bg-pink-950 dark:text-pink-200 dark:border-pink-800",
};

export const BOOK_CATEGORY_COLORS: Record<string, string> = {
  history: "bg-stone-100 text-stone-900 border-stone-300 dark:bg-stone-950 dark:text-stone-200 dark:border-stone-800",
  horror: "bg-zinc-100 text-zinc-900 border-zinc-300 dark:bg-zinc-950 dark:text-zinc-200 dark:border-zinc-800",
  children: "bg-yellow-100 text-yellow-950 border-yellow-300 dark:bg-yellow-950 dark:text-yellow-200 dark:border-yellow-800",
  business: "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800",
  health: "bg-green-100 text-green-950 border-green-300 dark:bg-green-950 dark:text-green-200 dark:border-green-800",
  sports: "bg-orange-100 text-orange-950 border-orange-300 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800",
  science: "bg-indigo-100 text-indigo-950 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-200 dark:border-indigo-800",
};

export const newsCountries = [
  { id: "us", name: "USA", tag: "US", icon: "/country_icons/us_icon.png" },
  { id: "in", name: "INDIA", tag: "IN", icon: "/country_icons/india_icon.png" },
];

export const avatarOptions = [
  {
    label: "Default Dev",
    value: "https://github.com/shadcn.png",
  },
  {
    label: "Detective",
    value: "https://cdn-icons-png.flaticon.com/512/3067/3067572.png",
  },
  {
    label: "Smart Nerd",
    value: "https://cdn-icons-png.flaticon.com/512/3360/3360125.png",
  },
  {
    label: "Reader Nerd",
    value: "https://cdn-icons-png.flaticon.com/512/3445/3445926.png",
  },
];

export const booksCategories = [
  { id: "all", name: "All" },
  { id: "history", name: "History" },
  { id: "business", name: "Business" },
  { id: "health", name: "Health" },
  { id: "sports", name: "Sports" },
  { id: "science", name: "Science" },
  { id: "horror", name: "Horror" },
  { id: "children", name: "Children" },
];

export interface Suggestion {
  icon: string;
  label: string;
  query: string;
}

export const suggestions: Suggestion[] = [
  { icon: "🌍", label: "Top Story",      query: "What is the biggest story in the world right now?" },
  { icon: "⚡", label: "News Briefing",  query: "Give me todays news in 60 seconds" },
  { icon: "📈", label: "Business Pulse", query: "Tell me one big business headline and why it matters" },
  { icon: "🇮🇳", label: "India Updates", query: "Any important updates from India today?" },
  { icon: "💻", label: "Tech Trends",    query: "What is trending in tech today?" },
  { icon: "📚", label: "Book Pick",      query: "Recommend me a great book to read this week" },
  { icon: "👻", label: "Horror Picks",   query: "What are some must-read horror books?" },
  { icon: "🧒", label: "Kids Books",     query: "Suggest some good childrens books" },
];

export const API_BASE_URL = "/api";

