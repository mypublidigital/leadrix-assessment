"use client";

import { useFormContext, useController } from "react-hook-form";
import { Textarea } from "@/components/ui/Textarea";
import { CheckboxGroup } from "@/components/assessment/CheckboxGroup";
import { cn } from "@/lib/utils/cn";
import type { AssessmentValues } from "@/lib/validations/assessment";

const NETWORKING_TOPICS = [
  "IA aplicada a operações",
  "IA para vendas e CRM",
  "Marketing com IA",
  "IA para RH e People Analytics",
  "Automação de processos",
  "IA em produtos digitais",
  "Gestão de dados e analytics",
  "IA generativa e LLMs",
  "Ética e regulatório de IA",
  "IA para startups e empreendedorismo",
  "Transformação digital",
  "IA no agronegócio",
  "IA na saúde",
  "IA em finanças e fintech",
  "Liderança e gestão com IA",
];

export function Step5Networking() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<AssessmentValues>();

  const e = errors.step5;

  const { field: topicsField } = useController({
    name: "step5.networking_topics",
    control,
  });

  const optIn = watch("step5.opt_in_matchmaking");

  return (
    <div className="animate-enter space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">
          Networking Qualificado
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          O Leadrix IA reúne profissionais de alto nível. Queremos facilitar
          conexões genuínas e estratégicas entre os participantes.
        </p>
      </div>

      <CheckboxGroup
        label="Quais temas você mais quer discutir com outros participantes?"
        options={NETWORKING_TOPICS}
        value={topicsField.value ?? []}
        onChange={topicsField.onChange}
        maxSelections={6}
        columns={2}
        hint="Selecione até 6 temas. Usamos isso para sugerir conexões relevantes."
        error={e?.networking_topics?.message}
      />

      <Textarea
        label="O que você pode oferecer ao grupo? (opcional)"
        placeholder="Ex: Tenho experiência em implementação de IA em varejo e posso compartilhar aprendizados práticos. Posso ajudar colegas com análise de dados e visualização..."
        rows={3}
        hint="Conhecimento, perspectiva de setor, ferramentas, conexões... qualquer coisa que possa gerar valor para outros."
        error={e?.contribution_offer?.message}
        {...register("step5.contribution_offer")}
      />

      <Textarea
        label="Que tipo de profissionais você gostaria de conhecer no curso? (opcional)"
        placeholder="Ex: Quero me conectar com outros founders de startups de IA e com gestores de operações que já implementaram automação com IA..."
        rows={3}
        error={e?.desired_connections?.message}
        {...register("step5.desired_connections")}
      />

      {/* Opt-in matchmaking */}
      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
        <div className="flex items-start gap-4">
          <button
            type="button"
            onClick={() => setValue("step5.opt_in_matchmaking", !optIn)}
            className={cn(
              "relative mt-0.5 flex h-6 w-11 flex-shrink-0 cursor-pointer items-center rounded-full border-2 transition-colors duration-200",
              optIn
                ? "border-brand-600 bg-brand-700"
                : "border-neutral-300 bg-neutral-200"
            )}
            role="switch"
            aria-checked={optIn}
          >
            <span
              className={cn(
                "block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                optIn ? "translate-x-5" : "translate-x-0.5"
              )}
            />
          </button>
          <div>
            <p className="text-sm font-medium text-neutral-800">
              Participar do matchmaking de networking
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Ativado. A equipe Leadrix analisará seu perfil e poderá sugerir
              conexões personalizadas com outros participantes. Suas respostas
              são tratadas com sigilo — somente a equipe tem acesso.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
