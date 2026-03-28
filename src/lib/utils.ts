import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import { API_BASE_URL } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getCoverBaseUrl = () => {
  return API_BASE_URL.replace(/\/api\/?$/, "") + "/covers";
};

