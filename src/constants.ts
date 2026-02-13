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

export const CATEGORY_COLORS:Record<Category, string> = {
  technology: "bg-blue-100 text-blue-800 border-blue-300",
  sports: "bg-green-100 text-green-800 border-green-300",
  science: "bg-purple-100 text-purple-800 border-purple-300",
  health: "bg-red-100 text-red-800 border-red-300",
  business: "bg-yellow-100 text-yellow-800 border-yellow-300",
  politics: "bg-orange-100 text-orange-800 border-orange-300",
  entertainment: "bg-pink-100 text-pink-800 border-pink-300",
};

export const newsCountries = [
  { id: "us", name: "USA", tag: "US" ,icon:"/country_icons/us_icon.png"},
  { id: "in", name: "INDIA", tag: "IN",icon:"/country_icons/india_icon.png" },
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
