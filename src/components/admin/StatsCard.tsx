import { cn } from "@/lib/utils/cn";
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    positive: boolean;
  };
  accent?: "brand" | "emerald" | "amber" | "sky";
}

const accents = {
  brand: {
    icon: "bg-brand-50 text-brand-700",
    value: "text-brand-900",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-700",
    value: "text-emerald-900",
  },
  amber: {
    icon: "bg-amber-50 text-amber-700",
    value: "text-amber-900",
  },
  sky: {
    icon: "bg-sky-50 text-sky-700",
    value: "text-sky-900",
  },
};

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  accent = "brand",
}: StatsCardProps) {
  const colors = accents[accent];

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            {title}
          </p>
          <p className={cn("mt-1.5 text-3xl font-bold tracking-tight", colors.value)}>
            {value}
          </p>
          {description && (
            <p className="mt-1 text-xs text-neutral-500 truncate">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                "mt-1.5 text-xs font-medium",
                trend.positive ? "text-emerald-600" : "text-red-500"
              )}
            >
              {trend.positive ? "↑" : "↓"} {trend.value}
            </p>
          )}
        </div>
        <div className={cn("rounded-xl p-3 flex-shrink-0", colors.icon)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
