"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { ApiResponse } from "@/lib/types";

/**
 * Server Action de login com email + senha.
 * Roda no servidor para garantir que cookies de sessão sejam escritos
 * antes do redirect, evitando race condition com o middleware.
 */
export async function loginWithPassword(
  email: string,
  password: string,
  redirectTo: string
): Promise<ApiResponse> {
  if (!email?.trim() || !password) {
    return { success: false, error: "Informe e-mail e senha." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    if (error.message === "Invalid login credentials") {
      return { success: false, error: "E-mail ou senha incorretos." };
    }
    if (error.message === "Email not confirmed") {
      return {
        success: false,
        error:
          "E-mail não confirmado. No Supabase, edite o usuário e ative 'Auto Confirm'.",
      };
    }
    return { success: false, error: error.message };
  }

  // Cookie já foi escrito server-side; redireciona com segurança.
  redirect(redirectTo || "/admin");
}

/**
 * Server Action de logout.
 */
export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
