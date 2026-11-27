import { API_BASE_URL } from "@/constants";

/** Error from the ReadHub API. `message` is the server's user-facing error when it sent one. */
export class ApiError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  /** Sent as JSON. */
  body?: unknown;
  signal?: AbortSignal;
  /** Abort after this many milliseconds and throw a friendly timeout error. */
  timeoutMs?: number;
  cache?: RequestCache;
  /** Message used when the server's response has no `error` field. */
  errorMessage?: string;
}

/**
 * The one place the frontend talks to the ReadHub API: sends the auth cookie,
 * encodes/decodes JSON, and turns failures into an ApiError with the server's
 * message. Pass a path relative to the API base, e.g. "/user/me".
 */
export async function apiRequest<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, signal, timeoutMs, cache, errorMessage = "Something went wrong. Please try again." } = options;
  const timeout = timeoutMs ? AbortSignal.timeout(timeoutMs) : undefined;
  const combinedSignal = signal && timeout ? AbortSignal.any([signal, timeout]) : signal || timeout;

  let res: Response;
  try {
    res = await fetch(path.startsWith("http") || path.startsWith(API_BASE_URL) ? path : `${API_BASE_URL}${path}`, {
      method,
      credentials: "include",
      cache,
      signal: combinedSignal,
      ...(body !== undefined ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") throw new ApiError("The request took too long. Please try again.", 408);
    throw error;
  }

  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    const fallback = res.status === 429 ? "Too many requests. Please wait a moment and try again." : errorMessage;
    throw new ApiError(data?.error || fallback, res.status);
  }
  return data as T;
}

/** SWR fetcher for API keys (full `${API_BASE_URL}/...` URLs). */
export const fetcher = <T = unknown>(url: string) => apiRequest<T>(url);
