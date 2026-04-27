"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { NetworkingMatchWithStudents, MatchStatus } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { updateMatchStatus } from "@/lib/actions/admin";
import { Check, X, MessageSquare, Link } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import NextLink from "next/link";

interface MatchCardProps {
  match: NetworkingMatchWithStudents;
}

const STATUS_LABELS: Record<MatchStatus, string> = {
  suggested: "Sugerido",
  approved: "Aprovado",
  contacted: "Conectado",
  dismissed: "Ignorado",
};

const STATUS_VARIANTS: Record<MatchStatus, string> = {
  suggested: "neutral",
  approved: "success",
  contacted: "brand",
  dismissed: "danger",
};

export function MatchCard({ match }: MatchCardProps) {
  const [status, setStatus] = useState<MatchStatus>(match.status);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleUpdateStatus = (newStatus: MatchStatus) => {
    startTransition(async () => {
      const result = await updateMatchStatus(match.id, newStatus);
      if (result.success) {
        setStatus(newStatus);
        router.refresh();
      }
    });
  };

  return (
    <div className={cn(
      "card p-4 space-y-3",
      status === "dismissed" && "opacity-60"
    )}>
      {/* Alunos */}
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2">
          {[match.student_a, match.student_b].map((student) => (
            <div
              key={student.id}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-white text-sm font-semibold border-2 border-white"
            >
              {(student.preferred_name ?? student.full_name).charAt(0).toUpperCase()}
            </div>
          ))}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <NextLink
              href={`/admin/students/${match.student_a.id}`}
              className="text-sm font-medium text-neutral-800 hover:text-brand-700"
            >
              {match.student_a.preferred_name ?? match.student_a.full_name}
            </NextLink>
            <span className="text-neutral-400 text-xs">×</span>
            <NextLink
              href={`/admin/students/${match.student_b.id}`}
              className="text-sm font-medium text-neutral-800 hover:text-brand-700"
            >
              {match.student_b.preferred_name ?? match.student_b.full_name}
            </NextLink>
          </div>
          <p className="text-xs text-neutral-500 mt-0.5">
            {match.student_a.job_title ?? match.student_a.industry ?? "—"} ×{" "}
            {match.student_b.job_title ?? match.student_b.industry ?? "—"}
          </p>
        </div>

        <div className="flex-shrink-0 flex items-center gap-2">
          <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded-full">
            {match.match_score}/10
          </span>
          <Badge variant={STATUS_VARIANTS[status] as never} size="sm">
            {STATUS_LABELS[status]}
          </Badge>
        </div>
      </div>

      {/* Razão do match */}
      {match.match_reason && (
        <p className="text-xs text-neutral-600 leading-relaxed bg-neutral-50 rounded-lg p-2.5">
          {match.match_reason}
        </p>
      )}

      {/* Tags */}
      {match.match_tags && match.match_tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {match.match_tags.map((tag) => (
            <span
              key={tag}
              className="inline-block rounded-full bg-brand-50 border border-brand-100 px-2 py-0.5 text-[10px] text-brand-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Ações */}
      {status !== "dismissed" && (
        <div className="flex items-center gap-2 pt-1 border-t border-neutral-100">
          {status === "suggested" && (
            <button
              onClick={() => handleUpdateStatus("approved")}
              disabled={isPending}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              <Check className="h-3.5 w-3.5" />
              Aprovar
            </button>
          )}
          {status === "approved" && (
            <button
              onClick={() => handleUpdateStatus("contacted")}
              disabled={isPending}
              className="flex items-center gap-1.5 rounded-lg bg-sky-50 border border-sky-200 px-3 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-100 transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              Marcar como Conectado
            </button>
          )}
          <button
            onClick={() => handleUpdateStatus("dismissed")}
            disabled={isPending}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition-colors ml-auto"
          >
            <X className="h-3.5 w-3.5" />
            Ignorar
          </button>
        </div>
      )}

      {status === "dismissed" && (
        <div className="pt-1 border-t border-neutral-100">
          <button
            onClick={() => handleUpdateStatus("suggested")}
            disabled={isPending}
            className="text-xs text-neutral-400 hover:text-neutral-600"
          >
            Desfazer
          </button>
        </div>
      )}
    </div>
  );
}
