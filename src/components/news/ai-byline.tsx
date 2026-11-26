import { AiNews } from "@/types";

// Each persona gets a stable accent colour so readers recognise the desk.
const PERSONA_COLORS: Record<string, string> = {
  atlas: "from-sky-600 to-indigo-700",
  ledger: "from-amber-500 to-orange-700",
  orbit: "from-violet-600 to-fuchsia-700",
  pulse: "from-rose-500 to-red-700",
  sideline: "from-emerald-500 to-green-700",
  marquee: "from-pink-500 to-purple-700",
  dispatch: "from-zinc-700 to-zinc-900",
};

type Persona = NonNullable<AiNews["persona"]>;

/** Legacy reports (written before personas) fall back to a generic ReadHub AI byline. */
const resolvePersona = (report: Pick<AiNews, "persona" | "authorName" | "reportType">): Persona =>
  report.persona?.penName
    ? report.persona
    : {
        id: report.reportType === "daily" ? "dispatch" : "readhub",
        penName: "ReadHub AI",
        desk: report.reportType === "daily" ? "Daily Briefing Desk" : "AI Newsroom",
        bio: "Written by AI from the linked sources.",
      };

/**
 * Byline for AI-written reports. Personas are always labelled as AI so readers
 * are never led to think a human journalist wrote the piece.
 */
export default function AiByline({ report, size = "sm", showBio = false }: { report: Pick<AiNews, "persona" | "authorName" | "reportType">; size?: "sm" | "lg"; showBio?: boolean }) {
  const persona = resolvePersona(report);
  const avatar = size === "lg" ? "h-12 w-12 text-base" : "h-8 w-8 text-xs";

  return (
    <div className="flex min-w-0 items-center gap-3 text-left">
      <span
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-bold text-white ${PERSONA_COLORS[persona.id] || "from-indigo-500 to-violet-600"} ${avatar}`}
      >
        {persona.penName[0]}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5">
          <span className={`truncate font-semibold ${size === "lg" ? "text-base" : "text-sm"}`}>{persona.penName}</span>
          <span className="rounded bg-primary/10 px-1.5 py-px text-[10px] font-bold uppercase tracking-wide text-primary">AI</span>
        </span>
        <span className="block truncate text-xs text-muted-foreground">{persona.desk}</span>
        {showBio && <span className="mt-1 block max-w-md text-xs text-muted-foreground">{persona.bio}</span>}
      </span>
    </div>
  );
}
