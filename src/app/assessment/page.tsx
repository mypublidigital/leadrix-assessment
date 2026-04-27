import type { Metadata } from "next";
import { AssessmentShell } from "@/components/assessment/AssessmentShell";

export const metadata: Metadata = {
  title: "Assessment — Curso Leadrix IA",
  description:
    "Responda ao assessment de personalização do Curso Leadrix IA. Leva menos de 12 minutos.",
};

export default function AssessmentPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-50 to-white py-4 sm:py-8">
      <AssessmentShell />
    </main>
  );
}
