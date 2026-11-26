import { create } from "zustand";
import { API_BASE_URL } from "@/constants";

export type User = {
  _id: string;
  createdAt: string;
  email: string;
  username: string;
  avatar: string;
  role?: "user" | "admin";
  likes_us?: string[];
  likes_in?: string[];
  bookmarks_us?: string[];
  bookmarks_in?: string[];
  preferences?: { language?: string; regions?: string[]; onboarded?: boolean };
};

type AuthStatus = "loading" | "authenticated" | "anonymous";
export type SavedListKey = "likes_us" | "likes_in" | "bookmarks_us" | "bookmarks_in";

interface UserStore {
  user: User | null;
  /** "loading" until the first /me check finishes, so pages don't flash a sign-in prompt. */
  status: AuthStatus;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setSavedList: (key: SavedListKey, ids: string[]) => void;
  savePreferences: (preferences: { language: string; regions: string[]; onboarded?: boolean }) => Promise<void>;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

// The credential is an HttpOnly cookie; this store only mirrors the profile.
export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  status: "loading",
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: Boolean(user), status: user ? "authenticated" : "anonymous" }),
  setSavedList: (key, ids) => set((state) => (state.user ? { user: { ...state.user, [key]: ids } } : state)),
  savePreferences: async (preferences) => {
    const res = await fetch(`${API_BASE_URL}/user/preferences`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(preferences),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok) throw new Error(data?.error || "Couldn't save your preferences.");
    set((state) => (state.user ? { user: { ...state.user, preferences: data.preferences } } : state));
  },
  fetchUser: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/user/me`, { credentials: "include", cache: "no-store" });
      if (res.ok) {
        set({ user: await res.json(), isAuthenticated: true, status: "authenticated" });
      } else if (res.status === 401 || res.status === 404) {
        set({ user: null, isAuthenticated: false, status: "anonymous" });
      } else {
        set((state) => (state.status === "loading" ? { status: "anonymous" } : state));
      }
    } catch {
      // Keep the current state on network errors; only settle the initial check.
      set((state) => (state.status === "loading" ? { status: "anonymous" } : state));
    }
  },
  logout: async () => {
    await fetch(`${API_BASE_URL}/user/logout`, { method: "POST", credentials: "include" }).catch(() => undefined);
    set({ user: null, isAuthenticated: false, status: "anonymous" });
  },
}));
