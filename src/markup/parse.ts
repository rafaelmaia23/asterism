/**
 * O parser da marcação inline — §7 do documento de contexto.
 *
 * Subset fechado da sintaxe do Obsidian: sete marcadores, **nenhuma construção de bloco**
 * e nenhum aninhamento. Devolve AST, nunca HTML — devolver HTML acoplaria o conteúdo ao
 * DOM e mataria qualquer alvo de exportação que não seja rasterização.
 *
 * Uma varredura só, sem regex e sem pilha. Em cada posição tenta-se abrir um marcador; se
 * abriu e fechou com conteúdo, o nó sai pronto e o cursor salta para depois do fechador;
 * senão o caractere cai no buffer de texto e o cursor anda um. Três regras caem de graça
 * desse desenho, e são as três da §7:
 *
 *   marcador não fechado   vira texto literal, porque a busca pelo fechador falha
 *   conteúdo vazio         `****` é texto, não marcador vazio: `end === from` recusa
 *   sem aninhamento        o `v` de um nó nunca é reparseado, então `**a *b* c**` é
 *                          `strong` com asteriscos literais dentro
 *
 * O buffer só é descarregado na fronteira de um nó, e é isso — e não um passo de
 * pós-processamento — que colapsa nós de texto vizinhos em um só.
 */

import type { Inline, InlineMark } from "@/markup/types";

type Marker = { open: string; close: string; t: InlineMark };

/**
 * A ordem importa em um ponto: `**` é tentado antes de `*`, senão `**forte**` abriria uma
 * ênfase de conteúdo vazio. Os demais não compartilham prefixo entre si.
 *
 * `[[…]]` é o único assimétrico — abre e fecha com pares diferentes.
 */
const MARKERS: Marker[] = [
  { open: "**", close: "**", t: "strong" },
  { open: "~~", close: "~~", t: "strike" },
  { open: "++", close: "++", t: "underline" },
  { open: "==", close: "==", t: "mark" },
  { open: "[[", close: "]]", t: "accent" },
  { open: "*", close: "*", t: "em" },
  { open: "`", close: "`", t: "code" },
];

type Opened = { node: Inline; next: number };

/**
 * O marcador que abre em `i`, se algum abrir e fechar ali. Não há regra de limite de
 * palavra: `micro**serviços**` marca, e é decisão 33 da §16 do documento de contexto.
 */
function openAt(src: string, i: number): Opened | null {
  for (const marker of MARKERS) {
    if (!src.startsWith(marker.open, i)) continue;

    const from = i + marker.open.length;
    const end = src.indexOf(marker.close, from);

    // `end < 0` é marcador não fechado; `end === from` é conteúdo vazio. Nos dois casos
    // o marcador seguinte ainda tem chance — `*` depois de `**`, por exemplo.
    if (end < 0 || end === from) continue;

    return {
      node: { t: marker.t, v: src.slice(from, end) },
      next: end + marker.close.length,
    };
  }

  return null;
}

export function parseInline(src: string): Inline[] {
  const nodes: Inline[] = [];
  let text = "";
  let i = 0;

  function flushText() {
    if (text.length > 0) {
      nodes.push({ t: "text", v: text });
      text = "";
    }
  }

  while (i < src.length) {
    const opened = openAt(src, i);

    if (opened) {
      flushText();
      nodes.push(opened.node);
      i = opened.next;
      continue;
    }

    text += src[i];
    i += 1;
  }

  flushText();

  return nodes;
}
