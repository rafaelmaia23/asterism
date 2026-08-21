/**
 * O deck com que o editor abre, enquanto não há persistência.
 *
 * Três slides `cover-statement`: com um só, a lista lateral, a troca de slide ativo e o
 * laço de páginas do alvo PDF ficariam sem prova até a Etapa 2 — e é ali que os erros de
 * exportador aparecem. A 1D move este deck para dentro do store sem mexer no módulo.
 *
 * Os defaults vêm do registry, e não copiados à mão: o dia em que a capa ganhar um campo,
 * o deck semente o ganha junto. Por isso este módulo mora em `src/editor` e não em
 * `src/deck`, que não conhece a biblioteca de templates — a seta é `templates → deck`.
 *
 * Os três títulos têm comprimentos deliberadamente diferentes, de uma linha a quatro: é
 * assim que a âncora de base da §11.1 dos templates se confere olhando, alternando o
 * slide ativo e vendo a última linha pousar sempre na mesma altura.
 */

import { createDeck, createSlide } from "@/deck/factories";
import type { Deck } from "@/deck/types";
import { get } from "@/templates";

const COVER = "cover-statement";

const HEADINGS = [
  "Ninguém lê docs",
  "O cache mentiu sobre o que ele guardava",
  "Três semanas de investigação para encontrar um bug de uma linha",
];

export function createSeedDeck(): Deck {
  const { defaults } = get(COVER);

  const slides = HEADINGS.map((heading, position) => {
    const slide = createSlide(COVER, defaults);

    return {
      ...slide,
      fields: {
        ...slide.fields,
        kicker: `log/ · 0${position + 1}`,
        heading,
      },
    };
  });

  return { ...createDeck({ title: "Carrossel de exemplo" }), slides };
}
