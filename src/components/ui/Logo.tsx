import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface LogoProps {
  /** Largura em px. Altura é ajustada proporcionalmente. */
  width?: number;
  /** Classe extra para o container */
  className?: string;
  /** Texto alternativo */
  alt?: string;
  priority?: boolean;
}

/**
 * Logo oficial da Leadrix IA.
 * O PNG já vem com fundo escuro embutido — não precisa de container adicional.
 */
export function Logo({
  width = 180,
  className,
  alt = "Leadrix IA — Lidere seu mercado com IA",
  priority = false,
}: LogoProps) {
  // Proporção da arte: ~5:4 (largura:altura)
  const height = Math.round(width * 0.8);

  return (
    <Image
      src="/logo-leadrix.png"
      alt={alt}
      width={width}
      height={height}
      priority={priority}
      className={cn("block select-none", className)}
    />
  );
}
