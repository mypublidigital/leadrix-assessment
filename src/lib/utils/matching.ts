import type {
  StudentWithAssessment,
  NetworkingGroup,
  Student,
} from "@/lib/types";

type StudentProfile = {
  student: Pick<
    Student,
    "id" | "full_name" | "preferred_name" | "job_title" | "industry"
  >;
  maturity_score: number;
  challenges: string[];
  networking_topics: string[];
  priority_area: string;
  contribution_offer: string;
  industry: string;
  opt_in: boolean;
};

/**
 * Extrai o perfil relevante para matchmaking de um StudentWithAssessment
 */
function extractProfile(s: StudentWithAssessment): StudentProfile | null {
  const r = s.assessment_responses;
  if (!r || !r.opt_in_matchmaking) return null;

  return {
    student: {
      id: s.id,
      full_name: s.full_name,
      preferred_name: s.preferred_name,
      job_title: s.job_title,
      industry: s.industry,
    },
    maturity_score: r.ai_maturity_score ?? 0,
    challenges: r.top_challenges ?? [],
    networking_topics: r.networking_topics ?? [],
    priority_area: r.priority_area ?? "",
    contribution_offer: r.contribution_offer ?? "",
    industry: s.industry ?? "",
    opt_in: r.opt_in_matchmaking,
  };
}

/**
 * Calcula o score de compatibilidade entre dois perfis (0-10)
 * Considera: desafios semelhantes, tópicos de networking, área prioritária,
 * maturidade complementar, setor e capacidade de contribuição cruzada.
 */
function calculateMatchScore(
  a: StudentProfile,
  b: StudentProfile
): { score: number; reasons: string[]; tags: string[] } {
  let score = 0;
  const reasons: string[] = [];
  const tags: string[] = [];

  // 1. Desafios em comum (peso 2.5)
  const commonChallenges = a.challenges.filter((c) =>
    b.challenges.some(
      (bc) => bc.toLowerCase().includes(c.toLowerCase().slice(0, 10)) || c.toLowerCase().includes(bc.toLowerCase().slice(0, 10))
    )
  );
  if (commonChallenges.length >= 2) {
    score += 2.5;
    reasons.push(`Compartilham ${commonChallenges.length} desafios semelhantes`);
    tags.push("desafios em comum");
  } else if (commonChallenges.length === 1) {
    score += 1.2;
    tags.push("desafio em comum");
  }

  // 2. Tópicos de networking em comum (peso 2.0)
  const commonTopics = a.networking_topics.filter((t) =>
    b.networking_topics.some(
      (bt) => bt.toLowerCase().includes(t.toLowerCase().slice(0, 8)) || t.toLowerCase().includes(bt.toLowerCase().slice(0, 8))
    )
  );
  if (commonTopics.length >= 2) {
    score += 2.0;
    reasons.push(`Interesse comum em ${commonTopics.slice(0, 2).join(" e ")}`);
    tags.push("interesses alinhados");
  } else if (commonTopics.length === 1) {
    score += 1.0;
    tags.push("interesse em comum");
  }

  // 3. Mesmo setor (peso 1.5) — networking dentro do setor
  if (a.industry && b.industry && a.industry === b.industry) {
    score += 1.5;
    reasons.push(`Atuam no mesmo setor: ${a.industry}`);
    tags.push("mesmo setor");
  }

  // 4. Maturidade complementar (peso 1.5) — mais avançado pode ajudar iniciante
  const maturityDiff = Math.abs(a.maturity_score - b.maturity_score);
  if (maturityDiff >= 2) {
    score += 1.5;
    const more = a.maturity_score > b.maturity_score ? a : b;
    const less = a.maturity_score > b.maturity_score ? b : a;
    reasons.push(
      `${more.student.preferred_name ?? more.student.full_name} pode mentorear ${less.student.preferred_name ?? less.student.full_name} em IA`
    );
    tags.push("maturidade complementar");
  } else if (maturityDiff === 0) {
    score += 0.8;
    tags.push("mesmo nível de maturidade");
  }

  // 5. Área prioritária em comum (peso 1.5)
  if (
    a.priority_area &&
    b.priority_area &&
    a.priority_area.toLowerCase().includes(b.priority_area.toLowerCase().slice(0, 8))
  ) {
    score += 1.5;
    reasons.push(`Mesma área prioritária: ${a.priority_area}`);
    tags.push("área prioritária alinhada");
  }

  // 6. Contribuição cruzada — um pode contribuir no que o outro quer (peso 1.0)
  if (
    a.contribution_offer &&
    b.networking_topics.some((t) =>
      a.contribution_offer.toLowerCase().includes(t.toLowerCase().slice(0, 6))
    )
  ) {
    score += 1.0;
    reasons.push(
      `${a.student.preferred_name ?? a.student.full_name} pode contribuir com o que ${b.student.preferred_name ?? b.student.full_name} busca`
    );
    tags.push("contribuição cruzada");
  } else if (
    b.contribution_offer &&
    a.networking_topics.some((t) =>
      b.contribution_offer.toLowerCase().includes(t.toLowerCase().slice(0, 6))
    )
  ) {
    score += 1.0;
    reasons.push(
      `${b.student.preferred_name ?? b.student.full_name} pode contribuir com o que ${a.student.preferred_name ?? a.student.full_name} busca`
    );
    tags.push("contribuição cruzada");
  }

  // Normalizar para 0-10
  const normalizedScore = Math.min(10, score);

  return {
    score: Math.round(normalizedScore * 100) / 100,
    reasons,
    tags,
  };
}

/**
 * Gera sugestões de matchmaking para todos os alunos com opt-in.
 * Retorna pares ordenados por score decrescente.
 *
 * @param students - Lista de alunos com respostas do assessment
 * @param minScore - Score mínimo para incluir uma sugestão (padrão: 3.0)
 * @param maxResults - Número máximo de pares a retornar (padrão: 20)
 */
export function generateNetworkingMatches(
  students: StudentWithAssessment[],
  minScore = 3.0,
  maxResults = 20
): NetworkingGroup[] {
  const profiles = students
    .map(extractProfile)
    .filter((p): p is StudentProfile => p !== null);

  const pairs: NetworkingGroup[] = [];

  for (let i = 0; i < profiles.length; i++) {
    for (let j = i + 1; j < profiles.length; j++) {
      const a = profiles[i];
      const b = profiles[j];
      const { score, reasons, tags } = calculateMatchScore(a, b);

      if (score >= minScore) {
        pairs.push({
          type: "pair",
          students: [a.student, b.student],
          reason: reasons.join(". ") || "Perfis compatíveis para networking",
          tags,
          score,
        });
      }
    }
  }

  // Ordenar por score decrescente e limitar resultados
  return pairs.sort((a, b) => b.score - a.score).slice(0, maxResults);
}

/**
 * Agrupa alunos por nível de maturidade para segmentação didática
 */
export function segmentByMaturity(students: StudentWithAssessment[]): {
  beginners: StudentWithAssessment[];
  intermediate: StudentWithAssessment[];
  advanced: StudentWithAssessment[];
} {
  return {
    beginners: students.filter(
      (s) => (s.assessment_responses?.ai_maturity_score ?? 0) <= 2
    ),
    intermediate: students.filter(
      (s) => (s.assessment_responses?.ai_maturity_score ?? 0) === 3
    ),
    advanced: students.filter(
      (s) => (s.assessment_responses?.ai_maturity_score ?? 0) >= 4
    ),
  };
}

/**
 * Identifica os temas mais recorrentes nos tópicos de networking da turma
 */
export function getTopNetworkingTopics(
  students: StudentWithAssessment[],
  topN = 10
): { topic: string; count: number }[] {
  const topicCount: Record<string, number> = {};

  students.forEach((s) => {
    const topics = s.assessment_responses?.networking_topics ?? [];
    topics.forEach((topic) => {
      topicCount[topic] = (topicCount[topic] ?? 0) + 1;
    });
  });

  return Object.entries(topicCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, topN)
    .map(([topic, count]) => ({ topic, count }));
}

/**
 * Identifica os principais desafios da turma
 */
export function getTopChallenges(
  students: StudentWithAssessment[],
  topN = 10
): { challenge: string; count: number }[] {
  const challengeCount: Record<string, number> = {};

  students.forEach((s) => {
    const challenges = s.assessment_responses?.top_challenges ?? [];
    challenges.forEach((c) => {
      challengeCount[c] = (challengeCount[c] ?? 0) + 1;
    });
  });

  return Object.entries(challengeCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, topN)
    .map(([challenge, count]) => ({ challenge, count }));
}
