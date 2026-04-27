"use client";

import { cn } from "@/lib/utils/cn";

interface RadioOption {
  value: string;
  label: string;
  description?: string;
}

interface RadioGroupProps {
  label?: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  required?: boolean;
  columns?: 1 | 2;
}

export function RadioGroup({
  label,
  options,
  value,
  onChange,
  error,
  hint,
  required,
  columns = 1,
}: RadioGroupProps) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="text-sm font-medium text-neutral-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <div className={cn("grid gap-2", gridCols[columns])}>
        {options.map((option) => {
          const isSelected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={cn(
                "flex items-start gap-3 rounded-lg border px-4 py-3 text-left transition-all duration-150",
                isSelected
                  ? "border-brand-600 bg-brand-50"
                  : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50"
              )}
              aria-pressed={isSelected}
            >
              <div
                className={cn(
                  "flex h-5 w-5 flex-shrink-0 mt-0.5 items-center justify-center rounded-full border-2 transition-colors",
                  isSelected
                    ? "border-brand-600"
                    : "border-neutral-300"
                )}
              >
                {isSelected && (
                  <div className="h-2.5 w-2.5 rounded-full bg-brand-700" />
                )}
              </div>
              <div>
                <p
                  className={cn(
                    "text-sm font-medium leading-snug",
                    isSelected ? "text-brand-800" : "text-neutral-700"
                  )}
                >
                  {option.label}
                </p>
                {option.description && (
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {option.description}
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {hint && !error && <p className="text-xs text-neutral-500">{hint}</p>}
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
