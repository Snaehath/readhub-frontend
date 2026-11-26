import { useCallback, useEffect, useRef, useState } from "react";
import { explainArticle, forecastArticle, InsightBasis } from "@/api/ai";
import { ArticleForecast, NewsArticle } from "@/types";

export type ArticleAiMode = "explain" | "forecast";

/**
 * State for the article AI dialog. Each open/retry starts one request; closing
 * the dialog or opening another article aborts the previous one (the server
 * then stops work too).
 */
export function useArticleAi(isAuthenticated: boolean) {
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [mode, setMode] = useState<ArticleAiMode>("explain");
  const [explanation, setExplanation] = useState("");
  const [forecast, setForecast] = useState<ArticleForecast | null>(null);
  const [basis, setBasis] = useState<InsightBasis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const run = useCallback(async (target: NewsArticle, nextMode: ArticleAiMode) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    setLoading(true);
    setError(null);
    try {
      if (nextMode === "explain") {
        const result = await explainArticle(target, controller.signal);
        if (controller.signal.aborted) return;
        setExplanation(result.content);
        setBasis(result.basis);
      } else {
        const result = await forecastArticle(target, controller.signal);
        if (controller.signal.aborted) return;
        setForecast(result.forecast);
        setBasis(result.basis);
      }
    } catch (err) {
      if (!controller.signal.aborted) setError(err instanceof Error ? err.message : "The AI service is temporarily unavailable.");
    } finally {
      if (controllerRef.current === controller) {
        controllerRef.current = null;
        setLoading(false);
      }
    }
  }, []);

  const open = useCallback((target: NewsArticle, nextMode: ArticleAiMode) => {
    setArticle(target);
    setMode(nextMode);
    setExplanation("");
    setForecast(null);
    setBasis(null);
    setError(null);
    if (isAuthenticated) void run(target, nextMode);
  }, [isAuthenticated, run]);

  const close = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setArticle(null);
    setLoading(false);
  }, []);

  const retry = useCallback(() => {
    if (article) void run(article, mode);
  }, [article, mode, run]);

  useEffect(() => () => controllerRef.current?.abort(), []);

  return { article, mode, explanation, forecast, basis, loading, error, open, close, retry };
}
