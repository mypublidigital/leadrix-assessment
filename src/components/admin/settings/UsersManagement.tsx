"use client";

import { useState, useTransition } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import {
  createAdminUser,
  updateUserRole,
  deleteAdminUser,
} from "@/lib/actions/admin-users";
import type { Profile, UserRole } from "@/lib/types";
import {
  UserPlus,
  Trash2,
  Shield,
  Eye,
  AlertTriangle,
  X,
  Mail,
  CheckCircle2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface UsersManagementProps {
  initialUsers: Profile[];
  currentUserId: string;
}

export function UsersManagement({
  initialUsers,
  currentUserId,
}: UsersManagementProps) {
  const [users, setUsers] = useState<Profile[]>(initialUsers);
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<UserRole>("viewer");
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setRole("viewer");
    setFormError(null);
  };

  const handleCreate = () => {
    setFormError(null);
    setSuccess(null);

    if (!email.trim() || !password) {
      setFormError("Informe e-mail e senha");
      return;
    }
    if (password.length < 6) {
      setFormError("Senha deve ter no mínimo 6 caracteres");
      return;
    }

    startTransition(async () => {
      const result = await createAdminUser(
        email,
        password,
        role,
        fullName
      );

      if (result.success) {
        setSuccess(`Usuário ${email.trim().toLowerCase()} criado com sucesso.`);
        resetForm();
        setShowForm(false);
        // Recarrega a página pra puxar o novo usuário do servidor
        // (alternativa: fazer uma action que retorne os profiles atualizados)
        setTimeout(() => window.location.reload(), 600);
      } else {
        setFormError(result.error);
      }
    });
  };

  const handleToggleRole = (user: Profile) => {
    if (user.id === currentUserId) return;
    const newRole: UserRole = user.role === "admin" ? "viewer" : "admin";

    startTransition(async () => {
      const result = await updateUserRole(user.id, newRole);
      if (result.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
        );
      } else {
        alert(result.error);
      }
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setDeleteError(null);

    startTransition(async () => {
      const result = await deleteAdminUser(deleteTarget.id);
      if (result.success) {
        setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
        setDeleteTarget(null);
      } else {
        setDeleteError(result.error);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Usuários do painel</CardTitle>
            <CardDescription>
              Gerencie quem pode acessar o painel administrativo.
            </CardDescription>
          </div>
          <Button
            variant={showForm ? "ghost" : "primary"}
            size="sm"
            onClick={() => {
              setShowForm((v) => !v);
              setSuccess(null);
              if (showForm) resetForm();
            }}
          >
            {showForm ? (
              <>
                <X className="h-3.5 w-3.5" />
                Cancelar
              </>
            ) : (
              <>
                <UserPlus className="h-3.5 w-3.5" />
                Novo usuário
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          {success}
        </div>
      )}

      {showForm && (
        <div className="mb-6 space-y-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              label="Nome completo"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Maria Silva"
              disabled={isPending}
            />
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="maria@empresa.com"
              required
              disabled={isPending}
            />
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              required
              hint="O usuário poderá alterá-la depois pelo fluxo de redefinição de senha."
              disabled={isPending}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-neutral-700">
                Papel
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                disabled={isPending}
                className="h-10 rounded-lg border border-neutral-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
              >
                <option value="viewer">Viewer (somente leitura)</option>
                <option value="admin">Admin (acesso total)</option>
              </select>
            </div>
          </div>

          {formError && (
            <p className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700">
              {formError}
            </p>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              size="sm"
              onClick={handleCreate}
              loading={isPending}
              disabled={!email.trim() || !password}
            >
              Criar usuário
            </Button>
          </div>
        </div>
      )}

      {users.length === 0 ? (
        <p className="py-8 text-center text-sm text-neutral-500">
          Nenhum usuário cadastrado.
        </p>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {users.map((user) => {
            const isSelf = user.id === currentUserId;
            return (
              <li
                key={user.id}
                className="flex items-center justify-between gap-3 py-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                    {user.role === "admin" ? (
                      <Shield className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {user.full_name || "(sem nome)"}
                      </p>
                      {isSelf && (
                        <Badge variant="neutral">Você</Badge>
                      )}
                      <Badge variant={user.role === "admin" ? "brand" : "neutral"}>
                        {user.role === "admin" ? "Admin" : "Viewer"}
                      </Badge>
                    </div>
                    <p className="flex items-center gap-1.5 text-xs text-neutral-500 mt-0.5 truncate">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">
                      Criado{" "}
                      {formatDistanceToNow(new Date(user.created_at), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleRole(user)}
                    disabled={isSelf || isPending}
                    title={
                      isSelf
                        ? "Você não pode alterar seu próprio papel"
                        : `Tornar ${user.role === "admin" ? "viewer" : "admin"}`
                    }
                  >
                    {user.role === "admin" ? "→ Viewer" : "→ Admin"}
                  </Button>
                  <button
                    onClick={() => {
                      setDeleteTarget(user);
                      setDeleteError(null);
                    }}
                    disabled={isSelf || isPending}
                    className="p-2 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    title={
                      isSelf
                        ? "Você não pode excluir sua própria conta"
                        : "Excluir usuário"
                    }
                    aria-label="Excluir usuário"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Modal de confirmação de exclusão */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !isPending && setDeleteTarget(null)}
          />
          <div className="relative w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-start gap-3 p-5 border-b border-neutral-200">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-neutral-900">
                  Excluir usuário
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Esta ação remove o acesso ao painel e não pode ser desfeita.
                </p>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-sm text-neutral-700">
                Excluir{" "}
                <strong className="font-semibold">
                  {deleteTarget.full_name || deleteTarget.email}
                </strong>
                ?
              </p>
              <p className="text-xs text-neutral-500">
                O usuário perderá imediatamente o acesso ao painel
                administrativo.
              </p>
              {deleteError && (
                <p className="rounded-lg bg-red-50 border border-red-200 p-2 text-xs text-red-700">
                  {deleteError}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 p-5 border-t border-neutral-200 bg-neutral-50 rounded-b-xl">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteTarget(null)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                loading={isPending}
              >
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
