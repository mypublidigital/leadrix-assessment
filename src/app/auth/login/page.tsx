import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Acesso Administrativo — Leadrix IA",
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      {/* Fundo decorativo */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/4 h-[800px] w-[800px] rounded-full bg-brand-900/20 blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/4 h-[600px] w-[600px] rounded-full bg-brand-900/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card de login */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
          {/* Logo / Brand */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-700">
              <span className="text-xl font-bold text-white">L</span>
            </div>
            <h1 className="text-xl font-bold text-white">Leadrix IA</h1>
            <p className="mt-1 text-sm text-neutral-400">
              Área Administrativa
            </p>
          </div>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
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
