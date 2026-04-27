import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/admin/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Dashboard — Leadrix IA Admin",
    template: "%s | Leadrix IA Admin",
  },
};

/**
 * Layout do admin — verifica autenticação server-side.
 * O middleware já redireciona não autenticados, mas esta verificação
 * adiciona uma camada extra de segurança e busca dados do perfil.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-950">
      <Sidebar />

      <main className="flex-1 overflow-y-auto bg-neutral-50">
        <div className="min-h-full">{children}</div>
      </main>
    </div>
  );
}
