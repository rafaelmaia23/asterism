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
 * - **As imagens do deck carregadas antes, e decodificadas depois.** É a mesma armadilha das
 *   fontes, da mesma família: a rasterização não busca recurso de outra origem, e um `<img>`
 *   cujo `src` chega no quadro seguinte à montagem não está no bitmap. O palco enche o cache
 *   antes de montar — senão o template desenha "Sem imagem", que é o estado honesto de quem
 *   ainda não tem URL — e espera o `decode()` de cada `<img>` antes de entregar.
 * - **Nenhum id de slide vira atributo.** Os nós saem de um array de refs por posição,
 *   não de `data-slide-id` — §13.
 *
 * A função é imperativa porque o fluxo é one-shot e nasce de um clique: montar, usar,
 * desmontar. Um componente declarativo espalharia isso por estado e efeito do shell sem
 * ganhar nada.
 */

import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import type { Deck, ImageId } from "@/deck/types";
import type { RenderSource } from "@/export/types";
import { preloadImages } from "@/images/cache";
import { SlideView } from "@/render/slide-view";
import { get } from "@/templates/registry";

/** Longe o bastante para não aparecer em nenhuma viewport, e ainda assim com layout. */
const OFFSCREEN = "-100000px";

/**
 * Os `ImageId` que o deck usa, na ordem em que aparecem.
 *
 * As chaves saem dos **descritores**, e nunca de um `"image"` escrito à mão: o palco não
 * conhece template nenhum, e é o registry quem sabe quais campos são imagem. É o mesmo
 * argumento que põe o `SlideView` no meio do caminho em vez de um `switch` — §5 do documento
 * de contexto. O campo vazio não entra: é o slide sem imagem, que não tem o que carregar.
 *
 * Mora aqui, e não em `src/images`, por causa da seta: `src/images` é folha e não pode
 * importar o registry, senão o `ImageBand` dos templates fecharia um ciclo.
 */
export function collectImageIds(deck: Deck): ImageId[] {
  const ids: ImageId[] = [];

  for (const slide of deck.slides) {
    for (const field of get(slide.template).fields) {
      if (field.type !== "image") {
        continue;
      }

      const value = slide.fields[field.key];

      if (typeof value === "string" && value !== "" && !ids.includes(value)) {
        ids.push(value);
      }
    }
  }

  return ids;
}

/**
 * Espera cada `<img>` do palco estar decodificado.
 *
 * `decode()` resolve quando o bitmap está pronto para pintar, que é o que a captura precisa
 * — `complete` mentiria num `blob:` recém-atribuído. Uma imagem que falha em decodificar
 * **não derruba a exportação**: o slide sai com o que houver, que é o mesmo critério da
 * decisão 31, e é bem melhor que um PDF que não sai.
 */
async function decodeImages(container: HTMLElement): Promise<void> {
  const images = [...container.querySelectorAll("img")];

  await Promise.all(images.map((image) => image.decode().catch(() => undefined)));
}

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
    // Antes de montar: um `<img>` sem URL no primeiro quadro desenha o estado "Sem imagem",
    // e é esse estado que iria para o bitmap.
    await preloadImages(collectImageIds(deck));

    const nodes = await new Promise<(HTMLDivElement | null)[]>((resolve) => {
      root.render(<Stage deck={deck} onReady={resolve} />);
    });

    // `document.fonts` não existe em todo ambiente de teste; no navegador existe sempre,
    // e é ele quem diz que as três famílias já estão desenháveis.
    await document.fonts?.ready;
    await decodeImages(container);

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
