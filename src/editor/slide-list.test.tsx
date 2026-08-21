import { describe, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Deck } from "@/deck/types";
import { createEditorStore } from "@/editor/store";
import { SlideList, THUMBNAIL_WIDTH } from "@/editor/slide-list";
import "@/templates";

const SLIDE_ID = "id-que-nao-pode-vazar";

function makeDeck(): Deck {
  return {
    version: 1,
    id: "d1",
    title: "Deck de teste",
    format: { w: 1080, h: 1350 },
    meta: { handle: "@rafael", pillar: "log" },
    slides: [
      {
        id: SLIDE_ID,
        template: "cover-statement",
        fields: { kicker: "log/ · 01", heading: "Ninguém lê docs" },
        options: { showChevron: true },
      },
      {
        id: "s2",
        template: "cover-statement",
        fields: { kicker: "log/ · 02", heading: "O cache mentiu" },
        options: { showChevron: true },
      },
    ],
    assets: {},
  };
}

function renderList(deck: Deck = makeDeck()) {
  const store = createEditorStore(deck);
  const { container } = render(<SlideList store={store} />);
  return { store, container };
}

describe("SlideList", () => {
  test("um item por slide, com índice e rótulo do template", () => {
    renderList();

    const itens = screen.getAllByRole("button");

    expect(itens).toHaveLength(2);
    expect(itens[0].textContent).toContain("01");
    expect(itens[0].textContent).toContain("Capa — declaração");
    expect(itens[1].textContent).toContain("02");
  });

  /**
   * A miniatura é o mesmo `SlideView` do canvas, só que numa escala fixa. É o que
   * distingue três capas seguidas, que de outro modo mostrariam três vezes o mesmo
   * rótulo — e é de graça, porque o `SlideFrame` já sabe desenhar em qualquer escala.
   */
  test("cada item carrega uma miniatura do próprio slide", () => {
    renderList();

    const quadros = screen.getAllByTestId("slide-frame");

    expect(quadros).toHaveLength(2);
    expect(quadros[0].style.width).toBe(`${THUMBNAIL_WIDTH}px`);
  });

  /**
   * A escala sai de `deck.format`, nunca de 1080 escrito à mão — §12 do documento de
   * contexto. Num formato 1:1 a miniatura continua com a largura pedida.
   */
  test("a escala da miniatura sai do formato do deck", () => {
    const deck = makeDeck();
    deck.format = { w: 2160, h: 2700 };

    renderList(deck);

    expect(screen.getAllByTestId("slide-frame")[0].style.width).toBe(`${THUMBNAIL_WIDTH}px`);
  });

  test("o item ativo se distingue dos outros", () => {
    renderList();

    const itens = screen.getAllByRole("button");

    expect(itens[0].getAttribute("aria-current")).toBe("true");
    expect(itens[1].getAttribute("aria-current")).toBeNull();
  });

  test("clicar num item troca o slide ativo no store", () => {
    const { store } = renderList();

    fireEvent.click(screen.getAllByRole("button")[1]);

    expect(store.getState().activeId).toBe("s2");
    expect(screen.getAllByRole("button")[1].getAttribute("aria-current")).toBe("true");
  });

  /** Somente leitura nesta etapa: nada de arraste, duplicar ou remover. */
  test("o item não oferece nenhuma ação além de selecionar", () => {
    renderList();

    const item = screen.getAllByRole("button")[0];

    expect(item.querySelector("button")).toBeNull();
    expect(item.getAttribute("draggable")).toBeNull();
  });

  /** A armadilha da §13: id de dado não vira atributo do DOM. */
  test("nenhum id de dado chega ao DOM", () => {
    const { container } = renderList();

    expect(container.innerHTML).not.toContain(SLIDE_ID);
  });
});
