"use client";

import { useEffect } from "react";
import { useUserStore } from "@/lib/store/userStore";

export const AuthMonitor = () => {
  const { fetchUser } = useUserStore();

  useEffect(() => {
    // Remove JWTs saved by older frontend versions after migrating to cookies.
    localStorage.removeItem("jwt");
    void fetchUser();
    const interval = setInterval(() => void fetchUser(), 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [fetchUser]);

  return null;
}
