"use client";

import { useEffect } from "react";
import { useUserStore } from "@/lib/store/userStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function AuthMonitor() {
  const { logout, user, token, fetchUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const checkToken = () => {
      // If no token but user is in store, clean up
      if (!token && user) {
        logout();
        return;
      }

      if (!token) return;

      // Ensure user details are loaded if token exists
      if (!user) {
        fetchUser();
      }

      try {
        const parts = token.split(".");
        if (parts.length !== 3) throw new Error("Invalid token format");

        const payload = JSON.parse(atob(parts[1]));
        const exp = payload.exp * 1000; // JWT exp is in seconds, Date.now() is in ms

        if (Date.now() >= exp) {
          logout();
          toast.error("Your session has expired. Please log in again.");
          router.push("/login");
        }
      } catch (e) {
        console.error("Auth check failed:", e);
        logout();
        router.push("/login");
      }
    };

    // Initial check
    checkToken();

    // Re-check every 30 seconds
    const interval = setInterval(checkToken, 30 * 1000);

    return () => clearInterval(interval);
  }, [logout, router, user, fetchUser, token]);

  return null;
}
