"use client";

import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { loginWithPassword } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Mail, Lock } from "lucide-react";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/admin";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const result = await loginWithPassword(email, password, redirectTo);
      // Se chegou aqui, deu erro (success faz redirect e nem retorna).
      if (result && !result.success) {
        setError(result.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-white mb-1">Entrar</h2>
        <p className="text-xs text-neutral-400">
          Use seu e-mail e senha administrativos.
        </p>
      </div>

      {error && (
        <Alert variant="error" onDismiss={() => setError(null)}>
          {error}
        </Alert>
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
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@leadrix.com.br"
            required
            autoComplete="email"
            disabled={isPending}
            className="w-full h-11 rounded-lg border border-neutral-700 bg-neutral-800 pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors disabled:opacity-60"
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
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete="current-password"
            disabled={isPending}
            className="w-full h-11 rounded-lg border border-neutral-700 bg-neutral-800 pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors disabled:opacity-60"
          />
        </div>
      </div>

      <Button
        type="submit"
        fullWidth
        loading={isPending}
        size="lg"
        className="mt-2"
      >
        Entrar
      </Button>

      <p className="text-center text-xs text-neutral-500">
        Apenas e-mails autorizados pela equipe Leadrix têm acesso.
      </p>
    </form>
  );
}
