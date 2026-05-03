import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { StudentWithAssessment, AdminNote } from "@/lib/types";
import { AI_MATURITY_LABELS } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { InsightCard } from "@/components/admin/InsightCard";
import { AdminNotesPanel } from "@/components/admin/students/AdminNotesPanel";
import { DeleteStudentButton } from "@/components/admin/students/DeleteStudentButton";
import { generateStudentInsights } from "@/lib/utils/insights";
import { ArrowLeft, MapPin, Building2, Briefcase, Link2, Mail, Phone } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("students")
    .select("full_name")
    .eq("id", id)
    .single();

  return { title: data?.full_name ?? "Aluno" };
}

export default async function StudentDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const [studentResult, notesResult] = await Promise.all([
    supabase
      .from("students")
      .select(`*, assessment_responses(*)`)
      .eq("id", id)
      .single(),
    supabase
      .from("admin_notes")
      .select("*")
      .eq("student_id", id)
      .order("created_at", { ascending: false }),
  ]);

  if (!studentResult.data) notFound();

  const student = studentResult.data as StudentWithAssessment;
  const notes = (notesResult.data ?? []) as AdminNote[];
  // Defensivo: Supabase retorna a relação como objeto (com UNIQUE constraint)
  // ou como array (sem). Normalizamos pra objeto.
  const rawR = student.assessment_responses as
    | StudentWithAssessment["assessment_responses"]
    | StudentWithAssessment["assessment_responses"][]
    | null;
  const r = Array.isArray(rawR) ? (rawR[0] ?? null) : rawR;

  const insights = generateStudentInsights(student);

  const maturityLabel = r?.ai_maturity_level
    ? AI_MATURITY_LABELS[r.ai_maturity_level]
    : null;

  const MATURITY_BADGE_VARIANTS = {
    iniciante: "warning",
    basico: "warning",
    intermediario: "info",
    avancado: "success",
    especialista: "brand",
  } as const;

  const maturityVariant = r?.ai_maturity_level
    ? MATURITY_BADGE_VARIANTS[r.ai_maturity_level]
    : "neutral";

  return (
    <div className="px-6 py-8 space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/students"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para alunos
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-brand-700 text-white text-xl font-bold">
              {(student.preferred_name ?? student.full_name).charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                {student.full_name}
              </h1>
              {student.preferred_name && student.preferred_name !== student.full_name && (
                <p className="text-sm text-neutral-500">
                  Chamado(a) de "{student.preferred_name}"
                </p>
              )}
              <div className="mt-2 flex flex-wrap gap-2">
                {r?.ai_maturity_level && (
                  <Badge variant={maturityVariant as never}>
                    IA: {r.ai_maturity_level.charAt(0).toUpperCase() + r.ai_maturity_level.slice(1)}
                  </Badge>
                )}
                <Badge variant={r?.is_complete ? "success" : "warning"}>
                  {r?.is_complete ? "Assessment completo" : "Assessment incompleto"}
                </Badge>
                {r?.opt_in_matchmaking && (
                  <Badge variant="info">Opt-in networking</Badge>
                )}
              </div>
            </div>
          </div>
          <DeleteStudentButton
            studentId={student.id}
            studentName={student.full_name}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Perfil */}
          <Card>
            <CardHeader>
              <CardTitle>Perfil Profissional</CardTitle>
            </CardHeader>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InfoItem icon={Mail} label="E-mail" value={student.email} />
              {student.phone && (
                <InfoItem icon={Phone} label="Telefone" value={student.phone} />
              )}
              {student.company && (
                <InfoItem icon={Building2} label="Empresa" value={student.company} />
              )}
              {student.job_title && (
                <InfoItem icon={Briefcase} label="Cargo" value={student.job_title} />
              )}
              {student.industry && (
                <InfoItem icon={Building2} label="Setor" value={student.industry} />
              )}
              {(student.city || student.state) && (
                <InfoItem
                  icon={MapPin}
                  label="Localização"
                  value={[student.city, student.state].filter(Boolean).join(", ")}
                />
              )}
              {student.years_experience && (
                <InfoItem icon={Briefcase} label="Experiência" value={student.years_experience} />
              )}
              {student.linkedin_url && (
                <InfoItem
                  icon={Link2}
                  label="LinkedIn"
                  value={student.linkedin_url}
                  link={student.linkedin_url}
                />
              )}
            </div>
          </Card>

          {r && (
            <>
              {/* Momento profissional */}
              <Card>
                <CardHeader>
                  <CardTitle>Momento Profissional</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <ResponseBlock
                    label="Momento estratégico atual"
                    value={r.strategic_moment}
                  />
                  <ResponseBlock
                    label="Resultados desejados"
                    value={r.desired_results}
                  />
                  <TagsBlock
                    label="Principais desafios"
                    items={r.top_challenges ?? []}
                  />
                </div>
              </Card>

              {/* Maturidade IA */}
              <Card>
                <CardHeader>
                  <CardTitle>Maturidade em IA</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  {maturityLabel && (
                    <div>
                      <p className="text-xs font-medium text-neutral-500 mb-1">Nível</p>
                      <p className="text-sm text-neutral-800">{maturityLabel}</p>
                    </div>
                  )}
                  <ResponseBlock label="Uso atual de IA" value={r.current_ai_usage} />
                  <TagsBlock label="Ferramentas usadas" items={r.tools_used ?? []} />
                  <TagsBlock label="Casos de uso atuais" items={r.current_ai_use_cases ?? []} />
                  <TagsBlock label="Principais barreiras" items={r.main_barriers ?? []} />
                </div>
              </Card>

              {/* Aplicação prática */}
              <Card>
                <CardHeader>
                  <CardTitle>Aplicação Prática</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <ResponseBlock label="Área prioritária" value={r.priority_area} />
                  <ResponseBlock
                    label="Aplicação de maior valor"
                    value={r.highest_value_application}
                  />
                  <ResponseBlock
                    label="Problema real para usar no curso"
                    value={r.real_problem_to_use_in_course}
                  />
                  <ResponseBlock
                    label="Uma aplicação pronta esperada"
                    value={r.one_ready_application_expected}
                  />
                  <ResponseBlock label="Escopo de aplicação" value={r.application_scope} />
                </div>
              </Card>

              {/* Networking */}
              <Card>
                <CardHeader>
                  <CardTitle>Networking</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <TagsBlock label="Tópicos de interesse" items={r.networking_topics ?? []} />
                  <ResponseBlock
                    label="O que pode oferecer ao grupo"
                    value={r.contribution_offer}
                  />
                  <ResponseBlock
                    label="Conexões desejadas"
                    value={r.desired_connections}
                  />
                </div>
              </Card>

              {/* Estilo e resultado */}
              <Card>
                <CardHeader>
                  <CardTitle>Aprendizagem e Resultado</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                  <ResponseBlock
                    label="Estilo de aprendizagem"
                    value={r.preferred_learning_style}
                  />
                  <ResponseBlock
                    label="Estilo de participação"
                    value={r.participation_style}
                  />
                  <ResponseBlock
                    label="Estilo de exercício preferido"
                    value={r.preferred_exercise_style}
                  />
                  <ResponseBlock
                    label="Resultado ideal do curso"
                    value={r.ideal_course_outcome}
                  />
                  <ResponseBlock
                    label="Definição de sucesso"
                    value={r.success_definition}
                  />
                  <ResponseBlock
                    label="Aplicação pós-curso"
                    value={r.post_course_application}
                  />
                </div>
              </Card>
            </>
          )}

          {!r && (
            <div className="card p-8 text-center">
              <p className="text-sm text-neutral-500">
                Este aluno ainda não completou o assessment.
              </p>
            </div>
          )}
        </div>

        {/* Coluna lateral */}
        <div className="space-y-6">
          {/* Insights do aluno */}
          <Card>
            <CardHeader>
              <CardTitle>Insights para Personalização</CardTitle>
            </CardHeader>
            {insights.length === 0 ? (
              <p className="text-xs text-neutral-500">
                Nenhum insight disponível ainda.
              </p>
            ) : (
              <ul className="space-y-2">
                {insights.map((insight, i) => (
                  <li
                    key={i}
                    className="text-xs text-neutral-700 flex items-start gap-2"
                  >
                    <span className="mt-0.5 text-brand-600 flex-shrink-0">•</span>
                    {insight}
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {/* Notas administrativas */}
          <AdminNotesPanel studentId={student.id} initialNotes={notes} />
        </div>
      </div>
    </div>
  );
}

// Componentes de suporte internos
function InfoItem({
  icon: Icon,
  label,
  value,
  link,
}: {
  icon: typeof Mail;
  label: string;
  value: string | null | undefined;
  link?: string;
}) {
  if (!value) return null;

  return (
    <div className="flex items-start gap-2.5">
      <Icon className="h-4 w-4 text-neutral-400 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-xs text-neutral-500">{label}</p>
        {link ? (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-700 hover:underline break-all"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm text-neutral-800 break-words">{value}</p>
        )}
      </div>
    </div>
  );
}

function ResponseBlock({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;

  return (
    <div>
      <p className="text-xs font-medium text-neutral-500 mb-1">{label}</p>
      <p className="text-sm text-neutral-800 leading-relaxed">{value}</p>
    </div>
  );
}

function TagsBlock({ label, items }: { label: string; items: string[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-medium text-neutral-500 mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="inline-block rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
