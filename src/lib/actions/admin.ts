"use server";

import { createClient } from "@/lib/supabase/server";
import type { ApiResponse, NoteCategory, MatchStatus } from "@/lib/types";
import type { StudentWithAssessment } from "@/lib/types";
import { generateNetworkingMatches } from "@/lib/utils/matching";

// -------------------------------------------------------
// Admin Notes
// -------------------------------------------------------

export async function createNote(data: {
  student_id: string;
  note: string;
  category: NoteCategory;
}): Promise<ApiResponse<{ id: string }>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autorizado" };

  const { data: note, error } = await supabase
    .from("admin_notes")
    .insert({ ...data, created_by: user.id })
    .select("id")
    .single();

  if (error) {
    console.error("Erro ao criar nota:", error);
    return { success: false, error: "Erro ao salvar a nota" };
  }

  return { success: true, data: { id: note.id } };
}

export async function deleteNote(noteId: string): Promise<ApiResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autorizado" };

  const { error } = await supabase
    .from("admin_notes")
    .delete()
    .eq("id", noteId);

  if (error) return { success: false, error: "Erro ao deletar a nota" };
  return { success: true };
}

// -------------------------------------------------------
// Networking Matches
// -------------------------------------------------------

export async function generateMatches(): Promise<
  ApiResponse<{ count: number }>
> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autorizado" };

  // Buscar todos os alunos com respostas completas
  const { data: students, error: fetchError } = await supabase
    .from("students")
    .select(
      `
      *,
      assessment_responses!inner(*)
    `
    )
    .eq("assessment_responses.is_complete", true)
    .eq("assessment_responses.opt_in_matchmaking", true);

  if (fetchError) {
    return { success: false, error: "Erro ao buscar dados dos alunos" };
  }

  const typedStudents = students as StudentWithAssessment[];
  const matches = generateNetworkingMatches(typedStudents);

  if (matches.length === 0) {
    return { success: true, data: { count: 0 } };
  }

  // Limpar matches anteriores com status 'suggested' antes de gerar novos
  await supabase
    .from("networking_matches")
    .delete()
    .eq("status", "suggested")
    .eq("created_by", user.id);

  // Inserir novos matches
  const matchRows = matches.map((m) => ({
    student_a_id: m.students[0].id,
    student_b_id: m.students[1].id,
    match_score: m.score,
    match_reason: m.reason,
    match_tags: m.tags,
    status: "suggested" as MatchStatus,
    created_by: user.id,
  }));

  // Inserir ignorando duplicatas (constraint unique_pair)
  const { error: insertError } = await supabase
    .from("networking_matches")
    .upsert(matchRows, {
      onConflict: "student_a_id,student_b_id",
      ignoreDuplicates: true,
    });

  if (insertError) {
    console.error("Erro ao salvar matches:", insertError);
    return { success: false, error: "Erro ao salvar sugestões de networking" };
  }

  return { success: true, data: { count: matches.length } };
}

export async function updateMatchStatus(
  matchId: string,
  status: MatchStatus
): Promise<ApiResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Não autorizado" };

  const { error } = await supabase
    .from("networking_matches")
    .update({ status })
    .eq("id", matchId);

  if (error) return { success: false, error: "Erro ao atualizar status" };
  return { success: true };
}
