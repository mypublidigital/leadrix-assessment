"use server";

import { createClient } from "@/lib/supabase/server";
import { assessmentSchema } from "@/lib/validations/assessment";
import { AI_MATURITY_SCORES } from "@/lib/types";
import type { AssessmentValues } from "@/lib/validations/assessment";
import type { ApiResponse } from "@/lib/types";

/**
 * Server Action para enviar o assessment completo.
 * Valida os dados, cria o registro do aluno e salva as respostas.
 */
export async function submitAssessment(
  data: AssessmentValues
): Promise<ApiResponse<{ studentId: string }>> {
  // 1. Validar payload completo
  const parsed = assessmentSchema.safeParse(data);
  if (!parsed.success) {
    const firstError = parsed.error.errors[0];
    return {
      success: false,
      error: `Dados inválidos: ${firstError.message}`,
    };
  }

  const { step1, step2, step3, step4, step5, step6, step7 } = parsed.data;
  const supabase = await createClient();

  try {
    // 2. Inserir registro do aluno
    const { data: student, error: studentError } = await supabase
      .from("students")
      .insert({
        full_name: step1.full_name,
        preferred_name: step1.preferred_name || null,
        email: step1.email,
        phone: step1.phone || null,
        company: step1.company || null,
        job_title: step1.job_title,
        industry: step1.industry,
        company_size: step1.company_size || null,
        city: step1.city || null,
        state: step1.state || null,
        linkedin_url: step1.linkedin_url || null,
        years_experience: step1.years_experience || null,
      })
      .select("id")
      .single();

    if (studentError) {
      console.error("Erro ao criar aluno:", studentError);
      return {
        success: false,
        error: "Erro ao salvar seus dados. Tente novamente.",
      };
    }

    // 3. Calcular score de maturidade
    const maturityScore = AI_MATURITY_SCORES[step3.ai_maturity_level];

    // 4. Inserir respostas do assessment
    const { error: responseError } = await supabase
      .from("assessment_responses")
      .insert({
        student_id: student.id,

        // Seção 2
        strategic_moment: step2.strategic_moment,
        top_challenges: step2.top_challenges,
        desired_results: step2.desired_results,

        // Seção 3
        ai_maturity_level: step3.ai_maturity_level,
        ai_maturity_score: maturityScore,
        current_ai_usage: step3.current_ai_usage || null,
        tools_used: step3.tools_used,
        current_ai_use_cases: step3.current_ai_use_cases,
        main_barriers: step3.main_barriers,

        // Seção 4
        priority_area: step4.priority_area,
        highest_value_application: step4.highest_value_application,
        real_problem_to_use_in_course: step4.real_problem_to_use_in_course || null,
        one_ready_application_expected: step4.one_ready_application_expected,
        application_scope: step4.application_scope,

        // Seção 5
        networking_topics: step5.networking_topics,
        contribution_offer: step5.contribution_offer || null,
        desired_connections: step5.desired_connections || null,
        opt_in_matchmaking: step5.opt_in_matchmaking,

        // Seção 6
        preferred_learning_style: step6.preferred_learning_style,
        participation_style: step6.participation_style || null,
        preferred_exercise_style: step6.preferred_exercise_style || null,

        // Seção 7
        ideal_course_outcome: step7.ideal_course_outcome,
        success_definition: step7.success_definition,
        post_course_application: step7.post_course_application || null,

        is_complete: true,
      });

    if (responseError) {
      console.error("Erro ao salvar assessment:", responseError);
      // Remover aluno criado para evitar dados órfãos
      await supabase.from("students").delete().eq("id", student.id);
      return {
        success: false,
        error: "Erro ao salvar suas respostas. Tente novamente.",
      };
    }

    return { success: true, data: { studentId: student.id } };
  } catch (error) {
    console.error("Erro inesperado:", error);
    return {
      success: false,
      error: "Erro inesperado. Por favor, tente novamente.",
    };
  }
}
