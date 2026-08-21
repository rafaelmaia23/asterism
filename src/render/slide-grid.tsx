/**
 * A grade de fundo do slide — §4.3 do design system.
 *
 * **Desenhada em SVG, e não como `background-image`.** A grade nasceu como dois
 * `linear-gradient` ladrilhados por `background-size`, e assim ela funcionava no preview e
 * se perdia na exportação: o rasterizador desenha o gradiente uma vez e chapa o resto da
 * página com a primeira parada dele. O experimento 4 do `TODO.md` mediu as quatro
 * alternativas no PDF — gradiente repetente falha igual, `<pattern>` sai com metade da
 * espessura porque o traço na borda do ladrilho é recortado, e linha de verdade em SVG
 * atravessa intacta. Ver a armadilha na §13 do documento de contexto e a decisão 28.
 *
 * O passo sai do formato, não de constante: a grade fecha em módulos inteiros em qualquer
 * proporção, e nenhum 1080 mora aqui — §12.
 */

import type { CSSProperties } from "react";
import type { Deck } from "@/deck/types";

/**
 * O módulo que se busca, em px do slide de 1080. O passo real é o divisor comum mais
 * próximo deste, para que nenhum módulo saia cortado na borda.
 */
export const GRID_TARGET = 54;

/** Até onde o passo real pode se afastar do alvo antes de a textura mudar de caráter. */
const GRID_MIN = 36;
const GRID_MAX = 81;

/**
 * Metade da espessura de spec — `--slide-grid-line-w`, 2px. O traço do SVG é centrado na
 * coordenada, então deslocá-lo meia espessura para dentro é o que faz a linha da borda
 * caber inteira, e é também o que reproduz o gradiente antigo: a linha do múltiplo 54
 * ocupa `[54, 56]`, como ocupava antes.
 */
const HALF = 1;

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * O passo da grade para um formato: o divisor comum de `w` e `h` mais próximo do alvo,
 * dentro da faixa aceitável. Em 1080×1350 dá 54 — 20 por 25 módulos quadrados e inteiros.
 * Formato sem divisor utilizável cai no alvo e aceita o corte na borda, que é melhor que
 * uma grade de 1px.
 */
export function gridStep(w: number, h: number): number {
  const common = gcd(w, h);

  let best = GRID_TARGET;
  let distance = Infinity;

  for (let step = GRID_MIN; step <= GRID_MAX; step++) {
    if (common % step !== 0) continue;

    const away = Math.abs(step - GRID_TARGET);
    if (away < distance) {
      best = step;
      distance = away;
    }
  }

  return best;
}

/**
 * O `d` da grade: uma vertical a cada passo, uma horizontal a cada passo, e as duas de
 * fechamento na direita e na base. Todas deslocadas meia espessura para dentro.
 */
export function gridPath(w: number, h: number, step: number): string {
  const along = (size: number) => {
    const out: number[] = [];
    for (let at = 0; at < size; at += step) out.push(at + HALF);
    out.push(size - HALF);
    return out;
  };

  return [
    ...along(w).map((x) => `M${x} 0V${h}`),
    ...along(h).map((y) => `M0 ${y}H${w}`),
  ].join(" ");
}

/**
 * `slide-grid` é o que declara `--slide-grid-line-render` — a compensação de espessura da
 * §4.3. Ela precisa ser declarada num elemento que já enxergue `--slide-scale`, e este
 * está dentro da raiz do slide, que é quem a declara.
 */
const STROKE: CSSProperties = {
  stroke: "var(--color-slide-grid-line)",
  strokeWidth: "var(--slide-grid-line-render)",
  fill: "none",
};

export type SlideGridProps = {
  format: Deck["format"];
};

export function SlideGrid({ format }: SlideGridProps) {
  const step = gridStep(format.w, format.h);

  return (
    <svg
      data-testid="slide-grid"
      className="slide-grid pointer-events-none absolute inset-0"
      width={format.w}
      height={format.h}
      viewBox={`0 0 ${format.w} ${format.h}`}
      aria-hidden="true"
    >
      <path d={gridPath(format.w, format.h, step)} style={STROKE} />
    </svg>
  );
}
