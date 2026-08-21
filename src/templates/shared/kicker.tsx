import type { ReactNode } from "react";

/**
 * Kicker — §10.5 do design system. `slide-meta` em `azure-400`, canto superior esquerdo.
 *
 * O formato `pilar/ · índice` é convenção, não derivação: o texto vem digitado do campo,
 * e nada aqui o monta a partir de `deck.meta.pillar` com a posição do slide. Decisão 14
 * da §16 do documento de contexto. A caixa alta é da utility `slide-meta`.
 */
export function Kicker({ children }: { children: ReactNode }) {
  return <span className="slide-meta text-azure-radiance-400">{children}</span>;
}
