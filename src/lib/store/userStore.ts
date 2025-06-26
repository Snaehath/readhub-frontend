import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  createdAt: string | number | Date;
  id: string;
  email: string;
  username: string;
  avatar: string;
};

interface UserStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    {
      name: "user-storage", // save key in localStorage
    }
  )
);
