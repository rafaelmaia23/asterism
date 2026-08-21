import { describe, expect, test } from "vitest";
import { createSeedDeck } from "@/editor/seed";
import { withExportStage } from "@/export/stage";
import type { RenderSource } from "@/export/types";
import "@/templates";

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
