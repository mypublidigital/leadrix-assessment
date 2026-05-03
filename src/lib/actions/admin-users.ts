"use server";

import { createAdminClient, createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { ApiResponse, UserRole } from "@/lib/types";

async function requireAdmin(): Promise<{ userId: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Não autenticado" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return { error: "Apenas administradores podem gerenciar usuários" };
  }

  return { userId: user.id };
}

/**
 * Cria um novo usuário do painel admin com email e senha.
 * Email é confirmado automaticamente (não envia magic link).
 */
export async function createAdminUser(
  email: string,
  password: string,
  role: UserRole,
  fullName: string
): Promise<ApiResponse> {
  const auth = await requireAdmin();
  if ("error" in auth) return { success: false, error: auth.error };

  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !password) {
    return { success: false, error: "Informe e-mail e senha" };
  }
  if (password.length < 6) {
    return { success: false, error: "Senha deve ter no mínimo 6 caracteres" };
  }
  if (!["admin", "viewer"].includes(role)) {
    return { success: false, error: "Papel inválido" };
  }

  const adminClient = await createAdminClient();

  // Cria usuário no Auth com email já confirmado
  const { data, error } = await adminClient.auth.admin.createUser({
    email: cleanEmail,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName?.trim() || null },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // O trigger handle_new_user já criou o profile com role 'viewer'.
  // Atualiza para o role escolhido e nome.
  const { error: profileError } = await adminClient
    .from("profiles")
    .update({
      role,
      full_name: fullName?.trim() || null,
    })
    .eq("id", data.user.id);

  if (profileError) {
    return { success: false, error: profileError.message };
  }

  revalidatePath("/admin/settings");
  return { success: true };
}

/**
 * Altera o papel de um usuário existente (admin ↔ viewer).
 */
export async function updateUserRole(
  userId: string,
  role: UserRole
): Promise<ApiResponse> {
  const auth = await requireAdmin();
  if ("error" in auth) return { success: false, error: auth.error };

  if (auth.userId === userId && role !== "admin") {
    return {
      success: false,
      error: "Você não pode rebaixar seu próprio papel.",
    };
  }

  const adminClient = await createAdminClient();
  const { error } = await adminClient
    .from("profiles")
    .update({ role })
    .eq("id", userId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/settings");
  return { success: true };
}

/**
 * Exclui um usuário do painel admin (auth.users + profiles via cascade).
 */
export async function deleteAdminUser(userId: string): Promise<ApiResponse> {
  const auth = await requireAdmin();
  if ("error" in auth) return { success: false, error: auth.error };

  if (auth.userId === userId) {
    return {
      success: false,
      error: "Você não pode excluir sua própria conta.",
    };
  }

  const adminClient = await createAdminClient();
  const { error } = await adminClient.auth.admin.deleteUser(userId);

  if (error) return { success: false, error: error.message };

  revalidatePath("/admin/settings");
  return { success: true };
}
