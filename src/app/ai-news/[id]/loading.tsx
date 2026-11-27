import { AiReportArticleSkeleton } from "@/components/misc/skeletons";

// Shown while the server fetches report metadata, before the client view mounts.
export default function Loading() {
  return <AiReportArticleSkeleton />;
}
