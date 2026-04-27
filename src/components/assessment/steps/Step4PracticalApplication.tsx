"use client";

import { useFormContext, useController } from "react-hook-form";
import { Textarea } from "@/components/ui/Textarea";
import { RadioGroup } from "@/components/assessment/RadioGroup";
import type { AssessmentValues } from "@/lib/validations/assessment";

const PRIORITY_AREAS = [
  {
    value: "Operações e processos internos",
    label: "Operações e processos internos",
    description: "Automatização, eficiência, redução de custos",
  },
  {
    value: "Vendas e relacionamento com cliente",
    label: "Vendas e relacionamento com cliente",
    description: "Personalização, conversão, atendimento, CRM",
  },
  {
    value: "Marketing e comunicação",
    label: "Marketing e comunicação",
    description: "Conteúdo, campanhas, análise de audiência",
  },
  {
    value: "Recursos Humanos e Gestão de Pessoas",
    label: "Recursos Humanos e Gestão de Pessoas",
    description: "Recrutamento, onboarding, analytics de pessoas",
  },
  {
    value: "Produto e desenvolvimento de negócio",
    label: "Produto e desenvolvimento de negócio",
    description: "Inovação, criação de novos serviços, roadmap",
  },
  {
    value: "Finanças e análise de dados",
    label: "Finanças e análise de dados",
    description: "Previsões, automação financeira, BI",
  },
  {
    value: "Atendimento e Customer Success",
    label: "Atendimento e Customer Success",
    description: "Suporte, churn, satisfação do cliente",
  },
  {
    value: "Jurídico e Compliance",
    label: "Jurídico e Compliance",
    description: "Contratos, regulatório, análise de riscos",
  },
];

const APPLICATION_SCOPES = [
  {
    value: "Pessoal — uso individual no meu trabalho",
    label: "Pessoal",
    description: "Vou usar para aumentar minha própria produtividade",
  },
  {
    value: "Departamental — começo no meu time e expando",
    label: "Departamental",
    description: "Quero implementar no meu time ou departamento",
  },
  {
    value: "Corporativo — implementar em toda a empresa",
    label: "Corporativo",
    description: "Projeto de transformação mais amplo na organização",
  },
  {
    value: "Produto — integrar IA no que entrego ao cliente",
    label: "No produto/serviço",
    description: "IA como parte do que entrego para os meus clientes",
  },
];

export function Step4PracticalApplication() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AssessmentValues>();

  const e = errors.step4;

  const { field: priorityAreaField } = useController({
    name: "step4.priority_area",
    control,
  });

  const { field: scopeField } = useController({
    name: "step4.application_scope",
    control,
  });

  return (
    <div className="animate-enter space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">
          Aplicação Prática no Curso
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          O Leadrix IA é focado em resultados reais. Quanto mais específico
          você for aqui, mais o curso vai se conectar com a sua realidade.
        </p>
      </div>

      <RadioGroup
        label="Em qual área você quer gerar mais impacto com IA?"
        options={PRIORITY_AREAS}
        value={priorityAreaField.value ?? ""}
        onChange={priorityAreaField.onChange}
        required
        columns={2}
        error={e?.priority_area?.message}
      />

      <Textarea
        label="Qual seria a aplicação de IA de maior valor para você ou sua empresa?"
        placeholder="Ex: Um sistema que classifica automaticamente os leads por potencial de conversão, liberando o time comercial para focar apenas nos melhores oportunidades..."
        required
        rows={3}
        hint="Pense grande — qual solução de IA teria o maior ROI para você?"
        error={e?.highest_value_application?.message}
        {...register("step4.highest_value_application")}
      />

      <Textarea
        label="Qual problema real você quer resolver durante o curso? (opcional)"
        placeholder="Ex: Tenho um processo de aprovação de contratos que leva 5 dias e poderia ser automatizado com IA para durar menos de 1 hora..."
        rows={3}
        hint="Traga um problema concreto do seu dia a dia. Vamos trabalhar nele durante as aulas práticas."
        error={e?.real_problem_to_use_in_course?.message}
        {...register("step4.real_problem_to_use_in_course")}
      />

      <Textarea
        label="Qual é a UMA aplicação que você quer ter pronta ao final do curso?"
        placeholder="Ex: Um assistente de IA que responde perguntas sobre meus produtos com base na base de conhecimento da empresa..."
        required
        rows={3}
        hint="Foco em uma entrega concreta e realizável."
        error={e?.one_ready_application_expected?.message}
        {...register("step4.one_ready_application_expected")}
      />

      <RadioGroup
        label="Qual é o escopo da aplicação que você está buscando?"
        options={APPLICATION_SCOPES}
        value={scopeField.value ?? ""}
        onChange={scopeField.onChange}
        required
        columns={2}
        error={e?.application_scope?.message}
      />
    </div>
  );
}
