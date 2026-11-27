"use client";

import { Search, X } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

type SearchInputProps = Omit<React.ComponentProps<"input">, "type" | "value"> & {
  value: string;
  onClear: () => void;
};

/** Pill search field: shadcn InputGroup with a search icon and a clear button. */
export function SearchInput({ value, onClear, className, ...props }: SearchInputProps) {
  return (
    <InputGroup className={cn("h-11 rounded-full", className)}>
      <InputGroupAddon className="pl-4">
        <Search aria-hidden="true" />
      </InputGroupAddon>
      <InputGroupInput type="search" value={value} {...props} />
      {value && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton size="icon-sm" className="rounded-full" aria-label="Clear search" onClick={onClear}>
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
