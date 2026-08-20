import { cn } from "@/lib/utils";
import type { MaiahubLogoProps } from "./logo-shared";

/**
 * Versão curta: a primeira letra do wordmark, isolada.
 * Ícone de app, marca d'água, elemento gráfico solto.
 * Mínimo 24px de altura — abaixo disso use MaiahubGlyph.
 */
export function MaiahubMark({ className, mono = false, ...props }: MaiahubLogoProps) {
  return (
    <svg
      viewBox="0 0 52 66"
      role="img"
      aria-label="maiahub"
      className={cn("h-6 w-auto text-foreground", className)}
      {...props}
    >
      <path
        d="M6 60 L6 6 L26 33 L46 6 L46 60"
        fill="none"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-current/45"
      />
      <g className="fill-current">
        <circle cx={6} cy={60} r={3} />
        <circle cx={6} cy={6} r={3} />
        <circle cx={26} cy={33} r={2.6} />
        <circle cx={46} cy={60} r={3} />
      </g>
      <circle cx={46} cy={6} r={6} className={mono ? "fill-current" : "fill-azure-radiance-400"} />
    </svg>
  );
}
