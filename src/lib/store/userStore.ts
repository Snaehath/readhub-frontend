import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  token: string | null;
  _hasHydrated: boolean;
  setHasHydrated: (val: boolean) => void;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      _hasHydrated: false,
      setHasHydrated: (val) => set({ _hasHydrated: val }),
      setUser: (user) => set({ user }),
      setToken: (token) => {
        set({ token });
        if (token) localStorage.setItem("jwt", token);
        else localStorage.removeItem("jwt");
      },
      fetchUser: async () => {
        const token = get().token || localStorage.getItem("jwt");
        if (!token) {
          set({ user: null });
          return;
        }

        try {
          const API_BASE_URL =
            process.env.NEXT_PUBLIC_API_BASE_URL ||
            "https://readhub-backend.onrender.com/api";
          const res = await fetch(`${API_BASE_URL}/user/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const data = await res.json();
            set({ user: data });
          } else if (res.status === 401) {
            get().logout();
          }
        } catch (err) {
          console.error("Failed to fetch user:", err);
        }
      },
      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem("jwt");
      },
    }),
    {
      name: "user-auth",
      partialize: (state) => ({ token: state.token, user: state.user }),
      onRehydrateStorage: () => (state) => {
        // Called once localStorage has been read and store is hydrated
        state?.setHasHydrated(true);
      },
    },
  ),
);
