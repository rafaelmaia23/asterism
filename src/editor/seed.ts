/**
 * O deck com que o editor abre, enquanto não há persistência.
 *
 * Seis slides: três `cover-statement`, dois `text-bullets` e um `final-cta`. Com um só, a
 * lista lateral, a troca de slide ativo e o laço de páginas do alvo PDF ficariam sem
 * prova. A 1D moveu este deck para dentro do store sem mexer no módulo, e a 2.12 o troca
 * pelo que estiver salvo — até lá é ele quem decide o que existe na tela.
 *
 * Os defaults vêm do registry, e não copiados à mão: o dia em que um template ganhar um
 * campo, o deck semente o ganha junto. Por isso este módulo mora em `src/editor` e não em
 * `src/deck`, que não conhece a biblioteca de templates — a seta é `templates → deck`.
 *
 * **Por que os dois `text-bullets` têm âncoras diferentes.** Enquanto `addSlide` (2.13) e
 * a troca de layout (2.11) não existirem, a semente é o único lugar que decide quais
 * slides existem. Desde a 2.7 o `anchor` é trocável no inspector, mas nascer com `center`
 * num slide e `top` no outro continua valendo: as duas leituras da §11.2 ficam lado a
 * lado na lista lateral, comparáveis sem trocar opção nenhuma.
 *
 * Os três títulos de capa têm comprimentos deliberadamente diferentes, de uma linha a
 * quatro: é assim que a âncora de base da §11.1 dos templates se confere, vendo a última
 * linha pousar sempre na mesma altura.
 *
 * **Por que a semente termina num `final-cta`.** Mesmo argumento dos dois `text-bullets`
 * da 2B: sem `addSlide` (2.13) e sem troca de layout (2.11), um template que não está na
 * semente não aparece na tela, e o critério de pronto da 2.9 se confere olhando. De
 * quebra, ele é quem põe a constelação inteira acesa e a supressão do chevron por posição
 * — decisão 36 — sob os olhos, no único lugar do deck onde as duas valem.
 */

import { createDeck, createSlide } from "@/deck/factories";
import type { Deck, FieldValue, OptionValue, Slide } from "@/deck/types";
import { get } from "@/templates";

const COVER = "cover-statement";
const BULLETS = "text-bullets";
const FINAL = "final-cta";

/**
 * Cada título traz um `[[destaque]]`, que é a marcação da §7 do documento de contexto
 * chegando pronta na primeira tela: abrir a ferramenta já mostra o que ela faz, sem
 * ninguém precisar digitar nada. O comprimento que a §11.1 dos templates limita é o do
 * texto **renderizado** — 15, 39 e 63 caracteres —, não o da string com os colchetes.
 */
const HEADINGS = [
  "Ninguém [[lê docs]]",
  "O cache [[mentiu]] sobre o que ele guardava",
  "Três semanas de investigação para encontrar um [[bug de uma linha]]",
];

/**
 * Três itens no primeiro, quatro no segundo: o alvo e o teto da §11.2, um em cada slide.
 * A marcação aparece uma vez por slide, e não em todo item — a regra de um nível de
 * ênfase por bloco da §3.4 do design system vale dentro da lista também.
 */
const BULLET_SLIDES: { heading: string; items: string[]; anchor: OptionValue }[] = [
  {
    heading: "O que o log dizia",
    items: [
      "A leitura vinha do cache, e o cache [[nunca expirava]]",
      "O teste passava porque subia com o cache vazio",
      "Ninguém tinha olhado a métrica de acerto desde a estreia",
    ],
    anchor: "center",
  },
  {
    heading: "Três semanas depois",
    items: [
      "Uma linha de `ttl` que nunca tinha sido lida",
      "Duas horas para achar, três semanas para procurar",
      "O relatório saiu maior que a correção",
      "E a métrica de acerto virou alarme",
    ],
    anchor: "top",
  },
];

/**
 * O fechamento fecha a mesma história das capas e dos tópicos, e traz um `[[destaque]]`
 * como elas. O `lead` nasce escrito de propósito: apagá-lo no inspector é como se confere
 * o comportamento que a §11.3 promete — o bloco some junto com o gap.
 */
const FINAL_SLIDE = {
  heading: "Escrevo sobre o que [[quebra]] antes do que funciona",
  lead: "Backend, infra e os três dias que cada bug de uma linha custa.",
  cta: "blog.maiahub.com.br",
};

function withFields(
  template: string,
  fields: Record<string, FieldValue>,
  options: Record<string, OptionValue> = {},
): Slide {
  const slide = createSlide(template, get(template).defaults);

  return {
    ...slide,
    fields: { ...slide.fields, ...fields },
    options: { ...slide.options, ...options },
  };
}

export function createSeedDeck(): Deck {
  const covers = HEADINGS.map((heading, position) =>
    withFields(COVER, { kicker: `log/ · 0${position + 1}`, heading }),
  );

  const bullets = BULLET_SLIDES.map(({ heading, items, anchor }) =>
    withFields(BULLETS, { heading, items }, { anchor }),
  );

  const final = withFields(FINAL, FINAL_SLIDE);

  return {
    ...createDeck({ title: "Carrossel de exemplo" }),
    slides: [...covers, ...bullets, final],
  };
}
