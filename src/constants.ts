import { Category } from "./types";

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

export const CATEGORY_COLORS: Record<Category, string> = {
  technology: "bg-blue-500 text-white border-blue-600",
  sports: "bg-emerald-500 text-white border-emerald-600",
  science: "bg-purple-500 text-white border-purple-600",
  health: "bg-rose-500 text-white border-rose-600",
  business: "bg-amber-500 text-white border-amber-600",
  politics: "bg-orange-500 text-white border-orange-600",
  entertainment: "bg-pink-500 text-white border-pink-600",
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
  { id: "history", name: "History" },
  { id: "business", name: "Business" },
  { id: "health", name: "Health" },
  { id: "sports", name: "Sports" },
  { id: "science", name: "Science" },
  { id: "horror", name: "Horror" },
  { id: "children", name: "Children" },
];

export const suggestions = [
  "🌍 What’s the biggest story in the world right now?",
  "📰 Give me today’s news in 60 seconds",
  "📈 Tell me one big business headline",
  "Any important updates from India?",
  "💻 What’s trending in tech today?",
  "good children’s books.",
  " Recommend me a great books.",
  "Must-read horror books",
];
