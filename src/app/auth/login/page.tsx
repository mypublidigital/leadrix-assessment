import type { Metadata } from "next";
import { Logo } from "@/components/ui/Logo";
import { Mail, Lock, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Acesso Administrativo — Leadrix IA",
};

const ERROR_MESSAGES: Record<string, string> = {
  invalid_credentials: "E-mail ou senha incorretos.",
  email_not_confirmed:
    "E-mail não confirmado. No Supabase, edite o usuário e ative 'Auto Confirm'.",
  missing_fields: "Informe e-mail e senha.",
  unknown: "Não foi possível entrar. Tente novamente.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirectTo?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = params.error ? ERROR_MESSAGES[params.error] : null;
  const redirectTo = params.redirectTo ?? "/admin";

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 h-[800px] w-[800px] rounded-full bg-brand-900/20 blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/4 h-[600px] w-[600px] rounded-full bg-brand-900/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
          <div className="mb-8 flex flex-col items-center text-center">
            <Logo width={160} priority />
            <p className="mt-3 text-sm text-neutral-400">Área Administrativa</p>
          </div>

          <form
            action="/api/auth/login"
            method="POST"
            className="space-y-4"
            autoComplete="on"
          >
            <input type="hidden" name="redirectTo" value={redirectTo} />

            <div>
              <h2 className="text-base font-semibold text-white mb-1">
                Entrar
              </h2>
              <p className="text-xs text-neutral-400">
                Use seu e-mail e senha administrativos.
              </p>
            </div>

            {errorMessage && (
              <div className="flex items-start gap-2 rounded-lg border border-red-900/50 bg-red-950/40 p-3 text-sm text-red-300">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-1">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-neutral-300"
              >
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="admin@leadrix.com.br"
                  required
                  autoComplete="email"
                  className="w-full h-11 rounded-lg border border-neutral-700 bg-neutral-800 pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-neutral-300"
              >
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full h-11 rounded-lg border border-neutral-700 bg-neutral-800 pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full h-11 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm transition-colors"
            >
              Entrar
            </button>

            <p className="text-center text-xs text-neutral-500">
              Apenas e-mails autorizados pela equipe Leadrix têm acesso.
            </p>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-600">
          Acesso restrito à equipe Leadrix IA.
          <br />
          Se você é aluno, acesse o{" "}
          <a href="/assessment" className="text-brand-400 hover:text-brand-300">
            formulário de assessment
          </a>
          .
        </p>
      </div>
    </main>
  );
}
