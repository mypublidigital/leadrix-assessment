import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Login com e-mail e senha — padrão HTTP clássico.
 * Recebe form-data via POST, autentica no Supabase, escreve cookies
 * no response e retorna 302 para a rota destino.
 *
 * Esse padrão é à prova de race condition: cookies vão nos headers HTTP
 * do redirect; o browser segue o Location já com a sessão estabelecida.
 */
export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/admin");

  const loginUrl = new URL("/auth/login", request.url);
  loginUrl.searchParams.set("redirectTo", redirectTo);

  if (!email || !password) {
    loginUrl.searchParams.set("error", "missing_fields");
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  // Response onde os cookies do Supabase serão escritos.
  const response = NextResponse.redirect(new URL(redirectTo, request.url), {
    status: 303,
  });

  const cookieStore = await cookies();

  const supabase = createServerClient(
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
          // Escreve nos cookies da request (próximas chamadas) e no response
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options);
            } catch {
              // pode falhar dependendo do contexto
            }
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const errCode =
      error.message === "Invalid login credentials"
        ? "invalid_credentials"
        : error.message === "Email not confirmed"
        ? "email_not_confirmed"
        : "unknown";
    loginUrl.searchParams.set("error", errCode);
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  // Sucesso: cookies já foram escritos no `response` via setAll acima.
  return response;
}
