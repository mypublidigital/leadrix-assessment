import type { StudentWithAssessment } from "@/lib/types";

/**
 * Converte array de strings em linha CSV segura (escapa vírgulas e aspas)
 */
function escapeCSV(value: string | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Converte lista de strings (array do banco) em string separada por pipe
 */
function arrayToString(arr: string[] | null | undefined): string {
  if (!arr || arr.length === 0) return "";
  return arr.join(" | ");
}

/**
 * Gera o CSV completo das respostas dos alunos.
 * Retorna uma string CSV com headers e todas as linhas.
 */
export function generateAssessmentCSV(students: StudentWithAssessment[]): string {
  const headers = [
    // Identificação
    "ID",
    "Nome Completo",
    "Nome Preferido",
    "E-mail",
    "Telefone",
    "Empresa",
    "Cargo",
    "Setor",
    "Tamanho da Empresa",
    "Cidade",
    "Estado",
    "LinkedIn",
    "Anos de Experiência",
    "Data de Cadastro",
    // Momento profissional
    "Momento Estratégico",
    "Principais Desafios",
    "Resultados Desejados",
    // Maturidade em IA
    "Nível de Maturidade IA",
    "Score de Maturidade (1-5)",
    "Uso Atual de IA",
    "Ferramentas Usadas",
    "Casos de Uso Atuais",
    "Principais Barreiras",
    // Aplicação prática
    "Área Prioritária",
    "Aplicação de Maior Valor",
    "Problema Real para Usar no Curso",
    "Uma Aplicação Pronta Esperada",
    "Escopo de Aplicação",
    // Networking
    "Tópicos de Networking",
    "O Que Pode Contribuir",
    "Conexões Desejadas",
    "Opt-in Matchmaking",
    // Estilo de aprendizagem
    "Estilo de Aprendizagem",
    "Estilo de Participação",
    "Estilo de Exercício",
    // Resultado esperado
    "Resultado Ideal do Curso",
    "Definição de Sucesso",
    "Aplicação Pós-Curso",
    "Resposta Completa",
  ];

  const rows = students.map((s) => {
    const r = s.assessment_responses;
    return [
      s.id,
      s.full_name,
      s.preferred_name ?? "",
      s.email,
      s.phone ?? "",
      s.company ?? "",
      s.job_title ?? "",
      s.industry ?? "",
      s.company_size ?? "",
      s.city ?? "",
      s.state ?? "",
      s.linkedin_url ?? "",
      s.years_experience ?? "",
      new Date(s.created_at).toLocaleDateString("pt-BR"),
      r?.strategic_moment ?? "",
      arrayToString(r?.top_challenges),
      r?.desired_results ?? "",
      r?.ai_maturity_level ?? "",
      r?.ai_maturity_score?.toString() ?? "",
      r?.current_ai_usage ?? "",
      arrayToString(r?.tools_used),
      arrayToString(r?.current_ai_use_cases),
      arrayToString(r?.main_barriers),
      r?.priority_area ?? "",
      r?.highest_value_application ?? "",
      r?.real_problem_to_use_in_course ?? "",
      r?.one_ready_application_expected ?? "",
      r?.application_scope ?? "",
      arrayToString(r?.networking_topics),
      r?.contribution_offer ?? "",
      r?.desired_connections ?? "",
      r?.opt_in_matchmaking ? "Sim" : "Não",
      r?.preferred_learning_style ?? "",
      r?.participation_style ?? "",
      r?.preferred_exercise_style ?? "",
      r?.ideal_course_outcome ?? "",
      r?.success_definition ?? "",
      r?.post_course_application ?? "",
      r?.is_complete ? "Sim" : "Não",
    ].map(escapeCSV);
  });

  const csvLines = [headers.map(escapeCSV).join(","), ...rows.map((r) => r.join(","))];

  // BOM para encoding correto no Excel brasileiro
  return "\uFEFF" + csvLines.join("\r\n");
}
