import { cn } from "@/lib/utils";

export function StatsCard({ title, value, icon, trend, trendUp, className }) {
  return (
    <div className={cn("bg-card rounded-xl p-5 shadow-card border border-border", className)}>
      <div className="flex items-start justify-between mb-3">
        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
          {icon}
        </div>
        {trend && (
          <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", trendUp ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive")}>
            {trend}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-card-foreground font-display">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{title}</div>
    </div>
  );
}
