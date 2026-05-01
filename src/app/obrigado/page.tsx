import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Assessment Enviado — Leadrix IA",
};

export default function ThankYouPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-neutral-50 to-white px-4">
      <div className="w-full max-w-lg text-center">
        {/* Logo */}
        <Logo
          width={180}
          priority
          className="mx-auto mb-6 rounded-2xl shadow-md"
        />

        {/* Ícone de sucesso */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 border-2 border-emerald-100">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>

        <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
          Assessment enviado com sucesso!
        </h1>

        <p className="mt-4 text-neutral-600 leading-relaxed">
          Obrigado por dedicar seu tempo. A equipe Leadrix IA vai analisar
          suas respostas e usá-las para personalizar o curso, os exemplos e
          as conexões de networking especialmente para você.
        </p>

        <div className="mt-6 rounded-xl bg-brand-50 border border-brand-100 p-5 text-left space-y-2">
          <p className="text-sm font-semibold text-brand-800">
            O que acontece agora:
          </p>
          <ul className="space-y-1.5">
            {[
              "A equipe analisa seu perfil e suas respostas",
              "Sugestões de networking são geradas para você",
              "Os exemplos e exercícios são adaptados ao seu contexto",
              "Você recebe orientações antes do início do curso",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-brand-700">
                <span className="mt-0.5 flex-shrink-0 flex h-4 w-4 items-center justify-center rounded-full bg-brand-200 text-brand-800 text-[10px] font-bold">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-sm text-neutral-500">
          Dúvidas?{" "}
          <a
            href="mailto:contato@leadrix.com.br"
            className="text-brand-700 hover:underline"
          >
            Entre em contato com a equipe Leadrix IA
          </a>
        </p>
      </div>
    </main>
  );
}
