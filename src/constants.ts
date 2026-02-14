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
  technology: "bg-blue-100 text-blue-500 border-blue-600",
  sports: "bg-emerald-100 text-emerald-500 border-emerald-600",
  science: "bg-purple-100 text-purple-500 border-purple-600",
  health: "bg-rose-100 text-rose-500 border-rose-600",
  business: "bg-amber-100 text-amber-500 border-amber-600",
  politics: "bg-orange-100 text-orange-500 border-orange-600",
  entertainment: "bg-pink-100 text-pink-500 border-pink-600",
};

export const BOOK_CATEGORY_COLORS: Record<string, string> = {
  history: "bg-stone-100 text-stone-500 border-stone-600",
  horror: "bg-zinc-100 text-zinc-600 border-zinc-700",
  children: "bg-yellow-100 text-yellow-500 border-yellow-600",
  business: "bg-blue-100 text-blue-500 border-blue-600",
  health: "bg-green-100 text-green-500 border-green-600",
  sports: "bg-orange-100 text-orange-500 border-orange-600",
  science: "bg-indigo-100 text-indigo-500 border-indigo-600",
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
