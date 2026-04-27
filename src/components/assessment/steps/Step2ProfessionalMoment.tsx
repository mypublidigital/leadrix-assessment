"use client";

import { useFormContext, useController } from "react-hook-form";
import { Textarea } from "@/components/ui/Textarea";
import { CheckboxGroup } from "@/components/assessment/CheckboxGroup";
import type { AssessmentValues } from "@/lib/validations/assessment";

const CHALLENGES = [
  "Automatizar processos repetitivos",
  "Reduzir tempo de análise de dados",
  "Melhorar tomada de decisão",
  "Personalizar atendimento ao cliente",
  "Aumentar produtividade do time",
  "Escalar operações sem aumentar headcount",
  "Reduzir custos operacionais",
  "Implementar IA sem equipe técnica",
  "Capacitar minha equipe em IA",
  "Criar novos produtos ou serviços com IA",
  "Melhorar processos de vendas e conversão",
  "Analisar e prever comportamento do cliente",
];

export function Step2ProfessionalMoment() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AssessmentValues>();

  const e = errors.step2;

  const { field: challengesField } = useController({
    name: "step2.top_challenges",
    control,
  });

  return (
    <div className="animate-enter space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">
          Momento Profissional e Foco Estratégico
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Entender onde você está hoje ajuda a tornar o curso mais relevante
          para a sua realidade e objetivos.
        </p>
      </div>

      <Textarea
        label="Qual é o seu momento estratégico atual?"
        placeholder="Ex: Estou num processo de transformação digital na minha empresa. Preciso implementar IA no setor de operações para escalar sem aumentar o time..."
        required
        rows={4}
        hint="Descreva brevemente seu momento profissional, o contexto da sua empresa e o que você está buscando transformar agora."
        error={e?.strategic_moment?.message}
        {...register("step2.strategic_moment")}
      />

      <CheckboxGroup
        label="Quais são seus principais desafios profissionais hoje?"
        options={CHALLENGES}
        value={challengesField.value ?? []}
        onChange={challengesField.onChange}
        maxSelections={5}
        required
        columns={2}
        hint="Selecione até 5 desafios que mais representam o que você enfrenta."
        error={e?.top_challenges?.message}
      />

      <Textarea
        label="Que resultados você quer conquistar com IA?"
        placeholder="Ex: Quero reduzir o tempo de criação de relatórios de 2 dias para 2 horas. Quero implementar personalização no meu e-commerce..."
        required
        rows={3}
        hint="Seja específico sobre métricas ou mudanças que você quer ver."
        error={e?.desired_results?.message}
        {...register("step2.desired_results")}
      />
    </div>
  );
}
