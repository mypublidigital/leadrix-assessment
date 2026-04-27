"use client";

import { useFormContext, useController } from "react-hook-form";
import { RadioGroup } from "@/components/assessment/RadioGroup";
import type { AssessmentValues } from "@/lib/validations/assessment";

const LEARNING_STYLES = [
  {
    value: "Aprender fazendo — prefiro exemplos práticos e exercícios reais",
    label: "Aprender fazendo",
    description: "Prefiro exemplos práticos e exercícios reais",
  },
  {
    value: "Entender o porquê antes de executar — conceito primeiro",
    label: "Entender antes de executar",
    description: "Quero entender a lógica e os fundamentos primeiro",
  },
  {
    value: "Visual e prático — prefiro ver antes de fazer",
    label: "Visual e prático",
    description: "Aprendo melhor assistindo demonstrações antes de tentar",
  },
  {
    value: "Iterativo — prefiro errar rápido e ajustar",
    label: "Iterativo",
    description: "Começo, erro, aprendo com o erro e melhoro",
  },
  {
    value: "Por analogias — conecto IA ao que já conheço bem",
    label: "Por analogias",
    description: "Funciona melhor quando consigo comparar com algo familiar",
  },
];

const PARTICIPATION_STYLES = [
  {
    value: "Participação ativa — gosto de debater e compartilhar experiências",
    label: "Ativo e participativo",
    description: "Gosto de debater, compartilhar e liderar discussões",
  },
  {
    value: "Observo mais e contribuo quando tenho certeza",
    label: "Reflexivo",
    description: "Prefiro escutar, processar e contribuir quando faz sentido",
  },
  {
    value: "Questionador — gosto de ir fundo nas discussões",
    label: "Questionador",
    description: "Gosto de desafiar premissas e explorar profundidade",
  },
  {
    value: "Colaborativo — prefiro trabalhar em duplas ou grupos",
    label: "Colaborativo",
    description: "Aprendo melhor quando há troca e co-criação com colegas",
  },
];

const EXERCISE_STYLES = [
  {
    value: "Casos reais do meu setor adaptados ao meu contexto",
    label: "Casos do meu setor",
    description: "Situações próximas da minha realidade profissional",
  },
  {
    value: "Templates prontos que posso adaptar ao meu contexto",
    label: "Templates adaptáveis",
    description: "Frameworks prontos que posso customizar para o meu uso",
  },
  {
    value: "Projetos guiados com suporte próximo",
    label: "Projetos guiados",
    description: "Gosto de construir algo completo com orientação",
  },
  {
    value: "Projetos desafiadores com liberdade para explorar",
    label: "Projetos desafiadores",
    description: "Prefiro autonomia para resolver de formas criativas",
  },
  {
    value: "Exercícios que usam dados reais do meu contexto",
    label: "Com dados reais",
    description: "Quero trabalhar com os dados da minha empresa",
  },
];

export function Step6LearningStyle() {
  const {
    control,
    formState: { errors },
  } = useFormContext<AssessmentValues>();

  const e = errors.step6;

  const { field: learningField } = useController({
    name: "step6.preferred_learning_style",
    control,
  });

  const { field: participationField } = useController({
    name: "step6.participation_style",
    control,
  });

  const { field: exerciseField } = useController({
    name: "step6.preferred_exercise_style",
    control,
  });

  return (
    <div className="animate-enter space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">
          Estilo de Aprendizagem
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Cada pessoa aprende de um jeito. Essas informações nos ajudam a
          calibrar o ritmo, os exemplos e as dinâmicas de cada módulo.
        </p>
      </div>

      <RadioGroup
        label="Como você aprende melhor?"
        options={LEARNING_STYLES}
        value={learningField.value ?? ""}
        onChange={learningField.onChange}
        required
        error={e?.preferred_learning_style?.message}
      />

      <RadioGroup
        label="Qual é o seu estilo de participação em cursos?"
        options={PARTICIPATION_STYLES}
        value={participationField.value ?? ""}
        onChange={participationField.onChange}
        error={e?.participation_style?.message}
      />

      <RadioGroup
        label="Que tipo de exercício gera mais aprendizado para você?"
        options={EXERCISE_STYLES}
        value={exerciseField.value ?? ""}
        onChange={exerciseField.onChange}
        error={e?.preferred_exercise_style?.message}
      />
    </div>
  );
}
