import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const VARIANTS: Record<string, string> = {
  PUBLISHED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  ACTIVE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  DRAFT: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  SCHEDULED: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400",
  ARCHIVED: "bg-muted text-muted-foreground",
  INACTIVE: "bg-muted text-muted-foreground",
  NEW: "bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-400",
  CONTACTED: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  CONFIRMED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  COMPLETED: "bg-primary/15 text-primary",
  CANCELLED: "bg-destructive/10 text-destructive",
  RESPONDED: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-400",
  CLOSED: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <Badge className={cn("font-normal capitalize", VARIANTS[status] ?? "bg-muted text-muted-foreground")} variant="outline">
      {status.toLowerCase().replace(/_/g, " ")}
    </Badge>
  );
}
