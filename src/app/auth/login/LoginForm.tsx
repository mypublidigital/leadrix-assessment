"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Mail, CheckCircle2 } from "lucide-react";

type FormState = "idle" | "loading" | "success" | "error";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setState("loading");
    setError(null);

    const supabase = createClient();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? window.location.origin;

    const { error: authError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${appUrl}/auth/callback?redirectTo=${redirectTo}`,
      },
    });

    if (authError) {
      setState("error");
      setError("Não foi possível enviar o link. Verifique o e-mail e tente novamente.");
      return;
    }

    setState("success");
  };

  if (state === "success") {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-900/30 border border-emerald-800">
          <CheckCircle2 className="h-8 w-8 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            Link enviado!
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Enviamos um link de acesso para{" "}
            <span className="text-white font-medium">{email}</span>.
            Verifique sua caixa de entrada e clique no link para entrar.
          </p>
        </div>
        <button
          onClick={() => setState("idle")}
          className="text-sm text-brand-400 hover:text-brand-300 underline"
        >
          Tentar com outro e-mail
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-white mb-1">
          Entrar com link mágico
        </h2>
        <p className="text-xs text-neutral-400">
          Digite seu e-mail e enviaremos um link seguro de acesso.
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
          E-mail administrativo
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
            className="w-full h-11 rounded-lg border border-neutral-700 bg-neutral-800 pl-10 pr-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
          />
        </div>
      </div>

      <Button
        type="submit"
        fullWidth
        loading={state === "loading"}
        size="lg"
        className="mt-2"
      >
        Enviar link de acesso
      </Button>

      <p className="text-center text-xs text-neutral-500">
        Apenas e-mails autorizados pela equipe Leadrix têm acesso.
      </p>
    </form>
  );
}
