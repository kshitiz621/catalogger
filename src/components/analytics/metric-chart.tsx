import type { TrendPoint } from "@/types/analytics";
import { cn } from "@/lib/utils";

export type MetricChartProps = {
  title: string;
  description?: string;
  data: TrendPoint[];
  colorClassName?: string;
  emptyLabel?: string;
  className?: string;
};

export function MetricChart({
  title,
  description,
  data,
  colorClassName = "bg-primary",
  emptyLabel = "No data yet",
  className,
}: MetricChartProps) {
  const maxValue = Math.max(...data.map((point) => point.value), 1);
  const hasData = data.some((point) => point.value > 0);

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm",
        className
      )}
    >
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-[14px] font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mt-0.5 text-[12px] text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <div className="px-5 py-5">
        {!hasData ? (
          <div className="flex h-40 items-center justify-center text-[13px] text-muted-foreground">
            {emptyLabel}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex h-40 items-end gap-1.5 sm:gap-2">
              {data.map((point) => {
                const height = Math.max((point.value / maxValue) * 100, point.value > 0 ? 8 : 0);
                return (
                  <div
                    key={point.date}
                    className="group/bar flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
                  >
                    <div className="relative flex h-full w-full items-end">
                      <div
                        className={cn(
                          "w-full rounded-t-md opacity-90 transition-opacity group-hover/bar:opacity-100",
                          colorClassName
                        )}
                        style={{ height: `${height}%` }}
                        title={`${point.label}: ${point.value.toLocaleString()}`}
                      />
                    </div>
                    <span className="hidden truncate text-[10px] text-muted-foreground sm:block">
                      {point.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground sm:hidden">
              <span>{data[0]?.label}</span>
              <span>{data[data.length - 1]?.label}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
