"use client";

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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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

/** Chip look shared by topic filters and other pill toggles (h-10 matches the Region/Filters controls). */
export const chipClassName = cn(
  "h-10 shrink-0 gap-2 rounded-full border border-border bg-background px-4 text-sm font-medium text-foreground transition-all",
  "hover:-translate-y-px hover:border-primary/60 hover:bg-primary/5 hover:text-primary hover:shadow-sm active:translate-y-0",
  "data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground data-[state=on]:shadow-sm data-[state=on]:hover:translate-y-0",
);

interface CategoryFilterProps {
  options: { id: string; name: string }[];
  value: string;
  onChange: (id: string) => void;
  label: string;
  className?: string;
}

/**
 * Single-select topic chips built on shadcn ToggleGroup (roving focus and arrow
 * keys). Unselected chips are bordered and full-contrast so they read as clickable.
 */
export function CategoryFilter({ options, value, onChange, label, className }: CategoryFilterProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      // A topic is always selected; ignore Radix's "deselect" event.
      onValueChange={(next) => next && onChange(next)}
      spacing={2}
      aria-label={label}
      className={cn("-mx-1.5 w-full justify-start overflow-x-auto p-1.5", className)}
    >
      {options.map(({ id, name }) => {
        const Icon = CATEGORY_ICONS[id];
        return (
          <ToggleGroupItem key={id} value={id} className={chipClassName}>
            {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
            {name}
          </ToggleGroupItem>
        );
      })}
    </ToggleGroup>
  );
}
