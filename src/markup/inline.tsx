/**
 * `<Inline>` — a AST da marcação virando elementos, com os tokens da §10.2 do design
 * system.
 *
 * O template escreve `<Inline>{content.heading}</Inline>` e **nunca vê a AST**: quem
 * chama passa a string crua do campo e recebe o texto desenhado. É o segundo estágio da
 * §5 do documento de contexto — o parser não sabe que existe DOM, e este módulo é o único
 * lugar do projeto que sabe as duas coisas.
 *
 * Cada marcador sai num elemento HTML de verdade — `<strong>`, `<em>`, `<s>`, `<u>`,
 * `<mark>`, `<code>` — e não em `<span>` com classe. O nó de texto puro não ganha wrapper
 * nenhum. O `[[destaque]]` é a exceção que confirma: como ele é só cor, não existe
 * elemento com esse significado e o `<span>` é o honesto.
 *
 * Os estilos são classes Tailwind, como no `Kicker` e nas outras peças compartilhadas —
 * a §10.2 é uma tabela de tokens, e aqui ela vira uma tabela de classes. A única que não
 * cabe em utilitário pronto é a do `**forte**`; ver `slide-strong` em `globals.css`.
 */

import type { JSX } from "react";
import { parseInline } from "@/markup/parse";
import type { InlineMark } from "@/markup/types";

type Style = { tag: keyof JSX.IntrinsicElements; className: string };

/** A tabela da §10.2, linha por linha. */
const STYLES: Record<InlineMark, Style> = {
  // Peso 600, mas nunca abaixo do peso do bloco em volta — decisão 34.
  strong: { tag: "strong", className: "slide-strong" },
  em: { tag: "em", className: "italic" },
  strike: { tag: "s", className: "line-through text-ink-500" },
  underline: {
    tag: "u",
    className: "underline underline-offset-[0.15em] decoration-2",
  },
  // `box-decoration-break: clone` para o fundo fechar em cada linha quando a marca
  // quebra; sem ele o padding lateral só apareceria nas duas pontas do trecho.
  mark: {
    tag: "mark",
    className:
      "rounded-none bg-sun-950 px-[0.15em] text-sun-300 [box-decoration-break:clone]",
  },
  // `ink-800` é o mesmo valor de `--slide-raised`; a §10.2 nomeia o degrau da rampa, e é
  // o nome dela que fica aqui.
  code: {
    tag: "code",
    className:
      "rounded-[6px] bg-ink-800 px-[0.2em] font-mono text-azure-radiance-200 [box-decoration-break:clone]",
  },
  accent: { tag: "span", className: "text-azure-radiance-400" },
};

export function Inline({ children }: { children: string }) {
  return (
    <>
      {parseInline(children).map((node, position) => {
        if (node.t === "text") return node.v;

        const { tag: Tag, className } = STYLES[node.t];

        // A chave é a posição porque a lista é derivada da string a cada render: não há
        // identidade estável a preservar, e reordenação não existe neste nível.
        return (
          <Tag key={position} className={className}>
            {node.v}
          </Tag>
        );
      })}
    </>
  );
}
