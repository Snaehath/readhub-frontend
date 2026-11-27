import { cn } from "@/lib/utils";

/** shadcn skeleton: a pulsing placeholder block that uses theme tokens. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="skeleton" aria-hidden="true" className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />;
}

export { Skeleton };
