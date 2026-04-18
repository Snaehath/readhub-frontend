import { useState } from "react";

export function useFutureAi(token: string | null, selectedCountry: string) {
  const [loading, setLoading] = useState(false);
  const [futureAiArticle, setFutureAiArticle] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const fetchFutureAi = async (id: string, targetYear: number = 1, previousForecast: string = "") => {
    setLoading(true);
    setError(null);
    setCurrentYear(targetYear);

    if (!token) {
      setError(
        "Authentication Required: Please sign in to access Forecast AI insights.",
      );
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
        body: JSON.stringify({ 
          userMessage: { 
            id, 
            selectedCountry,
            targetYear,
            previousForecast: previousForecast.slice(-2000) // Send last 2000 chars as context only
          } 
        }),
      });

      const data = await res.json();
      const newPart = data?.futureArticle?.trim() || "Simulation path interrupted.";
      
      if (targetYear === 1) {
        setFutureAiArticle(newPart);
      } else {
        setFutureAiArticle(prev => prev + "\n\n" + newPart);
      }
    } catch (err) {
      setError(`Simulation Protocol Error: ${err}`);
    } finally {
      setLoading(false);
    }
  };

  const resetFutureAi = () => {
    setFutureAiArticle(null);
    setCurrentYear(1);
    setError(null);
  };

  return { loading, futureAiArticle, currentYear, error, fetchFutureAi, resetFutureAi };
}
