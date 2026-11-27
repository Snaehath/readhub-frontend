import { create } from "zustand";
import { ApiError, apiRequest } from "@/lib/api-client";

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
    const data = await apiRequest<{ preferences: User["preferences"] }>("/user/preferences", {
      method: "PUT",
      body: preferences,
      errorMessage: "Couldn't save your preferences.",
    });
    set((state) => (state.user ? { user: { ...state.user, preferences: data.preferences } } : state));
  },
  fetchUser: async () => {
    try {
      const user = await apiRequest<User>("/user/me", { cache: "no-store" });
      set({ user, isAuthenticated: true, status: "authenticated" });
    } catch (error) {
      if (error instanceof ApiError && (error.status === 401 || error.status === 404)) {
        set({ user: null, isAuthenticated: false, status: "anonymous" });
      } else {
        // Keep the current state on network/server errors; only settle the initial check.
        set((state) => (state.status === "loading" ? { status: "anonymous" } : state));
      }
    }
  },
  logout: async () => {
    await apiRequest("/user/logout", { method: "POST" }).catch(() => undefined);
    set({ user: null, isAuthenticated: false, status: "anonymous" });
  },
}));
