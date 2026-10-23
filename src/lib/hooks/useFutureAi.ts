import { useState } from "react";
import { fetchFutureNews } from "@/api/ai";

export function useFutureAi(isAuthenticated: boolean, selectedCountry: string) {
  const [loading, setLoading] = useState(false);
  const [futureAiArticle, setFutureAiArticle] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const fetchFutureAi = async (id: string, targetYear: number = 1, previousForecast: string = "") => {
    setLoading(true);
    setError(null);
    setCurrentYear(targetYear);

    if (!isAuthenticated) {
      setError(
        "Authentication Required: Please sign in to access Forecast AI insights.",
      );
      setLoading(false);
      return;
    }

    try {
      // The UI tracks forecast steps (Year 1, Year 2, ...); the API expects a calendar year.
      const forecastCalendarYear = new Date().getFullYear() + targetYear;
      const data = await fetchFutureNews({
        userMessage: {
          id,
          selectedCountry,
          targetYear: forecastCalendarYear,
          previousForecast: previousForecast.slice(-2000), // Send last 2000 chars as context only
        },
      });
      const newPart = data?.reply?.trim() || "Simulation path interrupted.";
      
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
