"use client";

import { useState, useTransition } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createNote, deleteNote } from "@/lib/actions/admin";
import type { AdminNote, NoteCategory } from "@/lib/types";
import { Trash2, Plus, StickyNote } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils/cn";

const CATEGORIES: { value: NoteCategory; label: string; color: string }[] = [
  { value: "geral", label: "Geral", color: "bg-neutral-100 text-neutral-700" },
  { value: "personalização", label: "Personalização", color: "bg-brand-50 text-brand-700" },
  { value: "networking", label: "Networking", color: "bg-sky-50 text-sky-700" },
  { value: "atenção", label: "Atenção", color: "bg-amber-50 text-amber-700" },
  { value: "destaque", label: "Destaque", color: "bg-emerald-50 text-emerald-700" },
];

interface AdminNotesPanelProps {
  studentId: string;
  initialNotes: AdminNote[];
}

export function AdminNotesPanel({ studentId, initialNotes }: AdminNotesPanelProps) {
  const [notes, setNotes] = useState<AdminNote[]>(initialNotes);
  const [showForm, setShowForm] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [category, setCategory] = useState<NoteCategory>("geral");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    setError(null);

    startTransition(async () => {
      const result = await createNote({
        student_id: studentId,
        note: noteText.trim(),
        category,
      });

      if (result.success) {
        // Adiciona nota otimisticamente
        const newNote: AdminNote = {
          id: result.data!.id,
          student_id: studentId,
          note: noteText.trim(),
          category,
          created_by: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setNotes((prev) => [newNote, ...prev]);
        setNoteText("");
        setShowForm(false);
      } else {
        setError(result.error);
      }
    });
  };

  const handleDeleteNote = (noteId: string) => {
    startTransition(async () => {
      const result = await deleteNote(noteId);
      if (result.success) {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
      }
    });
  };

  const getCategoryStyle = (cat: NoteCategory) =>
    CATEGORIES.find((c) => c.value === cat)?.color ?? "bg-neutral-100 text-neutral-700";

  const getCategoryLabel = (cat: NoteCategory) =>
    CATEGORIES.find((c) => c.value === cat)?.label ?? cat;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Notas Internas</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm((v) => !v)}
          >
            <Plus className="h-3.5 w-3.5" />
            Adicionar
          </Button>
        </div>
      </CardHeader>

      {showForm && (
        <div className="mb-4 space-y-3 rounded-lg bg-neutral-50 border border-neutral-200 p-3">
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Escreva sua anotação sobre este aluno..."
            rows={3}
            className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as NoteCategory)}
              className="h-8 rounded-lg border border-neutral-300 bg-white px-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <Button
              size="sm"
              onClick={handleAddNote}
              loading={isPending}
              disabled={!noteText.trim()}
            >
              Salvar nota
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </Button>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
      )}

      {notes.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-6 text-center">
          <StickyNote className="h-6 w-6 text-neutral-300" />
          <p className="text-xs text-neutral-400">
            Nenhuma nota ainda.
            <br />
            Adicione observações internas sobre este aluno.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {notes.map((note) => (
            <li
              key={note.id}
              className="rounded-lg border border-neutral-200 bg-neutral-50 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs text-neutral-700 leading-relaxed flex-1">
                  {note.note}
                </p>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  disabled={isPending}
                  className="flex-shrink-0 p-1 rounded text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  aria-label="Deletar nota"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={cn(
                    "inline-block rounded-full px-2 py-0.5 text-[10px] font-medium",
                    getCategoryStyle(note.category)
                  )}
                >
                  {getCategoryLabel(note.category)}
                </span>
                <span className="text-[10px] text-neutral-400">
                  {formatDistanceToNow(new Date(note.created_at), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
