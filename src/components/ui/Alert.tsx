import { cn } from "@/lib/utils/cn";
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  X,
} from "lucide-react";

type AlertVariant = "success" | "warning" | "error" | "info";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
  onDismiss?: () => void;
}

const variants = {
  success: {
    wrapper: "bg-emerald-50 border-emerald-200 text-emerald-800",
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
  },
  warning: {
    wrapper: "bg-amber-50 border-amber-200 text-amber-800",
    icon: <AlertTriangle className="h-5 w-5 text-amber-500" />,
  },
  error: {
    wrapper: "bg-red-50 border-red-200 text-red-800",
    icon: <XCircle className="h-5 w-5 text-red-500" />,
  },
  info: {
    wrapper: "bg-sky-50 border-sky-200 text-sky-800",
    icon: <Info className="h-5 w-5 text-sky-500" />,
  },
};

export function Alert({
  variant = "info",
  title,
  children,
  className,
  onDismiss,
}: AlertProps) {
  const { wrapper, icon } = variants[variant];

  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border p-4",
        wrapper,
        className
      )}
      role="alert"
    >
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 text-sm">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <div>{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 -mt-0.5 -mr-1 p-1 rounded opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
