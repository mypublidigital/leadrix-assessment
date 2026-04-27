"use client";

import { cn } from "@/lib/utils/cn";
import { Check } from "lucide-react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function ProgressBar({
  currentStep,
  totalSteps,
  stepLabels,
}: ProgressBarProps) {
  const progressPercent = Math.round(((currentStep) / totalSteps) * 100);

  return (
    <div className="w-full">
      {/* Barra de progresso linear */}
      <div className="relative mb-6">
        <div className="h-1.5 w-full rounded-full bg-neutral-200">
          <div
            className="h-1.5 rounded-full bg-brand-700 transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Label de progresso */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-neutral-500">
            Etapa {currentStep + 1} de {totalSteps}
          </span>
          <span className="text-xs font-medium text-brand-700">
            {progressPercent}% concluído
          </span>
        </div>
      </div>

      {/* Steps visuais — apenas desktop */}
      <div className="hidden md:flex items-center justify-between">
        {stepLabels.map((label, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;

          return (
            <div
              key={index}
              className={cn(
                "flex flex-col items-center gap-1.5 flex-1",
                index < stepLabels.length - 1 && "relative"
              )}
            >
              {/* Linha conectora */}
              {index < stepLabels.length - 1 && (
                <div
                  className={cn(
                    "absolute top-4 left-1/2 w-full h-0.5",
                    isCompleted ? "bg-brand-700" : "bg-neutral-200"
                  )}
                />
              )}

              {/* Círculo do step */}
              <div
                className={cn(
                  "relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all duration-300",
                  isCompleted &&
                    "bg-brand-700 text-white",
                  isCurrent &&
                    "bg-brand-700 text-white ring-4 ring-brand-100",
                  !isCompleted &&
                    !isCurrent &&
                    "bg-neutral-100 text-neutral-400 border border-neutral-200"
                )}
              >
                {isCompleted ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Label do step */}
              <span
                className={cn(
                  "text-center text-xs leading-tight max-w-[80px]",
                  isCurrent ? "text-brand-700 font-semibold" : "text-neutral-400"
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
