// =============================================================
// Leadrix Assessment — Tipos TypeScript
// =============================================================

// -------------------------------------------------------
// Database types (baseado no schema do Supabase)
// -------------------------------------------------------

export type UserRole = "admin" | "viewer";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export type AIMaturityLevel =
  | "iniciante"
  | "basico"
  | "intermediario"
  | "avancado"
  | "especialista";

export interface Student {
  id: string;
  full_name: string;
  preferred_name: string | null;
  email: string;
  phone: string | null;
  company: string | null;
  job_title: string | null;
  industry: string | null;
  company_size: string | null;
  city: string | null;
  state: string | null;
  linkedin_url: string | null;
  years_experience: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssessmentResponse {
  id: string;
  student_id: string;

  // Seção 2: Momento profissional
  strategic_moment: string | null;
  top_challenges: string[];
  desired_results: string | null;

  // Seção 3: Maturidade em IA
  ai_maturity_level: AIMaturityLevel | null;
  ai_maturity_score: number;
  current_ai_usage: string | null;
  tools_used: string[];
  current_ai_use_cases: string[];
  main_barriers: string[];

  // Seção 4: Aplicação prática
  priority_area: string | null;
  highest_value_application: string | null;
  real_problem_to_use_in_course: string | null;
  one_ready_application_expected: string | null;
  application_scope: string | null;

  // Seção 5: Networking
  networking_topics: string[];
  contribution_offer: string | null;
  desired_connections: string | null;
  opt_in_matchmaking: boolean;

  // Seção 6: Estilo de aprendizagem
  preferred_learning_style: string | null;
  participation_style: string | null;
  preferred_exercise_style: string | null;

  // Seção 7: Resultado esperado
  ideal_course_outcome: string | null;
  success_definition: string | null;
  post_course_application: string | null;

  is_complete: boolean;
  created_at: string;
  updated_at: string;
}

export type MatchStatus = "suggested" | "approved" | "contacted" | "dismissed";

export interface NetworkingMatch {
  id: string;
  student_a_id: string;
  student_b_id: string;
  match_score: number;
  match_reason: string | null;
  match_tags: string[];
  status: MatchStatus;
  created_by: string | null;
  created_at: string;
}

export type NoteCategory =
  | "geral"
  | "personalização"
  | "networking"
  | "atenção"
  | "destaque";

export interface AdminNote {
  id: string;
  student_id: string;
  note: string;
  category: NoteCategory;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

// -------------------------------------------------------
// Composite types para o admin dashboard
// -------------------------------------------------------

export interface StudentWithAssessment extends Student {
  assessment_responses: AssessmentResponse | null;
}

export interface NetworkingMatchWithStudents extends NetworkingMatch {
  student_a: Pick<Student, "id" | "full_name" | "preferred_name" | "job_title" | "industry">;
  student_b: Pick<Student, "id" | "full_name" | "preferred_name" | "job_title" | "industry">;
}

// -------------------------------------------------------
// Tipos do formulário de assessment (7 etapas)
// -------------------------------------------------------

export interface Step1Data {
  full_name: string;
  preferred_name: string;
  email: string;
  phone: string;
  company: string;
  job_title: string;
  industry: string;
  company_size: string;
  city: string;
  state: string;
  linkedin_url: string;
  years_experience: string;
}

export interface Step2Data {
  strategic_moment: string;
  top_challenges: string[];
  desired_results: string;
}

export interface Step3Data {
  ai_maturity_level: AIMaturityLevel;
  current_ai_usage: string;
  tools_used: string[];
  current_ai_use_cases: string[];
  main_barriers: string[];
}

export interface Step4Data {
  priority_area: string;
  highest_value_application: string;
  real_problem_to_use_in_course: string;
  one_ready_application_expected: string;
  application_scope: string;
}

export interface Step5Data {
  networking_topics: string[];
  contribution_offer: string;
  desired_connections: string;
  opt_in_matchmaking: boolean;
}

export interface Step6Data {
  preferred_learning_style: string;
  participation_style: string;
  preferred_exercise_style: string;
}

export interface Step7Data {
  ideal_course_outcome: string;
  success_definition: string;
  post_course_application: string;
}

export interface AssessmentFormData {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
  step5: Step5Data;
  step6: Step6Data;
  step7: Step7Data;
}

// -------------------------------------------------------
// Tipos de analytics e insights
// -------------------------------------------------------

export interface DashboardStats {
  total_students: number;
  complete_responses: number;
  completion_rate: number;
  avg_maturity_score: number;
  responses_this_week: number;
}

export interface MaturityDistribution {
  level: AIMaturityLevel;
  label: string;
  count: number;
  percentage: number;
}

export interface IndustryDistribution {
  industry: string;
  count: number;
  percentage: number;
}

export interface TopChallenge {
  challenge: string;
  count: number;
}

export interface PriorityAreaSummary {
  area: string;
  count: number;
  percentage: number;
}

export interface ClassInsight {
  type: "info" | "warning" | "success" | "action";
  title: string;
  description: string;
  students?: string[];
  count?: number;
}

export interface NetworkingGroup {
  type: "pair" | "trio" | "group";
  students: Pick<Student, "id" | "full_name" | "preferred_name" | "job_title" | "industry">[];
  reason: string;
  tags: string[];
  score: number;
}

// -------------------------------------------------------
// Tipos de resposta de API
// -------------------------------------------------------

export interface ApiSuccess<T = void> {
  success: true;
  data?: T;
}

export interface ApiError {
  success: false;
  error: string;
}

export type ApiResponse<T = void> = ApiSuccess<T> | ApiError;

// -------------------------------------------------------
// Opções estáticas do formulário
// -------------------------------------------------------

export const INDUSTRIES = [
  "Tecnologia",
  "Finanças e Fintechs",
  "Saúde e MedTech",
  "Varejo e E-commerce",
  "Indústria e Manufatura",
  "Agronegócio",
  "Educação e EdTech",
  "Logística e Supply Chain",
  "Marketing e Publicidade",
  "Consultoria e Serviços",
  "Jurídico e Legal",
  "RH e Gestão de Pessoas",
  "Construção e Imobiliário",
  "Energia e Sustentabilidade",
  "Governo e Setor Público",
  "Outro",
] as const;

export const COMPANY_SIZES = [
  "1 (somente eu)",
  "2-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001-5000",
  "5000+",
] as const;

export const YEARS_EXPERIENCE = [
  "Menos de 1 ano",
  "1-3 anos",
  "3-5 anos",
  "5-10 anos",
  "10-15 anos",
  "15+ anos",
] as const;

export const AI_MATURITY_LABELS: Record<AIMaturityLevel, string> = {
  iniciante: "Iniciante — nunca usei ou quase não usei IA",
  basico: "Básico — uso algumas ferramentas mas ainda explorando",
  intermediario: "Intermediário — uso IA regularmente no trabalho",
  avancado: "Avançado — integro IA em processos e produtos",
  especialista: "Especialista — desenvolvo soluções de IA",
};

export const AI_MATURITY_SCORES: Record<AIMaturityLevel, number> = {
  iniciante: 1,
  basico: 2,
  intermediario: 3,
  avancado: 4,
  especialista: 5,
};

export const STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;
