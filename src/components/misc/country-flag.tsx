import { Globe2 } from "lucide-react";
import { Flag } from "@/components/flags/flag";
import { cn } from "@/lib/utils";

/**
 * Country flag via flagcn (SVG artwork loaded lazily from a CDN, nothing bundled).
 * "world" shows a globe. Decorative because the country name is always shown next to it.
 */
export function CountryFlag({ code, className }: { code: string; className?: string }) {
  if (!/^[a-z]{2}$/.test(code)) return <Globe2 className={cn("h-4 w-4 shrink-0 text-primary", className)} aria-hidden="true" />;
  return <Flag code={code} width={20} decorative className={cn("h-[15px] w-5 shrink-0 rounded-[2px] shadow-[0_0_0_1px_rgb(0_0_0/0.1)]", className)} />;
}
