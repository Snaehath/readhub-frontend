import { ArrowUpRight, type LucideIcon } from "lucide-react";

/** Attribution chip for a third-party data provider. */
export function PoweredBy({ name, href, icon: Icon, iconClassName }: { name: string; href: string; icon: LucideIcon; iconClassName?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-2 rounded-full border bg-card py-1 pl-1 pr-3 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
    >
      <span className={`flex h-6 w-6 items-center justify-center rounded-full ${iconClassName || "bg-primary/10 text-primary"}`}>
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      Powered by <span className="font-semibold text-foreground">{name}</span>
      <ArrowUpRight className="h-3 w-3 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
    </a>
  );
}
