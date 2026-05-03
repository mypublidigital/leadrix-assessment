"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { deleteStudent } from "@/lib/actions/students";
import { Trash2, AlertTriangle, X } from "lucide-react";

interface DeleteStudentButtonProps {
  studentId: string;
  studentName: string;
}

export function DeleteStudentButton({
  studentId,
  studentName,
}: DeleteStudentButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");

  const expected = "EXCLUIR";
  const canDelete = confirmText.trim().toUpperCase() === expected;

  const handleDelete = () => {
    if (!canDelete) return;
    setError(null);

    startTransition(async () => {
      const result = await deleteStudent(studentId);
      // Em caso de sucesso, deleteStudent faz redirect — não retorna.
      // Só caímos aqui se houver erro.
      if (result && !result.success) {
        setError(result.error);
      }
    });
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setOpen(true);
          setError(null);
          setConfirmText("");
        }}
        className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Excluir aluno
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => !isPending && setOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-xl bg-white shadow-xl">
            <div className="flex items-start justify-between p-5 border-b border-neutral-200">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-neutral-900">
                    Excluir aluno
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Esta ação não pode ser desfeita.
                  </p>
                </div>
              </div>
              <button
                onClick={() => !isPending && setOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <p className="text-sm text-neutral-700">
                Você está prestes a excluir{" "}
                <strong className="font-semibold">{studentName}</strong> e todos
                os dados relacionados:
              </p>
              <ul className="text-xs text-neutral-600 space-y-1 ml-4 list-disc">
                <li>Respostas do assessment</li>
                <li>Sugestões de networking</li>
                <li>Notas internas administrativas</li>
              </ul>
              <div>
                <label className="text-xs font-medium text-neutral-700">
                  Para confirmar, digite{" "}
                  <span className="font-mono font-semibold text-red-600">
                    {expected}
                  </span>
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="mt-1 h-10 w-full rounded-lg border border-neutral-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  autoFocus
                  disabled={isPending}
                />
              </div>
              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
                  {error}
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 p-5 border-t border-neutral-200 bg-neutral-50 rounded-b-xl">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                loading={isPending}
                disabled={!canDelete || isPending}
              >
                Excluir definitivamente
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
