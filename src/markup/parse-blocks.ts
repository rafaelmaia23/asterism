/**
 * O parser de blocos — §2 de `docs/model.md`.
 *
 * A camada que a Etapa 3½ existe para criar: um `\n` dentro de um `<p>` é espaço por regra
 * do HTML, e sem ela um enter no inspector não chegava ao slide. ADR-0060.
 *
 * Uma varredura linha a linha, sem recursão: cada linha é classificada e ou continua o
 * bloco aberto, ou fecha o que estava e abre outro. Quatro fronteiras caem desse desenho, e
 * são as quatro da §2:
 *
 *   linha em branco     fecha o bloco aberto, qualquer que seja ele
 *   marcador diferente  `- ` depois de `1. ` é lista nova, não item da mesma
 *   linha sem marcador  fecha a lista e abre parágrafo — não vira item
 *   linha com marcador  fecha o parágrafo e abre a lista, mesmo sem linha em branco antes
 *
 * O conteúdo sai **cru**: quem transforma `**forte**` em texto desenhado é o `<Inline>`,
 * um por bloco. É o que mantém `parseInline` sendo função pura sem dependências e este
 * módulo testável sozinho.
 */

import type { Block } from "@/markup/types";

/** O `t` de um bloco de lista — os dois que têm `items`. */
type ListKind = "ul" | "ol";

/**
 * `- item`, e nada mais: `-item` sem espaço é texto.
 *
 * O `$` cobre a linha que é só o marcador: `- ` aparada vira `-`, e ela é item vazio
 * dessa lista — não parágrafo, que partiria a lista em duas.
 */
const UNORDERED = /^-(\s+|$)/;

/**
 * `1. item`. O número é marcador, não conteúdo, e sai fora — a numeração desenhada é
 * sequencial a partir de 1. ADR-0076.
 */
const ORDERED = /^\d+\.(\s+|$)/;

type Line = { kind: ListKind; v: string } | { kind: "p"; v: string };

function classify(line: string): Line {
  if (UNORDERED.test(line)) return { kind: "ul", v: line.replace(UNORDERED, "") };
  if (ORDERED.test(line)) return { kind: "ol", v: line.replace(ORDERED, "") };

  return { kind: "p", v: line };
}

/** O bloco em construção: parágrafo acumulando linhas, ou lista acumulando itens. */
type Open = { kind: "p"; lines: string[] } | { kind: ListKind; items: string[] };

export function parseBlocks(src: string): Block[] {
  const blocks: Block[] = [];

  /**
   * Fecha o bloco aberto. Recebe por parâmetro, e não pela variável de fora, porque
   * fechar sobre `open` faria o TypeScript perder a narrowing dele a cada chamada.
   */
  function close(open: Open | null): void {
    if (open === null) return;

    if (open.kind === "p") {
      blocks.push({ t: "p", v: open.lines.join(" ") });
    } else if (open.items.length > 0) {
      // Lista sem nenhum item não existe: `- ` sozinho não desenha marcador nenhum.
      blocks.push({ t: open.kind, items: open.items });
    }
  }

  let open: Open | null = null;

  for (const raw of src.split("\n")) {
    // A linha é aparada antes de ser classificada: não há lista aninhada nesta camada,
    // então `  - sub` é item normal, e não um nível a mais.
    const line = raw.trim();

    if (line.length === 0) {
      close(open);
      open = null;
      continue;
    }

    const { kind, v } = classify(line);

    if (open === null || open.kind !== kind) {
      close(open);
      open = kind === "p" ? { kind, lines: [] } : { kind, items: [] };
    }

    if (open.kind === "p") {
      open.lines.push(v);
    } else if (v.length > 0) {
      // Item vazio é descartado: `- ` sozinho não vira marcador sem texto.
      open.items.push(v);
    }
  }

  close(open);

  return blocks;
}
