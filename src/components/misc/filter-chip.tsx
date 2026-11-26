import {
  Atom,
  BookOpen,
  Briefcase,
  Clapperboard,
  Cpu,
  Ghost,
  HeartPulse,
  Landmark,
  LayoutGrid,
  Scroll,
  Smile,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  all: LayoutGrid,
  technology: Cpu,
  business: Briefcase,
  politics: Landmark,
  health: HeartPulse,
  sports: Trophy,
  science: Atom,
  entertainment: Clapperboard,
  history: Scroll,
  horror: Ghost,
  children: Smile,
  fiction: BookOpen,
};

interface FilterChipProps {
  id: string;
  label: string;
  selected: boolean;
  onSelect: () => void;
}

/**
 * Selectable topic chip. Unselected chips use a bordered, full-contrast style
 * (not muted grey) so they read as clickable rather than disabled.
 */
export function FilterChip({ id, label, selected, onSelect }: FilterChipProps) {
  const Icon = CATEGORY_ICONS[id];
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "inline-flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-medium transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        selected
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-background text-foreground hover:-translate-y-px hover:border-primary/60 hover:bg-primary/5 hover:text-primary hover:shadow-sm active:translate-y-0",
      )}
    >
      {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
      {label}
    </button>
  );
}
