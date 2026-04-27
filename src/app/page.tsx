import { redirect } from "next/navigation";

/**
 * Página raiz — redireciona para o assessment
 */
export default function RootPage() {
  redirect("/assessment");
}
