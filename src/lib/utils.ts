import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Estimated reading time at ~220 words per minute (never less than one minute). */
export const readMinutes = (wordCount = 0) => Math.max(1, Math.ceil(wordCount / 220));

/** Returns the URL normalised if it is http(s), otherwise null. Use before rendering untrusted links. */
export function safeHttpUrl(value: string | undefined | null): URL | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url : null;
  } catch {
    return null;
  }
}

/** Replace bare citation markers like [2] with in-page links when that source exists. */
export function linkCitations(markdown: string, citationNumbers: number[], anchorPrefix: string) {
  if (citationNumbers.length === 0) return markdown;
  const known = new Set(citationNumbers);
  return markdown.replace(/\[(\d+)\](?!\()/g, (match, number: string) =>
    known.has(Number(number)) ? `[${number}](#${anchorPrefix}-${number})` : match,
  );
}
