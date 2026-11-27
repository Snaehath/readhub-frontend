/* eslint-disable @next/next/no-img-element -- small local avatar SVG/PNG files */
"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { avatarOptions } from "@/constants";
import { cn } from "@/lib/utils";

interface AvatarPickerProps {
  value: string;
  onChange: (value: string) => void;
  /** Image size in px. */
  size?: number;
  className?: string;
  "aria-labelledby"?: string;
}

/** Single-choice avatar grid (shadcn ToggleGroup: arrow-key navigation, pressed state). */
export function AvatarPicker({ value, onChange, size = 56, className, ...aria }: AvatarPickerProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      // Radix allows clearing a single group; an avatar is always required.
      onValueChange={(next) => next && onChange(next)}
      spacing={3}
      className={cn("flex flex-wrap justify-center", className)}
      {...aria}
    >
      {avatarOptions.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          aria-label={option.label}
          className="h-auto rounded-full border-2 border-transparent p-1 data-[state=on]:border-primary data-[state=on]:bg-primary/5"
        >
          <img src={option.value} alt="" width={size} height={size} className="rounded-full" />
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
