import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { API_BASE_URL } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getCoverBaseUrl = () => {
  return API_BASE_URL.replace(/\/api\/?$/, "") + "/covers";
};

export const getImageUrl = (path: string | undefined | null) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  
  // Prepend backend base URL if path is relative
  const baseUrl = API_BASE_URL.replace(/\/api\/?$/, "");
  return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
};

