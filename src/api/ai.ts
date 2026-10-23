import { API_BASE_URL } from "@/constants";

export interface ChatRequest {
  userMessage: string | {
    id: string;
    selectedCountry: string;
  };
}

export interface FutureNewsRequest {
  userMessage: {
    id: string;
    selectedCountry: string;
    targetYear?: number;
    previousForecast?: string;
  };
}

export const sendChatRequest = async (payload: ChatRequest) => {
  const res = await fetch(`${API_BASE_URL}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`AI Chat failed with status ${res.status}`);
  }

  return res.json();
};

export const fetchFutureNews = async (payload: FutureNewsRequest) => {
  const res = await fetch(`${API_BASE_URL}/ai/futureNews`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const message = errorBody?.error || errorBody?.message;
    throw new Error(message || `Future News forecast failed with status ${res.status}`);
  }

  return res.json();
};
