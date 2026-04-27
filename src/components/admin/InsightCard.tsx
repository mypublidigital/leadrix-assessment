import { cn } from "@/lib/utils/cn";
import type { ClassInsight } from "@/lib/types";
import {
  Lightbulb,
  AlertTriangle,
  CheckCircle2,
  Zap,
} from "lucide-react";

interface InsightCardProps {
  insight: ClassInsight;
}

const typeConfig = {
  info: {
    icon: Lightbulb,
    wrapper: "border-sky-200 bg-sky-50",
    iconClass: "text-sky-600",
    badge: "bg-sky-100 text-sky-700",
    badgeLabel: "Informação",
  },
  warning: {
    icon: AlertTriangle,
    wrapper: "border-amber-200 bg-amber-50",
    iconClass: "text-amber-600",
    badge: "bg-amber-100 text-amber-700",
    badgeLabel: "Atenção",
  },
  success: {
    icon: CheckCircle2,
    wrapper: "border-emerald-200 bg-emerald-50",
    iconClass: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700",
    badgeLabel: "Oportunidade",
  },
  action: {
    icon: Zap,
    wrapper: "border-brand-200 bg-brand-50",
    iconClass: "text-brand-600",
    badge: "bg-brand-100 text-brand-700",
    badgeLabel: "Ação recomendada",
  },
};

export function InsightCard({ insight }: InsightCardProps) {
  const config = typeConfig[insight.type];
  const Icon = config.icon;

  return (
    <div className={cn("rounded-xl border p-4", config.wrapper)}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <Icon className={cn("h-4 w-4", config.iconClass)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-semibold text-neutral-800">
              {insight.title}
            </p>
            <span
              className={cn(
                "flex-shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide",
                config.badge
              )}
            >
              {config.badgeLabel}
            </span>
          </div>
          <p className="text-xs text-neutral-600 leading-relaxed">
            {insight.description}
          </p>
          {insight.students && insight.students.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {insight.students.slice(0, 5).map((name) => (
                <span
                  key={name}
                  className="inline-block rounded-full bg-white border border-neutral-200 px-2 py-0.5 text-[11px] text-neutral-600"
                >
                  {name}
                </span>
              ))}
              {insight.students.length > 5 && (
                <span className="inline-block px-2 py-0.5 text-[11px] text-neutral-400">
                  +{insight.students.length - 5} mais
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
