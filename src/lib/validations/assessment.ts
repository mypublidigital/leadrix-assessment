import { z } from "zod";

// -------------------------------------------------------
// Seção 1: Identificação Profissional
// -------------------------------------------------------
export const step1Schema = z.object({
  full_name: z.string().min(3, "Nome completo é obrigatório"),
  preferred_name: z.string().optional().default(""),
  email: z.string().email("E-mail inválido"),
  phone: z.string().optional().default(""),
  company: z.string().optional().default(""),
  job_title: z.string().min(2, "Cargo é obrigatório"),
  industry: z.string().min(1, "Selecione um setor"),
  company_size: z.string().optional().default(""),
  city: z.string().optional().default(""),
  state: z.string().optional().default(""),
  linkedin_url: z.string().url("URL do LinkedIn inválida").optional().or(z.literal("")).default(""),
  years_experience: z.string().optional().default(""),
});

// -------------------------------------------------------
// Seção 2: Momento Profissional e Foco Estratégico
// -------------------------------------------------------
export const step2Schema = z.object({
  strategic_moment: z
    .string()
    .min(20, "Descreva seu momento estratégico com mais detalhes (mínimo 20 caracteres)"),
  top_challenges: z
    .array(z.string())
    .min(1, "Selecione ao menos um desafio")
    .max(5, "Selecione até 5 desafios"),
  desired_results: z
    .string()
    .min(10, "Descreva os resultados que você deseja (mínimo 10 caracteres)"),
});

// -------------------------------------------------------
// Seção 3: Maturidade em IA
// -------------------------------------------------------
export const step3Schema = z.object({
  ai_maturity_level: z.enum(
    ["iniciante", "basico", "intermediario", "avancado", "especialista"],
    { required_error: "Selecione seu nível de maturidade em IA" }
  ),
  current_ai_usage: z.string().optional().default(""),
  tools_used: z.array(z.string()).default([]),
  current_ai_use_cases: z.array(z.string()).default([]),
  main_barriers: z.array(z.string()).default([]),
});

// -------------------------------------------------------
// Seção 4: Aplicação Prática no Curso
// -------------------------------------------------------
export const step4Schema = z.object({
  priority_area: z.string().min(1, "Selecione uma área prioritária"),
  highest_value_application: z
    .string()
    .min(10, "Descreva a aplicação de maior valor (mínimo 10 caracteres)"),
  real_problem_to_use_in_course: z.string().optional().default(""),
  one_ready_application_expected: z
    .string()
    .min(5, "Descreva a aplicação que espera ter pronta (mínimo 5 caracteres)"),
  application_scope: z.string().min(1, "Selecione o escopo de aplicação"),
});

// -------------------------------------------------------
// Seção 5: Networking
// -------------------------------------------------------
export const step5Schema = z.object({
  networking_topics: z.array(z.string()).default([]),
  contribution_offer: z.string().optional().default(""),
  desired_connections: z.string().optional().default(""),
  opt_in_matchmaking: z.boolean().default(true),
});

// -------------------------------------------------------
// Seção 6: Estilo de Aprendizagem
// -------------------------------------------------------
export const step6Schema = z.object({
  preferred_learning_style: z
    .string()
    .min(1, "Selecione seu estilo de aprendizagem preferido"),
  participation_style: z.string().optional().default(""),
  preferred_exercise_style: z.string().optional().default(""),
});

// -------------------------------------------------------
// Seção 7: Resultado Esperado ao Final do Curso
// -------------------------------------------------------
export const step7Schema = z.object({
  ideal_course_outcome: z
    .string()
    .min(10, "Descreva seu resultado ideal (mínimo 10 caracteres)"),
  success_definition: z
    .string()
    .min(10, "Defina o que seria sucesso para você (mínimo 10 caracteres)"),
  post_course_application: z.string().optional().default(""),
});

// -------------------------------------------------------
// Schema completo do assessment
// -------------------------------------------------------
export const assessmentSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
  step4: step4Schema,
  step5: step5Schema,
  step6: step6Schema,
  step7: step7Schema,
});

export type Step1Values = z.infer<typeof step1Schema>;
export type Step2Values = z.infer<typeof step2Schema>;
export type Step3Values = z.infer<typeof step3Schema>;
export type Step4Values = z.infer<typeof step4Schema>;
export type Step5Values = z.infer<typeof step5Schema>;
export type Step6Values = z.infer<typeof step6Schema>;
export type Step7Values = z.infer<typeof step7Schema>;
export type AssessmentValues = z.infer<typeof assessmentSchema>;
