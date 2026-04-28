import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { StudentWithAssessment } from "@/lib/types";
import { AI_MATURITY_LABELS } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Search, Download, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Alunos",
};

interface PageProps {
  searchParams: Promise<{
    q?: string;
    industry?: string;
    maturity?: string;
    page?: string;
  }>;
}

const MATURITY_BADGE_VARIANTS = {
  iniciante: "warning",
  basico: "warning",
  intermediario: "info",
  avancado: "success",
  especialista: "brand",
} as const;

const PAGE_SIZE = 25;

export default async function StudentsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q ?? "";
  const industryFilter = params.industry ?? "";
  const maturityFilter = params.maturity ?? "";
  const page = Number(params.page ?? 1);

  const supabase = await createClient();

  let dbQuery = supabase
    .from("students")
    .select(`*, assessment_responses(*)`, { count: "exact" })
    .order("created_at", { ascending: false });

  if (query) {
    dbQuery = dbQuery.or(
      `full_name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`
    );
  }

  if (industryFilter) {
    dbQuery = dbQuery.eq("industry", industryFilter);
  }

  const { data, count } = await dbQuery.range(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE - 1
  );

  const students = (data ?? []) as StudentWithAssessment[];

  // Filtro de maturidade (client-side, pois está na tabela relacionada)
  const filteredStudents = maturityFilter
    ? students.filter(
        (s) =>
          s.assessment_responses?.ai_maturity_level === maturityFilter
      )
    : students;

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  // Listar setores únicos para filtro
  const { data: industries } = await supabase
    .from("students")
    .select("industry")
    .not("industry", "is", null);

  const uniqueIndustries = Array.from(
    new Set(industries?.map((i) => i.industry).filter(Boolean) ?? [])
  ).sort();

  return (
    <div className="px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Alunos</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {count ?? 0} cadastro{(count ?? 0) !== 1 ? "s" : ""} recebido
            {(count ?? 0) !== 1 ? "s" : ""}
          </p>
        </div>
        <a
          href="/api/admin/export"
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors shadow-sm"
          download
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </a>
      </div>

      {/* Filtros */}
      <form
        method="GET"
        className="flex flex-wrap items-center gap-3"
        suppressHydrationWarning
      >
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Buscar por nome, e-mail ou empresa..."
            className="w-full h-10 rounded-lg border border-neutral-300 bg-white pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <select
          name="industry"
          defaultValue={industryFilter}
          className="h-10 rounded-lg border border-neutral-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">Todos os setores</option>
          {uniqueIndustries.map((ind) => (
            <option key={ind} value={ind ?? ""}>
              {ind}
            </option>
          ))}
        </select>

        <select
          name="maturity"
          defaultValue={maturityFilter}
          className="h-10 rounded-lg border border-neutral-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">Qualquer maturidade</option>
          {Object.entries(AI_MATURITY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label.split(" —")[0]}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="h-10 rounded-lg bg-brand-700 px-4 text-sm font-medium text-white hover:bg-brand-800 transition-colors"
        >
          Filtrar
        </button>

        {(query || industryFilter || maturityFilter) && (
          <a
            href="/admin/students"
            className="h-10 flex items-center px-3 text-sm text-neutral-500 hover:text-neutral-700"
          >
            Limpar filtros
          </a>
        )}
      </form>

      {/* Tabela */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Aluno
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 hidden md:table-cell">
                  Empresa / Cargo
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 hidden sm:table-cell">
                  Setor
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Maturidade IA
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 hidden lg:table-cell">
                  Área Prioritária
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <User className="mx-auto h-8 w-8 text-neutral-300 mb-2" />
                    <p className="text-sm text-neutral-500">
                      Nenhum aluno encontrado.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const r = student.assessment_responses;
                  const maturityLevel = r?.ai_maturity_level;
                  const variant = maturityLevel
                    ? MATURITY_BADGE_VARIANTS[maturityLevel]
                    : "neutral";

                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-neutral-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/admin/students/${student.id}`}
                          className="flex items-center gap-3 group"
                        >
                          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700 text-sm font-semibold">
                            {(student.preferred_name ?? student.full_name)
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-neutral-900 group-hover:text-brand-700 transition-colors">
                              {student.preferred_name ?? student.full_name}
                            </p>
                            <p className="text-xs text-neutral-400">
                              {student.email}
                            </p>
                          </div>
                        </Link>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <p className="text-neutral-700">
                          {student.company ?? "—"}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {student.job_title ?? "—"}
                        </p>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-neutral-600">
                          {student.industry ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {maturityLevel ? (
                          <Badge variant={variant as never}>
                            {maturityLevel.charAt(0).toUpperCase() +
                              maturityLevel.slice(1)}
                          </Badge>
                        ) : (
                          <span className="text-neutral-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-neutral-600 text-xs">
                          {r?.priority_area ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={r?.is_complete ? "success" : "warning"}>
                          {r?.is_complete ? "Completo" : "Incompleto"}
                        </Badge>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="border-t border-neutral-200 px-4 py-3 flex items-center justify-between">
            <p className="text-xs text-neutral-500">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`/admin/students?q=${query}&industry=${industryFilter}&maturity=${maturityFilter}&page=${page - 1}`}
                  className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-neutral-50"
                >
                  Anterior
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`/admin/students?q=${query}&industry=${industryFilter}&maturity=${maturityFilter}&page=${page + 1}`}
                  className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium hover:bg-neutral-50"
                >
                  Próxima
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
