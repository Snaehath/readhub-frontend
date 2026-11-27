"use client";

import { Check, Languages, X } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { SearchableSelect } from "@/components/misc/searchable-select";
import { CountryFlag } from "@/components/misc/country-flag";
import { newsCountries, newsLanguages } from "@/constants";
import { MAX_REGIONS } from "@/lib/preferences";
import { cn } from "@/lib/utils";

// "All languages" mixes scripts in one feed, so it isn't offered as a preference.
const LANGUAGE_OPTIONS = newsLanguages
  .filter(({ id }) => id !== "all")
  .map(({ id, name }) => ({ id, name, icon: <Languages className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" /> }));

const countryName = (id: string) => newsCountries.find((country) => country.id === id)?.name ?? id;

interface PreferencesFormProps {
  language: string;
  regions: string[];
  onLanguageChange: (language: string) => void;
  onRegionsChange: (regions: string[]) => void;
  /** "split" puts language and regions side by side on wider screens (profile page). */
  layout?: "stacked" | "split";
}

/** Language + regions picker shared by the profile page and the first-run prompt. */
export function PreferencesForm({ language, regions, onLanguageChange, onRegionsChange, layout = "stacked" }: PreferencesFormProps) {
  const toggleRegion = (id: string) => {
    if (regions.includes(id)) onRegionsChange(regions.filter((region) => region !== id));
    else if (regions.length < MAX_REGIONS) onRegionsChange([...regions, id]);
  };

  return (
    <div className={cn("grid gap-6", layout === "split" && "md:grid-cols-[minmax(0,240px)_minmax(0,1fr)]")}>
      <div className="space-y-2">
        <p className="text-sm font-medium" id="pref-language">News language</p>
        <SearchableSelect
          label="News language"
          value={language}
          options={LANGUAGE_OPTIONS}
          onChange={onLanguageChange}
          searchPlaceholder="Search languages…"
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">Stories are shown in this language where the source supports it.</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-sm font-medium">Regions</p>
          <span className="text-xs text-muted-foreground">{regions.length}/{MAX_REGIONS} selected</span>
        </div>
        <p className="text-xs text-muted-foreground">Only these appear in the news region switcher. Choose at least one.</p>

        {regions.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Selected regions">
            {regions.map((id) => (
              <li key={id}>
                <Badge asChild variant="outline" className="h-7 gap-1.5 rounded-full bg-card pl-2 pr-1.5 font-normal hover:border-destructive/50">
                  <button type="button" onClick={() => toggleRegion(id)} aria-label={`Remove ${countryName(id)}`}>
                    <CountryFlag code={id} />
                    {countryName(id)}
                    <X className="text-muted-foreground" aria-hidden="true" />
                  </button>
                </Badge>
              </li>
            ))}
          </ul>
        )}

        <Command className="h-auto rounded-lg border">
          <CommandInput placeholder="Search countries…" />
          <CommandList className="max-h-56">
            <CommandEmpty>No match.</CommandEmpty>
            <CommandGroup>
              {newsCountries.map(({ id, name }) => {
                const selected = regions.includes(id);
                const disabled = !selected && regions.length >= MAX_REGIONS;
                return (
                  <CommandItem key={id} value={`${name} ${id}`} onSelect={() => toggleRegion(id)} disabled={disabled} aria-selected={selected}>
                    <span className={cn("flex h-4 w-4 items-center justify-center rounded-sm border", selected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40")}>
                      {selected && <Check className="h-3 w-3" aria-hidden="true" />}
                    </span>
                    <CountryFlag code={id} />
                    <span className="truncate">{name}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </div>
  );
}
