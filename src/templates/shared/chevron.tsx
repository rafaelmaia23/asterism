import { ChevronsRight } from "lucide-react";

/**
 * Afordância de deslize — §10.5 do design system. Chevron duplo, 40px, traço 2.25,
 * `azure-400`, à direita da constelação com gap de 20px.
 *
 * Presente somente na capa: a partir do slide 2 a pessoa já executou o gesto, e repetir
 * a seta seria instruir quem já sabe.
 */
export function Chevron() {
  return (
    <ChevronsRight
      data-testid="chevron"
      size={40}
      strokeWidth={2.25}
      className="text-azure-radiance-400"
      aria-hidden
    />
  );
}
