import Link from "next/link";
import { ArrowRight, Calendar, Clock3 } from "lucide-react";
import { format, isValid } from "date-fns";
import { AiNews } from "@/types";
import { readMinutes } from "@/lib/utils";
import AiByline from "./ai-byline";
import { Badge } from "@/components/ui/badge";

/** Archive card for one AI report (see AiReportCardSkeleton for its loading state). */
export default function AiReportCard({ report }: { report: AiNews }) {
  const createdAt = new Date(report.createdAt);
  const sourceCount = report.sources?.length || 0;

  return (
    <Link
      href={`/ai-news/${report._id}`}
      className="group flex h-full flex-col rounded-2xl border bg-card p-6 transition-shadow hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="mb-6 flex items-center gap-2">
        <Badge variant="secondary" className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
          {report.reportType === "daily" ? "Daily edition" : "AI report"}
        </Badge>
        <div className="ml-auto flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {isValid(createdAt) && (
            <>
              <Calendar className="h-3 w-3" aria-hidden="true" />
              <time dateTime={report.createdAt}>{format(createdAt, "MMM d, yyyy")}</time>
            </>
          )}
          {report.wordCount ? (
            <>
              <Clock3 className="ml-1.5 h-3 w-3" aria-hidden="true" />
              {readMinutes(report.wordCount)} min read
            </>
          ) : null}
        </div>
      </div>

      <h3 className="text-xl font-bold leading-snug transition-colors group-hover:text-primary">{report.title}</h3>
      <p className="mb-6 mt-4 line-clamp-3 text-sm text-muted-foreground">{report.summary}</p>

      <div className="mt-auto flex items-center justify-between border-t pt-6">
        <AiByline report={report} />
        <div className="flex items-center gap-2">
          {sourceCount > 0 && (
            <span className="text-[10px] text-muted-foreground">
              {sourceCount} {sourceCount === 1 ? "source" : "sources"}
            </span>
          )}
          <span className="rounded-full bg-muted p-2 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>
      </div>
    </Link>
  );
}
