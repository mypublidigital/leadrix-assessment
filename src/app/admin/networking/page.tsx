import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { NetworkingMatchWithStudents, StudentWithAssessment } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { GenerateMatchesButton } from "@/components/admin/networking/GenerateMatchesButton";
import { MatchCard } from "@/components/admin/networking/MatchCard";
import { generateNetworkingMatches } from "@/lib/utils/matching";
import { Network, Users, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Networking",
};

export default async function NetworkingPage() {
  const supabase = await createClient();

  const [matchesResult, studentsResult] = await Promise.all([
    supabase
      .from("networking_matches")
      .select(`
        *,
        student_a:students!networking_matches_student_a_id_fkey(id, full_name, preferred_name, job_title, industry),
        student_b:students!networking_matches_student_b_id_fkey(id, full_name, preferred_name, job_title, industry)
      `)
      .order("match_score", { ascending: false }),
    supabase
      .from("students")
      .select(`*, assessment_responses!inner(*)`)
      .eq("assessment_responses.is_complete", true)
      .eq("assessment_responses.opt_in_matchmaking", true),
  ]);

  const matches = (matchesResult.data ?? []) as NetworkingMatchWithStudents[];
  const studentsOptedIn = (studentsResult.data ?? []) as StudentWithAssessment[];

  // Preview de matches potenciais (sem salvar)
  const previewMatches = generateNetworkingMatches(studentsOptedIn, 3.0, 6);

  const groupedMatches = {
    suggested: matches.filter((m) => m.status === "suggested"),
    approved: matches.filter((m) => m.status === "approved"),
    contacted: matches.filter((m) => m.status === "contacted"),
    dismissed: matches.filter((m) => m.status === "dismissed"),
  };

  return (
    <div className="px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Networking</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Sugestões de conexão baseadas nos perfis dos alunos
          </p>
        </div>
        <GenerateMatchesButton />
      </div>

      {/* Stats rápidas */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-brand-700">{studentsOptedIn.length}</p>
          <p className="text-xs text-neutral-500 mt-1">Com opt-in</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-neutral-700">{groupedMatches.suggested.length}</p>
          <p className="text-xs text-neutral-500 mt-1">Sugeridos</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-emerald-700">{groupedMatches.approved.length}</p>
          <p className="text-xs text-neutral-500 mt-1">Aprovados</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-2xl font-bold text-sky-700">{groupedMatches.contacted.length}</p>
          <p className="text-xs text-neutral-500 mt-1">Conectados</p>
        </div>
      </div>

      {/* Preview de matches potenciais (se não há matches salvos) */}
      {matches.length === 0 && previewMatches.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              <CardTitle>Preview — Matches Potenciais</CardTitle>
              <Badge variant="warning" size="sm">Preview</Badge>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Análise preliminar. Clique em "Gerar Matches" para salvar e gerenciar as sugestões.
            </p>
          </CardHeader>
          <div className="space-y-3">
            {previewMatches.map((match, i) => (
              <div
                key={i}
                className="rounded-xl border border-neutral-200 bg-neutral-50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {match.students.map((s) => (
                        <div
                          key={s.id}
                          className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-white text-sm font-semibold border-2 border-white"
                        >
                          {(s.preferred_name ?? s.full_name).charAt(0).toUpperCase()}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-800">
                        {match.students.map(s => s.preferred_name ?? s.full_name).join(" × ")}
                      </p>
                      <p className="text-xs text-neutral-500 mt-0.5">
                        {match.reason}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-xs font-bold text-brand-700 bg-brand-50 border border-brand-100 px-2 py-0.5 rounded-full">
                      {match.score}/10
                    </span>
                  </div>
                </div>
                {match.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {match.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block rounded-full bg-white border border-neutral-200 px-2 py-0.5 text-[10px] text-neutral-500"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Matches salvos */}
      {groupedMatches.suggested.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-800 flex items-center gap-2">
            <Network className="h-4 w-4 text-brand-600" />
            Sugestões Pendentes ({groupedMatches.suggested.length})
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {groupedMatches.suggested.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {groupedMatches.approved.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-neutral-800 flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-600" />
            Aprovados ({groupedMatches.approved.length})
          </h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {groupedMatches.approved.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}

      {matches.length === 0 && studentsOptedIn.length < 2 && (
        <div className="card p-12 text-center">
          <Network className="mx-auto h-10 w-10 text-neutral-300 mb-3" />
          <h3 className="text-base font-semibold text-neutral-700">
            Ainda não há alunos suficientes para matching
          </h3>
          <p className="mt-2 text-sm text-neutral-500">
            Você precisa de pelo menos 2 alunos com opt-in de networking e
            assessment completo.
          </p>
        </div>
      )}
    </div>
  );
}
