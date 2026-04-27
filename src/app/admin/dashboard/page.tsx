import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { StatsCard } from "@/components/admin/StatsCard";
import { InsightCard } from "@/components/admin/InsightCard";
import { generateDidacticInsights } from "@/lib/utils/insights";
import { getTopChallenges, getTopNetworkingTopics } from "@/lib/utils/matching";
import type { StudentWithAssessment } from "@/lib/types";
import {
  Users,
  CheckSquare,
  TrendingUp,
  Star,
  Clock,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export const metadata: Metadata = {
  title: "Visão Geral",
};

export default async function DashboardPage() {
  const supabase = await createClient();

  // Buscar dados principais
  const [studentsResult, responsesResult] = await Promise.all([
    supabase
      .from("students")
      .select(`*, assessment_responses(*)`)
      .order("created_at", { ascending: false }),
    supabase
      .from("assessment_responses")
      .select("*")
      .eq("is_complete", true),
  ]);

  const students = (studentsResult.data ?? []) as StudentWithAssessment[];
  const completeResponses = responsesResult.data ?? [];

  // Calcular stats
  const totalStudents = students.length;
  const completeCount = completeResponses.length;
  const completionRate =
    totalStudents > 0 ? Math.round((completeCount / totalStudents) * 100) : 0;

  const avgMaturity =
    completeResponses.length > 0
      ? (
          completeResponses.reduce(
            (sum, r) => sum + (r.ai_maturity_score ?? 0),
            0
          ) / completeResponses.length
        ).toFixed(1)
      : "—";

  const recentStudents = students.slice(0, 5);

  // Insights
  const studentsWithAssessment = students.filter(
    (s) => s.assessment_responses
  );
  const insights = generateDidacticInsights(studentsWithAssessment);
  const topChallenges = getTopChallenges(studentsWithAssessment, 5);
  const topTopics = getTopNetworkingTopics(studentsWithAssessment, 5);

  return (
    <div className="px-6 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Visão Geral</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Resumo das respostas e insights da turma
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total de Alunos"
          value={totalStudents}
          description="cadastros recebidos"
          icon={Users}
          accent="brand"
        />
        <StatsCard
          title="Respostas Completas"
          value={completeCount}
          description={`${completionRate}% de conclusão`}
          icon={CheckSquare}
          accent="emerald"
        />
        <StatsCard
          title="Maturidade Média"
          value={avgMaturity}
          description="escala de 1 a 5"
          icon={TrendingUp}
          accent="amber"
        />
        <StatsCard
          title="Opt-in Networking"
          value={
            completeResponses.filter((r) => r.opt_in_matchmaking).length
          }
          description="querem matchmaking"
          icon={Star}
          accent="sky"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Insights da turma */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-neutral-900">
              Insights Acionáveis
            </h2>
            <Link
              href="/admin/analytics"
              className="text-xs font-medium text-brand-700 hover:underline"
            >
              Ver analytics completo →
            </Link>
          </div>

          {insights.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-sm text-neutral-500">
                Ainda não há respostas suficientes para gerar insights.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {insights.slice(0, 4).map((insight, i) => (
                <InsightCard key={i} insight={insight} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar de contexto */}
        <div className="space-y-4">
          {/* Últimos cadastros */}
          <div className="card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-neutral-800">
                Últimos Cadastros
              </h3>
              <Link
                href="/admin/students"
                className="text-xs text-brand-700 hover:underline"
              >
                Ver todos
              </Link>
            </div>
            {recentStudents.length === 0 ? (
              <p className="text-xs text-neutral-400">Nenhum cadastro ainda.</p>
            ) : (
              <ul className="space-y-2.5">
                {recentStudents.map((student) => (
                  <li key={student.id}>
                    <Link
                      href={`/admin/students/${student.id}`}
                      className="flex items-center gap-2.5 group"
                    >
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 text-xs font-semibold">
                        {(student.preferred_name ?? student.full_name)
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-neutral-800 truncate group-hover:text-brand-700">
                          {student.preferred_name ?? student.full_name}
                        </p>
                        <p className="text-[11px] text-neutral-400 truncate">
                          {student.job_title ?? "—"} •{" "}
                          {formatDistanceToNow(new Date(student.created_at), {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Top desafios */}
          {topChallenges.length > 0 && (
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-neutral-800 mb-3">
                Principais Desafios
              </h3>
              <ul className="space-y-2">
                {topChallenges.map(({ challenge, count }) => (
                  <li
                    key={challenge}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="text-xs text-neutral-600 leading-tight truncate">
                      {challenge}
                    </span>
                    <span className="text-xs font-semibold text-brand-700 flex-shrink-0 bg-brand-50 px-2 py-0.5 rounded-full">
                      {count}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Top tópicos networking */}
          {topTopics.length > 0 && (
            <div className="card p-4">
              <h3 className="text-sm font-semibold text-neutral-800 mb-3">
                Tópicos de Networking
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {topTopics.map(({ topic }) => (
                  <span
                    key={topic}
                    className="inline-block rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-600"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
