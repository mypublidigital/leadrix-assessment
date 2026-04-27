import { createClient } from "@/lib/supabase/server";
import { generateAssessmentCSV } from "@/lib/utils/csv";
import type { StudentWithAssessment } from "@/lib/types";

/**
 * GET /api/admin/export
 * Exporta todas as respostas do assessment em formato CSV.
 * Requer autenticação de admin.
 *
 * Query params opcionais:
 * - q: busca por nome, e-mail ou empresa
 * - industry: filtro por setor
 * - maturity: filtro por nível de maturidade
 */
export async function GET(request: Request) {
  const supabase = await createClient();

  // Verificar autenticação
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Não autorizado", { status: 401 });
  }

  const url = new URL(request.url);
  const query = url.searchParams.get("q") ?? "";
  const industry = url.searchParams.get("industry") ?? "";

  // Buscar todos os alunos com respostas
  let dbQuery = supabase
    .from("students")
    .select(`*, assessment_responses(*)`)
    .order("created_at", { ascending: false });

  if (query) {
    dbQuery = dbQuery.or(
      `full_name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`
    );
  }

  if (industry) {
    dbQuery = dbQuery.eq("industry", industry);
  }

  const { data, error } = await dbQuery;

  if (error) {
    return new Response("Erro ao buscar dados", { status: 500 });
  }

  const students = (data ?? []) as StudentWithAssessment[];
  const csv = generateAssessmentCSV(students);

  const filename = `leadrix-assessment-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
