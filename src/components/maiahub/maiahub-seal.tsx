import { cn } from "@/lib/utils";
import type { MaiahubLogoProps } from "./logo-shared";

/**
 * Contextos circulares e quadrados: avatar, foto de perfil, ícone de PWA.
 * Mínimo 40px.
 */
export function MaiahubSeal({ className, mono = false, ...props }: MaiahubLogoProps) {
  return (
    <svg
      viewBox="0 0 112 112"
      role="img"
      aria-label="maiahub"
      className={cn("size-14 text-foreground", className)}
      {...props}
    >
      <circle cx={56} cy={56} r={48} fill="none" strokeWidth={1} className="stroke-current/35" />
      <path
        d="M38 76 L38 36 L56 56 L74 36 L74 76"
        fill="none"
        strokeWidth={1}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-current/45"
      />
      <g className="fill-current">
        <circle cx={38} cy={76} r={2.6} />
        <circle cx={38} cy={36} r={2.6} />
        <circle cx={56} cy={56} r={2.2} />
        <circle cx={74} cy={76} r={2.6} />
      </g>
      <circle cx={74} cy={36} r={5} className={mono ? "fill-current" : "fill-azure-radiance-400"} />
    </svg>
  );
}
