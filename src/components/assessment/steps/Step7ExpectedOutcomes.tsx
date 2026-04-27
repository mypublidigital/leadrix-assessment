"use client";

import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/Textarea";
import type { AssessmentValues } from "@/lib/validations/assessment";

export function Step7ExpectedOutcomes() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AssessmentValues>();

  const e = errors.step7;

  return (
    <div className="animate-enter space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">
          Resultado Esperado ao Final do Curso
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Esta é a última seção. Queremos entender o que você considera
          sucesso ao concluir o Leadrix IA. Essas respostas guiam as
          entregas práticas e a personalização dos módulos finais.
        </p>
      </div>

      <Textarea
        label="Qual seria o resultado ideal para você ao final do curso?"
        placeholder="Ex: Quero ter implementado uma solução de IA que economiza 10 horas por semana no meu trabalho. Quero ter um roadmap claro de IA para minha empresa com as 3 primeiras iniciativas priorizadas..."
        required
        rows={4}
        hint="Seja concreto. Qual transformação você quer ver na sua realidade profissional?"
        error={e?.ideal_course_outcome?.message}
        {...register("step7.ideal_course_outcome")}
      />

      <Textarea
        label="O que seria 'sucesso' para você neste curso?"
        placeholder="Ex: Sair do curso com uma ferramenta de IA em produção, mesmo que simples. Entender profundamente como usar IA na minha área sem depender de uma equipe técnica..."
        required
        rows={4}
        hint="Sucesso pode ser técnico, estratégico, de networking, de mindset... o que for mais importante para você."
        error={e?.success_definition?.message}
        {...register("step7.success_definition")}
      />

      <Textarea
        label="Como você pretende aplicar o aprendizado após o curso? (opcional)"
        placeholder="Ex: Vou criar um grupo de estudo na minha empresa para disseminar o aprendizado. Vou apresentar um projeto de IA para a diretoria em 30 dias..."
        rows={3}
        hint="Nos ajuda a entender como apoiá-lo(a) após o curso."
        error={e?.post_course_application?.message}
        {...register("step7.post_course_application")}
      />

      <div className="rounded-xl bg-brand-50 border border-brand-100 p-5">
        <h3 className="text-sm font-semibold text-brand-800 mb-1">
          Obrigado por chegar até aqui!
        </h3>
        <p className="text-sm text-brand-700">
          Suas respostas serão analisadas pela equipe Leadrix IA antes do
          início do curso. Elas nos ajudarão a personalizar os exemplos,
          exercícios e conexões para maximizar seu resultado. Ao clicar em
          "Enviar", seu assessment estará completo.
        </p>
      </div>
    </div>
  );
}
