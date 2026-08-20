import type { SVGProps } from "react";

export interface MaiahubLogoProps extends SVGProps<SVGSVGElement> {
  /**
   * Deixa a estrela herdar `currentColor` junto com o resto do desenho.
   * Use em impressão, gravação a laser, ou sobre fundos onde o azul não tem contraste.
   */
  mono?: boolean;
}

/** [cx, cy, r] — vértices neutros das letras do wordmark. */
export type Node = readonly [number, number, number];

/**
 * Grid base: altura de caixa alta = 54, largura de letra = 36 (I = 8), espaço = 16.
 * Mantenha esses valores para desenhar letras novas (submarcas de projetos).
 */
export const WORDMARK_STROKES = [
  "M6 60 L6 6 L24 33 L42 6 L42 60",
  "M58 60 L76 6 L94 60",
  "M67 33 L85 33",
  "M114 6 L114 60",
  "M134 60 L152 6 L170 60",
  "M143 33 L161 33",
  "M186 6 L186 60",
  "M222 6 L222 60",
  "M186 33 L222 33",
  "M238 6 L238 46 L256 60 L274 46 L274 6",
  "M290 6 L290 60",
  "M290 6 L314 6 L324 19 L314 33 L290 33",
  "M290 33 L314 33 L326 46 L314 60 L290 60",
] as const;

export const WORDMARK_NODES: readonly Node[] = [
  [6, 60, 2.6], [6, 6, 2.6], [24, 33, 2.2], [42, 60, 2.6],
  [58, 60, 2.6], [76, 6, 2.6], [94, 60, 2.6], [67, 33, 1.8], [85, 33, 1.8],
  [114, 6, 2.6], [114, 60, 2.6],
  [134, 60, 2.6], [152, 6, 2.6], [170, 60, 2.6], [143, 33, 1.8], [161, 33, 1.8],
  [186, 6, 2.6], [186, 60, 2.6], [222, 6, 2.6], [222, 60, 2.6], [186, 33, 1.8], [222, 33, 1.8],
  [238, 6, 2.6], [238, 46, 2.2], [256, 60, 2.6], [274, 46, 2.2], [274, 6, 2.6],
  [290, 6, 2.6], [314, 6, 2.2], [324, 19, 2.2], [314, 33, 2.2], [290, 33, 2.2],
  [326, 46, 2.2], [314, 60, 2.2], [290, 60, 2.6],
] as const;
