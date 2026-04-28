import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Cliente Supabase para uso em Server Components, Server Actions e Route Handlers.
 * Cria um novo cliente por requisição (não é singleton) usando os cookies da request.
 *
 * IMPORTANTE: Esta função DEVE ser chamada dentro de um contexto de request
 * (Server Component, Server Action ou Route Handler). Nunca no module level.
 *
 * Configure as variáveis de ambiente no arquivo .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll pode falhar em Server Components (read-only).
            // O middleware cuida da atualização dos tokens.
          }
        },
      },
    }
  );
}

/**
 * Cliente Supabase com service_role — bypassa Row Level Security.
 * USE APENAS em contextos de servidor confiável (Server Actions, Route Handlers).
 * NUNCA exponha ou use no frontend.
 *
 * Necessário para:
 * - Operações administrativas que precisam ler/escrever além do RLS
 * - Exportação de dados completos
 */
export async function createAdminClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Silencia erros em Server Components read-only
          }
        },
      },
    }
  );
}
