import { cn } from "@/lib/utils";
import { WORDMARK_NODES, WORDMARK_STROKES, type MaiahubLogoProps } from "./logo-shared";

/**
 * Marca institucional. Home, open graph, cabeçalho do portfólio.
 * Mínimo 200px de largura — abaixo disso os pontos somem no antialiasing
 * e sobram traços soltos. Nesse caso troque pela MaiahubSignature.
 */
export function MaiahubWordmark({ className, mono = false, ...props }: MaiahubLogoProps) {
  return (
    <svg
      viewBox="0 0 332 66"
      role="img"
      aria-label="maiahub"
      className={cn("h-10 w-auto text-foreground", className)}
      {...props}
    >
      <g
        fill="none"
        strokeWidth={0.9}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-current/45"
      >
        {WORDMARK_STROKES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g className="fill-current">
        {WORDMARK_NODES.map(([cx, cy, r]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
        ))}
      </g>
      <circle cx={42} cy={6} r={5.5} className={mono ? "fill-current" : "fill-azure-radiance-400"} />
    </svg>
  );
}
