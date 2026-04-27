"use client";

import { useFormContext, useController } from "react-hook-form";
import { Textarea } from "@/components/ui/Textarea";
import { CheckboxGroup } from "@/components/assessment/CheckboxGroup";
import { RadioGroup } from "@/components/assessment/RadioGroup";
import type { AssessmentValues } from "@/lib/validations/assessment";
import { AI_MATURITY_LABELS } from "@/lib/types";
import type { AIMaturityLevel } from "@/lib/types";

const MATURITY_OPTIONS = (
  Object.entries(AI_MATURITY_LABELS) as [AIMaturityLevel, string][]
).map(([value, label]) => ({ value, label }));

const AI_TOOLS = [
  "ChatGPT / OpenAI",
  "Claude (Anthropic)",
  "Gemini (Google)",
  "Copilot (Microsoft)",
  "Midjourney / DALL-E",
  "Perplexity",
  "Notion AI",
  "Canva AI",
  "GitHub Copilot",
  "Power BI + AI",
  "Python / scikit-learn",
  "LangChain / LlamaIndex",
  "OpenAI API / Anthropic API",
  "AWS SageMaker / Google Vertex",
  "Outras ferramentas proprietárias",
];

const USE_CASES = [
  "Criação de conteúdo (textos, e-mails)",
  "Análise e resumo de documentos",
  "Análise de dados e relatórios",
  "Triagem e classificação de informações",
  "Atendimento ao cliente / Chatbots",
  "Geração de imagens ou design",
  "Código e automação",
  "Pesquisa e síntese de informações",
  "Apoio à tomada de decisão",
  "Criação de apresentações",
  "Transcrição e tradução",
];

const BARRIERS = [
  "Não sei por onde começar",
  "Falta de conhecimento técnico",
  "Custo de implementação",
  "Resistência cultural da equipe",
  "Falta de dados estruturados",
  "Integração com sistemas legados",
  "Questões de LGPD e privacidade",
  "Tempo para aprender e implementar",
  "Falta de apoio da liderança",
  "Dificuldade em medir o ROI",
];

export function Step3AIMaturity() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<AssessmentValues>();

  const e = errors.step3;

  const { field: maturityField } = useController({
    name: "step3.ai_maturity_level",
    control,
  });

  const { field: toolsField } = useController({
    name: "step3.tools_used",
    control,
  });

  const { field: useCasesField } = useController({
    name: "step3.current_ai_use_cases",
    control,
  });

  const { field: barriersField } = useController({
    name: "step3.main_barriers",
    control,
  });

  return (
    <div className="animate-enter space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-neutral-900">
          Maturidade em Inteligência Artificial
        </h2>
        <p className="mt-1 text-sm text-neutral-500">
          Não existe resposta certa ou errada. Queremos entender seu ponto de
          partida para adaptar o conteúdo e os exercícios ao seu nível.
        </p>
      </div>

      <RadioGroup
        label="Como você se descreve em relação ao uso de IA?"
        options={MATURITY_OPTIONS}
        value={maturityField.value ?? ""}
        onChange={maturityField.onChange}
        required
        error={e?.ai_maturity_level?.message}
      />

      <Textarea
        label="Como você usa IA hoje no seu trabalho? (opcional)"
        placeholder="Ex: Uso ChatGPT para redigir e-mails e criar textos. Comecei a explorar análise de dados com IA mas ainda estou aprendendo..."
        rows={3}
        error={e?.current_ai_usage?.message}
        {...register("step3.current_ai_usage")}
      />

      <CheckboxGroup
        label="Quais ferramentas de IA você já usou?"
        options={AI_TOOLS}
        value={toolsField.value ?? []}
        onChange={toolsField.onChange}
        columns={2}
        hint="Selecione todas com as quais já teve algum contato."
        error={e?.tools_used?.message}
      />

      <CheckboxGroup
        label="Quais casos de uso de IA você já praticou?"
        options={USE_CASES}
        value={useCasesField.value ?? []}
        onChange={useCasesField.onChange}
        columns={2}
        hint="Mesmo que tenha sido de forma básica ou experimental."
        error={e?.current_ai_use_cases?.message}
      />

      <CheckboxGroup
        label="Quais são as maiores barreiras para implementar IA na sua realidade?"
        options={BARRIERS}
        value={barriersField.value ?? []}
        onChange={barriersField.onChange}
        columns={2}
        hint="Selecione as que mais dificultam o seu avanço."
        error={e?.main_barriers?.message}
      />
    </div>
  );
}
