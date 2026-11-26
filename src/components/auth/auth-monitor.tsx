"use client";

import { useEffect } from "react";
import { useUserStore } from "@/lib/store/userStore";

/** Loads the session on start and re-checks it when the tab regains focus (e.g. after the cookie expires). */
export const AuthMonitor = () => {
  const fetchUser = useUserStore((state) => state.fetchUser);

  useEffect(() => {
    void fetchUser();
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void fetchUser();
    };
    document.addEventListener("visibilitychange", refreshWhenVisible);
    return () => document.removeEventListener("visibilitychange", refreshWhenVisible);
  }, [fetchUser]);

  return null;
};
