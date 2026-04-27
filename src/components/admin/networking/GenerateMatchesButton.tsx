"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { generateMatches } from "@/lib/actions/admin";
import { Sparkles } from "lucide-react";

export function GenerateMatchesButton() {
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<string | null>(null);
  const router = useRouter();

  const handleGenerate = () => {
    setFeedback(null);

    startTransition(async () => {
      const result = await generateMatches();

      if (result.success) {
        const count = result.data?.count ?? 0;
        setFeedback(
          count > 0
            ? `${count} sugestão${count !== 1 ? "ões" : ""} gerada${count !== 1 ? "s" : ""}!`
            : "Nenhum novo match encontrado com os critérios atuais."
        );
        router.refresh();
      } else {
        setFeedback(`Erro: ${result.error}`);
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        onClick={handleGenerate}
        loading={isPending}
        className="gap-2"
      >
        <Sparkles className="h-4 w-4" />
        Gerar Matches
      </Button>
      {feedback && (
        <p className="text-xs text-neutral-500">{feedback}</p>
      )}
    </div>
  );
}
