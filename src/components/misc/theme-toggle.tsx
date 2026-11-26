"use client";

import { useEffect, useState } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import ToolTip from "@/components/ui/custom/tooltip";

const CYCLE = ["light", "dark", "system"] as const;
type ThemeChoice = (typeof CYCLE)[number];

const META: Record<ThemeChoice, { label: string; icon: typeof Sun }> = {
  light: { label: "Light", icon: Sun },
  dark: { label: "Dark", icon: Moon },
  system: { label: "System", icon: Monitor },
};

/** One button that cycles Light → Dark → System. The icon shows the current mode. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // The stored theme is only known on the client; render a stable placeholder until then.
  useEffect(() => setMounted(true), []);

  const current: ThemeChoice = mounted && CYCLE.includes(theme as ThemeChoice) ? (theme as ThemeChoice) : "system";
  const next = CYCLE[(CYCLE.indexOf(current) + 1) % CYCLE.length];
  const Icon = META[current].icon;
  const label = `Theme: ${META[current].label}. Switch to ${META[next].label.toLowerCase()}`;

  return (
    <ToolTip content={`${META[current].label} theme · click for ${META[next].label.toLowerCase()}`}>
      <Button variant="outline" size="icon" onClick={() => setTheme(next)} aria-label={label} disabled={!mounted}>
        <Icon className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" />
      </Button>
    </ToolTip>
  );
}
