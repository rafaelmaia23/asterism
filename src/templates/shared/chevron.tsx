import { ChevronsRight } from "lucide-react";

/**
 * Afordância de deslize — §10.5 do design system. Chevron duplo, 40px, traço 2.25,
 * `azure-400`, à direita da constelação com gap de 20px.
 *
 * Disponível em todo template e ligada por opção — decisão 36 —, mas só a capa nasce com
 * ela: a partir do slide 2 a pessoa já executou o gesto, e repetir a seta seria instruir
 * quem já sabe. Quem a suprime no último slide é o `Footer`, por posição.
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
