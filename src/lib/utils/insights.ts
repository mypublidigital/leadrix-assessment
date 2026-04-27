import type { StudentWithAssessment, ClassInsight } from "@/lib/types";
import {
  segmentByMaturity,
  getTopChallenges,
  getTopNetworkingTopics,
} from "./matching";

/**
 * Gera insights acionáveis para personalização didática baseados nas respostas da turma
 */
export function generateDidacticInsights(
  students: StudentWithAssessment[]
): ClassInsight[] {
  const insights: ClassInsight[] = [];
  const withAssessment = students.filter((s) => s.assessment_responses?.is_complete);

  if (withAssessment.length === 0) return [];

  const { beginners, intermediate, advanced } = segmentByMaturity(withAssessment);
  const topChallenges = getTopChallenges(withAssessment, 5);

  // Insight: maioria iniciante/básico
  if (beginners.length > withAssessment.length * 0.4) {
    insights.push({
      type: "action",
      title: "Dedique mais tempo ao onboarding de IA",
      description: `${beginners.length} de ${withAssessment.length} alunos (${Math.round((beginners.length / withAssessment.length) * 100)}%) são iniciantes ou básicos. Inclua exemplos sem código, analogias simples e um módulo introdutório sólido.`,
      students: beginners.map(
        (s) => s.preferred_name ?? s.full_name
      ),
      count: beginners.length,
    });
  }

  // Insight: turma mista — oportunidade de mentoria
  if (advanced.length > 0 && beginners.length > 0) {
    insights.push({
      type: "success",
      title: "Oportunidade de mentoria entre pares",
      description: `A turma tem ${advanced.length} alunos avançados e ${beginners.length} iniciantes — ideal para atividades de mentoria em duplas ou rodadas de troca de experiências.`,
      count: advanced.length + beginners.length,
    });
  }

  // Insight: maioria avançado
  if (advanced.length > withAssessment.length * 0.5) {
    insights.push({
      type: "info",
      title: "Turma avançada — aprofunde os casos técnicos",
      description: `Mais da metade da turma já usa IA em processos reais. Priorize arquitetura de soluções, casos de integração e problemas complexos ao invés de introduções básicas.`,
      count: advanced.length,
    });
  }

  // Insight: desafios mais comuns
  if (topChallenges.length > 0) {
    const topChallenge = topChallenges[0];
    if (topChallenge.count >= 2) {
      insights.push({
        type: "action",
        title: `Use "/${topChallenge.challenge}" como fio condutor das aulas`,
        description: `"${topChallenge.challenge}" é o desafio mais citado (${topChallenge.count} alunos). Centrar exemplos e exercícios neste tema aumenta a percepção de relevância do curso.`,
        count: topChallenge.count,
      });
    }
  }

  // Insight: áreas prioritárias
  const areaCounts: Record<string, number> = {};
  withAssessment.forEach((s) => {
    const area = s.assessment_responses?.priority_area;
    if (area) areaCounts[area] = (areaCounts[area] ?? 0) + 1;
  });
  const topArea = Object.entries(areaCounts).sort(([, a], [, b]) => b - a)[0];
  if (topArea && topArea[1] >= 2) {
    insights.push({
      type: "info",
      title: `Priorize casos de "${topArea[0]}"`,
      description: `${topArea[1]} alunos apontaram "${topArea[0]}" como área prioritária. Use exercícios práticos focados neste domínio.`,
      count: topArea[1],
    });
  }

  // Insight: alunos com barreiras de implementação
  const withBarriers = withAssessment.filter(
    (s) => (s.assessment_responses?.main_barriers?.length ?? 0) >= 2
  );
  if (withBarriers.length > 0) {
    insights.push({
      type: "warning",
      title: "Alguns alunos enfrentam múltiplas barreiras",
      description: `${withBarriers.length} aluno(s) citaram 2 ou mais barreiras para implementar IA. Considere reservar tempo para troubleshooting e suporte individualizado.`,
      students: withBarriers.map(
        (s) => s.preferred_name ?? s.full_name
      ),
      count: withBarriers.length,
    });
  }

  // Insight: problemas reais para laboratório
  const withRealProblems = withAssessment.filter(
    (s) => s.assessment_responses?.real_problem_to_use_in_course?.trim()
  );
  if (withRealProblems.length >= 3) {
    insights.push({
      type: "action",
      title: "Use os problemas reais dos alunos como laboratório",
      description: `${withRealProblems.length} alunos trouxeram problemas concretos para trabalhar no curso. Organize um laboratório prático onde cada um desenvolve sua própria solução.`,
      count: withRealProblems.length,
    });
  }

  // Insight: estilo de aprendizagem predominante
  const learningstyle: Record<string, number> = {};
  withAssessment.forEach((s) => {
    const style = s.assessment_responses?.preferred_learning_style;
    if (style) learningstyle[style] = (learningstyle[style] ?? 0) + 1;
  });
  const topStyle = Object.entries(learningstyle).sort(([, a], [, b]) => b - a)[0];
  if (topStyle && topStyle[1] >= 2) {
    insights.push({
      type: "info",
      title: `Adapte o formato: predomina "${topStyle[0]}"`,
      description: `${topStyle[1]} alunos preferem aprender "${topStyle[0]}". Calibre o ritmo e os formatos de exercício de acordo.`,
      count: topStyle[1],
    });
  }

  return insights;
}

/**
 * Gera insights específicos para um aluno individual
 */
export function generateStudentInsights(
  student: StudentWithAssessment
): string[] {
  const insights: string[] = [];
  const r = student.assessment_responses;

  if (!r) return ["Aluno ainda não completou o assessment."];

  const maturityScore = r.ai_maturity_score ?? 0;

  if (maturityScore <= 2) {
    insights.push(
      "Aluno iniciante/básico — priorize exemplos sem necessidade de código e acompanhamento mais próximo."
    );
  } else if (maturityScore >= 4) {
    insights.push(
      "Aluno avançado — pode trabalhar casos mais complexos e arquitetura de soluções."
    );
  }

  if (r.real_problem_to_use_in_course?.trim()) {
    insights.push(
      `Trouxe um problema real para o curso: "${r.real_problem_to_use_in_course.slice(0, 100)}..."`
    );
  }

  if ((r.main_barriers?.length ?? 0) >= 3) {
    insights.push(
      "Enfrenta múltiplas barreiras — pode precisar de suporte extra durante as atividades práticas."
    );
  }

  if (r.opt_in_matchmaking) {
    insights.push("Optou pelo matchmaking — incluir nas sugestões de networking.");
  }

  if (r.contribution_offer?.trim()) {
    insights.push(
      `Pode contribuir com: "${r.contribution_offer.slice(0, 80)}..."`
    );
  }

  const preferredStyle = r.preferred_learning_style;
  if (preferredStyle) {
    insights.push(`Estilo de aprendizagem preferido: ${preferredStyle}.`);
  }

  return insights;
}
