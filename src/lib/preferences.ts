import type { User } from "@/lib/store/userStore";

export type NewsPreferences = { language: string; regions: string[]; onboarded: boolean };

export const MAX_REGIONS = 10;
export const DEFAULT_PREFERENCES: NewsPreferences = { language: "en", regions: ["world"], onboarded: false };

/** The user's saved preferences, falling back to English + Global for guests and new accounts. */
export function effectivePreferences(user: User | null): NewsPreferences {
  const saved = user?.preferences;
  return {
    language: saved?.language || DEFAULT_PREFERENCES.language,
    regions: saved?.regions?.length ? saved.regions : DEFAULT_PREFERENCES.regions,
    onboarded: Boolean(saved?.onboarded),
  };
}
