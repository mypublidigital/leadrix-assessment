import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";
import { UsersManagement } from "@/components/admin/settings/UsersManagement";
import { ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "Configurações",
};

// Configurações é uma página com dados sensíveis de usuários — sempre dinâmica.
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login?redirectTo=/admin/settings");
  }

  // Verifica se é admin
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (currentProfile?.role !== "admin") {
    return (
      <div className="px-6 py-8">
        <div className="mx-auto max-w-md rounded-xl border border-amber-200 bg-amber-50 p-6 text-center">
          <ShieldAlert className="h-8 w-8 text-amber-600 mx-auto mb-3" />
          <h1 className="text-lg font-semibold text-amber-900">
            Acesso restrito
          </h1>
          <p className="text-sm text-amber-700 mt-1">
            Apenas administradores podem acessar as configurações de usuários.
          </p>
        </div>
      </div>
    );
  }

  // Lista todos os profiles via service role (bypassa RLS)
  const adminClient = await createAdminClient();
  const { data: profiles } = await adminClient
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const users = (profiles ?? []) as Profile[];

  return (
    <div className="px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Configurações</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Gerencie usuários administradores e visualizadores do painel.
        </p>
      </div>

      <UsersManagement initialUsers={users} currentUserId={user.id} />
    </div>
  );
}
