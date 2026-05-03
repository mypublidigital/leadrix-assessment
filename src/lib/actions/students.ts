"use server";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ApiResponse } from "@/lib/types";

/**
 * Deleta um aluno e todos os registros relacionados
 * (assessment_responses, networking_matches, admin_notes via FK CASCADE).
 *
 * Apenas admins podem executar.
 */
export async function deleteStudent(id: string): Promise<ApiResponse> {
  if (!id) return { success: false, error: "ID do aluno é obrigatório" };

  // Valida que o usuário é admin
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Não autenticado" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { success: false, error: "Apenas administradores podem excluir alunos" };
  }

  // Service role para bypassar RLS na deleção
  const adminClient = await createAdminClient();
  const { error } = await adminClient.from("students").delete().eq("id", id);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/students");
  revalidatePath("/admin/dashboard");
  redirect("/admin/students");
}
