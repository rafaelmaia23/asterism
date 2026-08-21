import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import type { DeckMeta, Slide } from "@/deck/types";
import { SlideCanvas } from "@/editor/slide-canvas";
import "@/templates";

const deck: DeckMeta = { handle: "@rafael", pillar: "log" };

const slide: Slide = {
  id: "s1",
  template: "cover-statement",
  fields: { kicker: "log/ · 01", heading: "Um título" },
  options: { showChevron: true },
};

function renderCanvas() {
  return render(
    <SlideCanvas slide={slide} deck={deck} format={{ w: 1080, h: 1350 }} index={0} total={3} />,
  );
}

/**
 * Teste de estrutura, e é de propósito: é a estrutura que impede o laço de medição.
 *
 * A primeira versão da 1C media uma área que o próprio quadro conseguia esticar, e o
 * resultado foi a escala subir sozinha até o teto de 1 e o slide estourar a tela. O que
 * fecha essa porta é o quadro estar fora do fluxo — conteúdo posicionado em absoluto não
 * contribui para o tamanho do pai, então o elemento observado não pode mais ser
 * dimensionado pelo que ele contém.
 *
 * `happy-dom` não faz layout e o `ResizeObserver` dele nunca dispara, então a escala fica
 * em 0 e nenhum quadro é desenhado aqui. O que dá para garantir é o arranjo.
 */
describe("SlideCanvas", () => {
  test("a área medida não rola e é a referência de posicionamento", () => {
    renderCanvas();

    const area = screen.getByTestId("slide-canvas-area");

    expect(area.className).toContain("relative");
    expect(area.className).toContain("overflow-hidden");
  });

  test("o palco que carrega o quadro está fora do fluxo — é o que mata o laço", () => {
    renderCanvas();

    const stage = screen.getByTestId("slide-canvas-stage");

    expect(stage.className).toContain("absolute");
    expect(stage.className).toContain("inset-0");
  });

  test("o palco é filho da área medida, e o quadro nasce dentro dele", () => {
    renderCanvas();

    const area = screen.getByTestId("slide-canvas-area");

    expect(area.contains(screen.getByTestId("slide-canvas-stage"))).toBe(true);
  });

  test("sem medida ainda, nenhum quadro é desenhado", () => {
    renderCanvas();

    // Escala 0 desenharia `calc(1px / 0)` na compensação do grid.
    expect(screen.queryByTestId("slide-frame")).toBeNull();
  });
});
