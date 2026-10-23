import { create } from "zustand";
import { API_BASE_URL } from "@/constants";

export type User = {
  createdAt: string | number | Date;
  id: string;
  email: string;
  username: string;
  avatar: string;
  role?: string;
  likes_us?: string[];
  likes_in?: string[];
  bookmarks_us?: string[];
  bookmarks_in?: string[];
};

interface UserStore {
  user: User | null;
  // In-memory authentication indicator only; the credential is an HttpOnly cookie.
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useUserStore = create<UserStore>()((set) => ({
  user: null,
  isAuthenticated: false,
  _hasHydrated: true,
  setHasHydrated: (val) => set({ _hasHydrated: val }),
  setUser: (user) => set({ user }),
  setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  fetchUser: async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/user/me`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        set({ user: data, isAuthenticated: true });
      } else if (res.status === 401) {
        set({ user: null, isAuthenticated: false });
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    }
  },
  logout: async () => {
    try {
      await fetch(`${API_BASE_URL}/user/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Failed to end server session:", err);
    }
    set({ user: null, isAuthenticated: false });
  },
}));
