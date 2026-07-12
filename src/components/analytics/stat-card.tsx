import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type StatCardProps = {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName?: string;
  changePercent?: number;
  changeLabel?: string;
  placeholder?: boolean;
  className?: string;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  iconClassName,
  changePercent,
  changeLabel,
  placeholder,
  className,
}: StatCardProps) {
  const hasTrend = typeof changePercent === "number";
  const trendUp = hasTrend && changePercent >= 0;
  const trendDown = hasTrend && changePercent < 0;

  return (
    <div
      className={cn(
        "group rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md",
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border",
            iconClassName ?? "border-border bg-muted text-muted-foreground"
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
        {placeholder ? (
          <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
            Placeholder
          </Badge>
        ) : null}
      </div>

      <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>

      {hasTrend ? (
        <div className="mt-3 flex items-center gap-1.5 text-[12px]">
          {trendUp ? (
            <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
          ) : trendDown ? (
            <TrendingDown className="h-3.5 w-3.5 text-rose-600" />
          ) : null}
          <span
            className={cn(
              "font-medium",
              trendUp && "text-emerald-600",
              trendDown && "text-rose-600",
              !trendUp && !trendDown && "text-muted-foreground"
            )}
          >
            {changePercent > 0 ? "+" : ""}
            {changePercent}%
          </span>
          {changeLabel ? (
            <span className="text-muted-foreground">{changeLabel}</span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
