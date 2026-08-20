import { cn } from "@/lib/utils";
import type { MaiahubLogoProps } from "./logo-shared";

/**
 * Versão simplificada para 16–24px: sem o vértice central, traço mais grosso,
 * pontos proporcionalmente maiores. Mesma lógica ótica do favicon.
 * Acima de 24px use MaiahubMark.
 */
export function MaiahubGlyph({ className, mono = false, ...props }: MaiahubLogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="maiahub"
      className={cn("size-5 text-foreground", className)}
      {...props}
    >
      <path
        d="M6 26 L6 6 L16 16 L26 6 L26 26"
        fill="none"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-current/55"
      />
      <g className="fill-current">
        <circle cx={6} cy={26} r={2.1} />
        <circle cx={6} cy={6} r={2.1} />
        <circle cx={26} cy={26} r={2.1} />
      </g>
      <circle cx={26} cy={6} r={3.4} className={mono ? "fill-current" : "fill-azure-radiance-400"} />
    </svg>
  );
}
