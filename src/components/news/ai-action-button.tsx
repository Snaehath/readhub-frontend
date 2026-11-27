"use client";

import { Sparkles, Telescope } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToolTip from "@/components/ui/custom/tooltip";
import { cn } from "@/lib/utils";
import { ArticleAiMode } from "@/lib/hooks/useArticleAi";

const STYLES: Record<ArticleAiMode, { icon: typeof Sparkles; tooltip: string; label: string; gradient: string; halo: string }> = {
  forecast: {
    icon: Telescope,
    tooltip: "Forecast how this story could develop",
    label: "Forecast",
    gradient: "from-sky-500 to-cyan-700 ring-cyan-400/60",
    halo: "bg-cyan-400/25",
  },
  explain: {
    icon: Sparkles,
    tooltip: "Ask AI to explain this article",
    label: "Ask AI about",
    gradient: "from-violet-600 to-indigo-700 ring-violet-400/60",
    halo: "bg-violet-400/25",
  },
};

/**
 * Gradient Ask AI / Forecast button with a light sweep and a soft pulsing halo
 * (both disabled for users who prefer reduced motion). Built on shadcn Button.
 */
export function AiActionButton({ mode, articleTitle, onClick }: { mode: ArticleAiMode; articleTitle: string; onClick: () => void }) {
  const { icon: Icon, tooltip, label, gradient, halo } = STYLES[mode];
  return (
    <span className="relative inline-flex">
      <span className={cn("pointer-events-none absolute inset-0 rounded-full animate-ping-slow", halo)} aria-hidden="true" />
      <ToolTip content={tooltip}>
        <Button
          size="icon-sm"
          onClick={onClick}
          aria-label={`${label}: ${articleTitle}`}
          className={cn(
            "is-shining relative overflow-hidden rounded-full bg-gradient-to-br text-white shadow-md ring-2 transition-transform hover:scale-105 hover:text-white",
            gradient,
          )}
        >
          <Icon className="relative z-10 size-4" aria-hidden="true" />
        </Button>
      </ToolTip>
    </span>
  );
}
