import { useState } from "react";

export function useFutureAi(token: string | null, selectedCountry: string) {
  const [loading, setLoading] = useState(false);
  const [futureAiArticle, setFutureAiArticle] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchFutureAi = async (id: string) => {
    setLoading(true);
    setError(null);

    if (!token) {
      setError("🔒 Please log in to use AI features.");
      setLoading(false);
      return;
    }

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://readhub-backend.onrender.com/api";
      const res = await fetch(`${baseUrl}/ai/futureNews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userMessage: { id, selectedCountry } }),
      });

      const data = await res.json();
      setFutureAiArticle(data?.futureArticle?.trim() || "No response.");
    } catch (err) {
      setError(`An error occurred: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const resetFutureAi = () => {
    setFutureAiArticle(null);
    setError(null);
  };

  return { loading, futureAiArticle, error, fetchFutureAi, resetFutureAi };
}
