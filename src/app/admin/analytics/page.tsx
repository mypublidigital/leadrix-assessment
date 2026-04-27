import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { InsightCard } from "@/components/admin/InsightCard";
import { MaturityChart } from "@/components/admin/analytics/MaturityChart";
import { IndustryChart } from "@/components/admin/analytics/IndustryChart";
import { PriorityAreasChart } from "@/components/admin/analytics/PriorityAreasChart";
import { generateDidacticInsights } from "@/lib/utils/insights";
import { getTopChallenges, segmentByMaturity } from "@/lib/utils/matching";
import type { StudentWithAssessment } from "@/lib/types";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Analytics da Turma",
};

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("students")
    .select(`*, assessment_responses(*)`)
    .not("assessment_responses", "is", null);

  const students = (data ?? []) as StudentWithAssessment[];
  const withAssessment = students.filter(
    (s) => s.assessment_responses?.is_complete
  );

  const insights = generateDidacticInsights(withAssessment);
  const topChallenges = getTopChallenges(withAssessment, 10);
  const { beginners, intermediate, advanced } = segmentByMaturity(withAssessment);

  // Distribuição por maturidade
  const maturityData = [
    { name: "Iniciante", value: withAssessment.filter(s => s.assessment_responses?.ai_maturity_level === "iniciante").length, color: "#f59e0b" },
    { name: "Básico", value: withAssessment.filter(s => s.assessment_responses?.ai_maturity_level === "basico").length, color: "#f97316" },
    { name: "Intermediário", value: withAssessment.filter(s => s.assessment_responses?.ai_maturity_level === "intermediario").length, color: "#3b82f6" },
    { name: "Avançado", value: withAssessment.filter(s => s.assessment_responses?.ai_maturity_level === "avancado").length, color: "#10b981" },
    { name: "Especialista", value: withAssessment.filter(s => s.assessment_responses?.ai_maturity_level === "especialista").length, color: "#6366f1" },
  ].filter(d => d.value > 0);

  // Distribuição por setor
  const industryCount: Record<string, number> = {};
  students.forEach(s => {
    if (s.industry) {
      industryCount[s.industry] = (industryCount[s.industry] ?? 0) + 1;
    }
  });
  const industryData = Object.entries(industryCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }));

  // Áreas prioritárias
  const areaCount: Record<string, number> = {};
  withAssessment.forEach(s => {
    const area = s.assessment_responses?.priority_area;
    if (area) areaCount[area] = (areaCount[area] ?? 0) + 1;
  });
  const priorityAreasData = Object.entries(areaCount)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({ name: name.split(" e ")[0], full_name: name, value }));

  // Estilo de aprendizagem
  const styleCount: Record<string, number> = {};
  withAssessment.forEach(s => {
    const style = s.assessment_responses?.preferred_learning_style;
    if (style) styleCount[style] = (styleCount[style] ?? 0) + 1;
  });

  return (
    <div className="px-6 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Analytics da Turma</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Distribuições e padrões identificados nas respostas de {withAssessment.length} aluno
          {withAssessment.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Segmentação por maturidade */}
      <div className="card p-5">
        <h2 className="text-sm font-semibold text-neutral-700 mb-4">
          Segmentação por Maturidade em IA
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center rounded-xl bg-amber-50 border border-amber-100 p-4">
            <p className="text-3xl font-bold text-amber-700">{beginners.length}</p>
            <p className="text-xs font-medium text-amber-600 mt-1">Iniciantes / Básico</p>
            <p className="text-xs text-amber-500">Precisam de mais suporte</p>
          </div>
          <div className="text-center rounded-xl bg-sky-50 border border-sky-100 p-4">
            <p className="text-3xl font-bold text-sky-700">{intermediate.length}</p>
            <p className="text-xs font-medium text-sky-600 mt-1">Intermediário</p>
            <p className="text-xs text-sky-500">Usam IA regularmente</p>
          </div>
          <div className="text-center rounded-xl bg-emerald-50 border border-emerald-100 p-4">
            <p className="text-3xl font-bold text-emerald-700">{advanced.length}</p>
            <p className="text-xs font-medium text-emerald-600 mt-1">Avançado / Especialista</p>
            <p className="text-xs text-emerald-500">Prontos para casos complexos</p>
          </div>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Maturidade em IA</CardTitle>
          </CardHeader>
          <MaturityChart data={maturityData} />
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição por Setor</CardTitle>
          </CardHeader>
          <IndustryChart data={industryData} />
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Áreas Prioritárias</CardTitle>
        </CardHeader>
        <PriorityAreasChart data={priorityAreasData} />
      </Card>

      {/* Insights acionáveis */}
      <div className="space-y-4">
        <h2 className="text-base font-semibold text-neutral-900">
          Insights para Personalização Didática
        </h2>
        {insights.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-sm text-neutral-500">
              Complete mais assessments para gerar insights.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {insights.map((insight, i) => (
              <InsightCard key={i} insight={insight} />
            ))}
          </div>
        )}
      </div>

      {/* Principais desafios */}
      {topChallenges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Principais Desafios da Turma</CardTitle>
          </CardHeader>
          <div className="space-y-2">
            {topChallenges.map(({ challenge, count }) => {
              const maxCount = topChallenges[0].count;
              const pct = Math.round((count / maxCount) * 100);
              return (
                <div key={challenge} className="flex items-center gap-3">
                  <span className="text-sm text-neutral-700 w-64 flex-shrink-0 truncate">
                    {challenge}
                  </span>
                  <div className="flex-1 h-2 rounded-full bg-neutral-100">
                    <div
                      className="h-2 rounded-full bg-brand-600 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-neutral-600 w-6 text-right">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Estilo de aprendizagem */}
      {Object.keys(styleCount).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Estilos de Aprendizagem</CardTitle>
          </CardHeader>
          <div className="space-y-2">
            {Object.entries(styleCount)
              .sort(([, a], [, b]) => b - a)
              .map(([style, count]) => {
                const maxCount = Math.max(...Object.values(styleCount));
                const pct = Math.round((count / maxCount) * 100);
                return (
                  <div key={style} className="flex items-center gap-3">
                    <span className="text-sm text-neutral-700 flex-1 truncate">
                      {style}
                    </span>
                    <div className="w-24 h-2 rounded-full bg-neutral-100 flex-shrink-0">
                      <div
                        className="h-2 rounded-full bg-amber-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-neutral-600 w-5 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
          </div>
        </Card>
      )}
    </div>
  );
}
