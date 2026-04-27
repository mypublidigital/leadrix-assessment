"use client";

import { cn } from "@/lib/utils/cn";
import { Check } from "lucide-react";

interface CheckboxGroupProps {
  label?: string;
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
  maxSelections?: number;
  error?: string;
  hint?: string;
  required?: boolean;
  columns?: 1 | 2 | 3;
}

export function CheckboxGroup({
  label,
  options,
  value,
  onChange,
  maxSelections,
  error,
  hint,
  required,
  columns = 1,
}: CheckboxGroupProps) {
  const handleToggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter((v) => v !== option));
    } else {
      if (maxSelections && value.length >= maxSelections) return;
      onChange([...value, option]);
    }
  };

  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  };

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="flex items-baseline justify-between">
          <label className="text-sm font-medium text-neutral-700">
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
          {maxSelections && (
            <span className="text-xs text-neutral-400">
              {value.length}/{maxSelections} selecionados
            </span>
          )}
        </div>
      )}

      <div className={cn("grid gap-2", gridCols[columns])}>
        {options.map((option) => {
          const isSelected = value.includes(option);
          const isDisabled =
            !isSelected && maxSelections !== undefined && value.length >= maxSelections;

          return (
            <button
              key={option}
              type="button"
              onClick={() => !isDisabled && handleToggle(option)}
              className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all duration-150",
                isSelected
                  ? "border-brand-600 bg-brand-50 text-brand-800"
                  : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50",
                isDisabled && "opacity-40 cursor-not-allowed"
              )}
              aria-pressed={isSelected}
              disabled={isDisabled}
            >
              <div
                className={cn(
                  "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded border-2 transition-colors",
                  isSelected
                    ? "border-brand-600 bg-brand-700"
                    : "border-neutral-300"
                )}
              >
                {isSelected && <Check className="h-3 w-3 text-white" />}
              </div>
              <span className="leading-tight">{option}</span>
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
