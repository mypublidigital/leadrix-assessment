"use client";

import { useState, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { ProgressBar } from "./ProgressBar";
import { Step1Identification } from "./steps/Step1Identification";
import { Step2ProfessionalMoment } from "./steps/Step2ProfessionalMoment";
import { Step3AIMaturity } from "./steps/Step3AIMaturity";
import { Step4PracticalApplication } from "./steps/Step4PracticalApplication";
import { Step5Networking } from "./steps/Step5Networking";
import { Step6LearningStyle } from "./steps/Step6LearningStyle";
import { Step7ExpectedOutcomes } from "./steps/Step7ExpectedOutcomes";

import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

import { assessmentSchema } from "@/lib/validations/assessment";
import type { AssessmentValues } from "@/lib/validations/assessment";
import { submitAssessment } from "@/lib/actions/assessment";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";

const STEPS = [
  {
    label: "Identificação",
    component: Step1Identification,
    fields: ["step1"] as const,
  },
  {
    label: "Momento Atual",
    component: Step2ProfessionalMoment,
    fields: ["step2"] as const,
  },
  {
    label: "Maturidade IA",
    component: Step3AIMaturity,
    fields: ["step3"] as const,
  },
  {
    label: "Aplicação",
    component: Step4PracticalApplication,
    fields: ["step4"] as const,
  },
  {
    label: "Networking",
    component: Step5Networking,
    fields: ["step5"] as const,
  },
  {
    label: "Aprendizagem",
    component: Step6LearningStyle,
    fields: ["step6"] as const,
  },
  {
    label: "Resultados",
    component: Step7ExpectedOutcomes,
    fields: ["step7"] as const,
  },
];

const DEFAULT_VALUES: AssessmentValues = {
  step1: {
    full_name: "",
    preferred_name: "",
    email: "",
    phone: "",
    company: "",
    job_title: "",
    industry: "",
    company_size: "",
    city: "",
    state: "",
    linkedin_url: "",
    years_experience: "",
  },
  step2: {
    strategic_moment: "",
    top_challenges: [],
    desired_results: "",
  },
  step3: {
    ai_maturity_level: "iniciante",
    current_ai_usage: "",
    tools_used: [],
    current_ai_use_cases: [],
    main_barriers: [],
  },
  step4: {
    priority_area: "",
    highest_value_application: "",
    real_problem_to_use_in_course: "",
    one_ready_application_expected: "",
    application_scope: "",
  },
  step5: {
    networking_topics: [],
    contribution_offer: "",
    desired_connections: "",
    opt_in_matchmaking: true,
  },
  step6: {
    preferred_learning_style: "",
    participation_style: "",
    preferred_exercise_style: "",
  },
  step7: {
    ideal_course_outcome: "",
    success_definition: "",
    post_course_application: "",
  },
};

export function AssessmentShell() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const methods = useForm<AssessmentValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onTouched",
  });

  const { handleSubmit, trigger } = methods;

  const isLastStep = currentStep === STEPS.length - 1;
  const currentStepConfig = STEPS[currentStep];
  const StepComponent = currentStepConfig.component;

  const goToPreviousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goToNextStep = useCallback(async () => {
    const fields = currentStepConfig.fields;
    const isValid = await trigger(fields as never);

    if (!isValid) return;

    setCurrentStep((prev) => Math.min(STEPS.length - 1, prev + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep, currentStepConfig.fields, trigger]);

  const onSubmit = useCallback(
    async (data: AssessmentValues) => {
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const result = await submitAssessment(data);

        if (result.success) {
          router.push("/obrigado");
        } else {
          setSubmitError(result.error);
          setIsSubmitting(false);
        }
      } catch {
        setSubmitError(
          "Ocorreu um erro inesperado. Por favor, tente novamente."
        );
        setIsSubmitting(false);
      }
    },
    [router]
  );

  return (
    <FormProvider {...methods}>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 border border-brand-100 px-4 py-1.5 mb-4">
            <span className="text-xs font-semibold text-brand-700 uppercase tracking-wider">
              Curso Leadrix IA
            </span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 sm:text-3xl">
            Assessment de Personalização
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Leva cerca de 8-12 minutos • Suas respostas ficam salvas automaticamente
          </p>
        </div>

        {/* Barra de progresso */}
        <div className="mb-8">
          <ProgressBar
            currentStep={currentStep}
            totalSteps={STEPS.length}
            stepLabels={STEPS.map((s) => s.label)}
          />
        </div>

        {/* Card do formulário */}
        <div className="card p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Step atual */}
            <StepComponent />

            {/* Erro de envio */}
            {submitError && (
              <Alert
                variant="error"
                title="Erro ao enviar"
                className="mt-6"
                onDismiss={() => setSubmitError(null)}
              >
                {submitError}
              </Alert>
            )}

            {/* Navegação */}
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-neutral-100 pt-6">
              <Button
                type="button"
                variant="ghost"
                onClick={goToPreviousStep}
                disabled={currentStep === 0 || isSubmitting}
                className="gap-1.5"
              >
                <ChevronLeft className="h-4 w-4" />
                Voltar
              </Button>

              <span className="text-xs text-neutral-400 hidden sm:block">
                {currentStep + 1} de {STEPS.length}
              </span>

              {isLastStep ? (
                <Button
                  type="submit"
                  loading={isSubmitting}
                  className="gap-2"
                  size="lg"
                >
                  <Send className="h-4 w-4" />
                  Enviar Assessment
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={goToNextStep}
                  className="gap-1.5"
                >
                  Próxima etapa
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Rodapé */}
        <p className="mt-6 text-center text-xs text-neutral-400">
          Seus dados são tratados com sigilo pela equipe Leadrix IA.
          Usados exclusivamente para personalização do curso.
        </p>
      </div>
    </FormProvider>
  );
}
