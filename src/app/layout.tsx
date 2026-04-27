import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Assessment — Curso Leadrix IA",
    template: "%s | Leadrix IA",
  },
  description:
    "Formulário de assessment para personalização do Curso Leadrix IA. Responda em menos de 10 minutos e ajude-nos a tornar o curso mais relevante para você.",
  robots: {
    index: false, // Formulário interno — não indexar
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-mesh antialiased">
        {children}
      </body>
    </html>
  );
}
