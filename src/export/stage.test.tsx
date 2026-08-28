import { afterEach, describe, expect, test } from "vitest";
import { createSeedDeck } from "@/editor/seed";
import { collectImageIds, withExportStage } from "@/export/stage";
import type { Deck } from "@/deck/types";
import type { RenderSource } from "@/export/types";
import { clearImageCache, importImage, peekImageUrl } from "@/images/cache";
import { createSlide } from "@/deck/factories";
import { get } from "@/templates";
import { stubImages, type StubbedImages } from "@/test/images";
import "@/templates";

let images: StubbedImages;

afterEach(() => {
  images?.restore();
});

/** Um deck de um slide de mídia, com a imagem já guardada e o id no campo. */
async function deckComImagem(): Promise<{ deck: Deck; id: string }> {
  images = stubImages();
  const id = await importImage(new Blob(["foto"], { type: "image/png" }));
  const def = get("split-vertical");
  const slide = createSlide(def.id, def.defaults);
  slide.fields.image = id;

  // Esvazia o cache de propósito: no caminho real o deck volta do `localStorage` com o id e
  // nada mais, e quem tem de ir ao banco é o palco. Com a URL já quente, o teste passaria
  // sem que o pré-carregamento existisse.
  clearImageCache();

  return { deck: { ...createSeedDeck(), slides: [slide] }, id };
}

/**
 * O palco monta e desmonta React de verdade, e isso `happy-dom` faz. O que ele não faz é
 * layout: aqui não dá para provar que o slide saiu a 1080×1350 nem que ficou fora da
 * tela — isso se confere olhando, e sobretudo no PDF, que é onde uma escala errada
 * apareceria na hora.
 *
 * O que se prova é o contrato: um source por slide, na ordem do deck, cada nó sendo a
 * raiz capturável daquele slide, e o palco saindo do documento sempre.
 */
describe("withExportStage", () => {
  test("entrega um source por slide, na ordem do deck", async () => {
    const deck = createSeedDeck();

    const sources = await withExportStage(deck, async (sources) => sources.slice());

    expect(sources.map((source: RenderSource) => source.slide)).toEqual(deck.slides);
  });

  test("o nó de cada source é a raiz do slide, não o quadro externo", async () => {
    const deck = createSeedDeck();

    await withExportStage(deck, async (sources) => {
      for (const source of sources) {
        expect(source.node.classList.contains("slide-canvas")).toBe(true);
      }
    });
  });

  test("os nós estão montados no documento enquanto o uso acontece", async () => {
    const deck = createSeedDeck();

    await withExportStage(deck, async (sources) => {
      expect(document.body.contains(sources[0].node)).toBe(true);
    });
  });

  test("o palco sai do documento depois do uso", async () => {
    const deck = createSeedDeck();
    let node: HTMLElement | undefined;

    await withExportStage(deck, async (sources) => {
      node = sources[0].node;
    });

    expect(node && document.body.contains(node)).toBe(false);
  });

  test("o palco sai do documento também quando o uso falha", async () => {
    const deck = createSeedDeck();
    let node: HTMLElement | undefined;

    await expect(
      withExportStage(deck, async (sources) => {
        node = sources[0].node;
        throw new Error("alvo quebrou");
      }),
    ).rejects.toThrow("alvo quebrou");

    expect(node && document.body.contains(node)).toBe(false);
  });

  test("devolve o que o uso devolveu", async () => {
    const deck = createSeedDeck();

    const quantos = await withExportStage(deck, async (sources) => sources.length);

    expect(quantos).toBe(deck.slides.length);
  });
});

/**
 * As imagens no palco — 3F.
 *
 * A armadilha é a mesma das fontes, e da mesma família: **a rasterização não busca recurso
 * de outra origem**. Um `<img>` cujo `src` chega no quadro seguinte à montagem não está no
 * bitmap, e o slide sai com a superfície vazia — sem erro, sem aviso, só um PDF errado. Por
 * isso o palco pré-carrega as imagens do deck antes de montar e espera o `decode()` de cada
 * uma antes de entregar, ao lado do `document.fonts.ready` que já esperava.
 */
describe("as imagens do palco", () => {
  /**
   * As chaves saem dos **descritores**, e não de um `"image"` escrito à mão: o palco não
   * conhece template nenhum, e o campo de imagem do template que a Etapa 4 acrescentar entra
   * nesta lista sozinho.
   */
  test("os ids saem dos descritores, e o campo vazio não entra", async () => {
    const { deck, id } = await deckComImagem();

    expect(collectImageIds(deck)).toEqual([id]);
    expect(collectImageIds(createSeedDeck())).toEqual([]);
  });

  test("o `img` do slide já está resolvido quando o alvo recebe o source", async () => {
    const { deck, id } = await deckComImagem();

    expect(peekImageUrl(id)).toBeUndefined();

    await withExportStage(deck, async (sources) => {
      const img = sources[0].node.querySelector("img");

      expect(img).not.toBeNull();
      expect(img?.getAttribute("src")).toMatch(/^blob:/);
    });
  });

  /** Id órfão não trava a exportação: o slide sai com a superfície, que é o estado dele. */
  test("id órfão não impede a captura", async () => {
    images = stubImages();
    const def = get("split-vertical");
    const slide = createSlide(def.id, def.defaults);
    slide.fields.image = "id-sem-blob";
    const deck = { ...createSeedDeck(), slides: [slide] };

    await withExportStage(deck, async (sources) => {
      expect(sources[0].node.querySelector("img")).toBeNull();
      expect(sources[0].node.textContent).toContain("Sem imagem");
    });
  });
});
