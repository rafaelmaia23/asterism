"use client";

/**
 * O palco de exportação — decisão 20 da §16 do documento de contexto.
 *
 * O exportador precisa do **deck inteiro**, e o canvas do editor tem só o slide ativo,
 * exibido numa escala qualquer. Capturar o nó do preview arrastaria a compensação de
 * `--slide-scale` para dentro do arquivo, que é exatamente o que a §9 proíbe. Então o
 * deck é montado outra vez, fora da tela, a `k = 1`, e é dali que os nós saem.
 *
 * Três cuidados, e cada um vem de uma armadilha já paga:
 *
 * - **Fora de fluxo, não escondido.** `position: fixed` e um deslocamento grande em vez
 *   de `display: none` ou `visibility: hidden`: sem caixa não há layout, e sem layout não
 *   há o que capturar. Fixo e fora do fluxo, o palco não contribui para o tamanho de
 *   nenhum ancestral — a segunda condição da §13, a que fecha a porta do laço de medida.
 * - **`document.fonts.ready` antes de entregar.** As três famílias carregam com `swap`;
 *   capturar antes de o navegador tê-las prontas produz um bitmap em fallback, e o
 *   sintoma no PDF é o título em Arial.
 * - **Nenhum id de slide vira atributo.** Os nós saem de um array de refs por posição,
 *   não de `data-slide-id` — §13.
 *
 * A função é imperativa porque o fluxo é one-shot e nasce de um clique: montar, usar,
 * desmontar. Um componente declarativo espalharia isso por estado e efeito do shell sem
 * ganhar nada.
 */

import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import type { Deck } from "@/deck/types";
import type { RenderSource } from "@/export/types";
import { SlideView } from "@/render/slide-view";

/** Longe o bastante para não aparecer em nenhuma viewport, e ainda assim com layout. */
const OFFSCREEN = "-100000px";

type StageProps = {
  deck: Deck;
  onReady: (nodes: (HTMLDivElement | null)[]) => void;
};

function Stage({ deck, onReady }: StageProps) {
  const nodes: (HTMLDivElement | null)[] = deck.slides.map(() => null);

  // O efeito roda depois do commit, então as refs já apontam para os nós reais.
  useEffect(() => {
    onReady(nodes);
    // Uma montagem só: o palco nasce, entrega e morre.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {deck.slides.map((slide, position) => (
        <SlideView
          key={slide.id}
          slide={slide}
          deck={deck.meta}
          format={deck.format}
          index={position}
          total={deck.slides.length}
          // Sem `scale`: o default do `SlideFrame` é 1, que é o tamanho de spec.
          canvasRef={(node) => {
            nodes[position] = node;
          }}
        />
      ))}
    </>
  );
}

/**
 * Monta o deck fora da tela, entrega um `RenderSource` por slide a `run`, e desmonta —
 * inclusive quando `run` falha. O valor de `run` é o valor da chamada.
 *
 * O parâmetro não se chama `use` porque o eslint leria o nome como o hook homônimo do
 * React e reprovaria a chamada dentro do `try`.
 */
export async function withExportStage<T>(
  deck: Deck,
  run: (sources: RenderSource[]) => Promise<T>,
): Promise<T> {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = OFFSCREEN;
  container.style.top = "0";
  container.setAttribute("aria-hidden", "true");
  document.body.append(container);

  const root = createRoot(container);

  try {
    const nodes = await new Promise<(HTMLDivElement | null)[]>((resolve) => {
      root.render(<Stage deck={deck} onReady={resolve} />);
    });

    // `document.fonts` não existe em todo ambiente de teste; no navegador existe sempre,
    // e é ele quem diz que as três famílias já estão desenháveis.
    await document.fonts?.ready;

    const sources = nodes.map((node, position) => {
      if (!node) {
        throw new Error(`Slide sem nó no palco de exportação: posição ${position}`);
      }
      return { slide: deck.slides[position], node };
    });

    return await run(sources);
  } finally {
    root.unmount();
    container.remove();
  }
}
