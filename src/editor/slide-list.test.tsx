import { describe, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { Deck } from "@/deck/types";
import { createEditorStore } from "@/editor/store";
import { SlideList } from "@/editor/slide-list";
import "@/templates";

function makeDeck(): Deck {
  return {
    version: 1,
    id: "d1",
    title: "Deck de teste",
    format: { w: 1080, h: 1350 },
    meta: { handle: "@rafael", pillar: "log" },
    slides: [
      {
        id: "s1",
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
  render(<SlideList store={store} />);
  return store;
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
   * Três capas seguidas mostrariam três vezes o mesmo rótulo. O trecho sai da chave
   * canônica `heading` da §6 do documento de contexto — que existe justamente para que o
   * mesmo papel tenha a mesma chave em todo template —, então a lista continua sem
   * conhecer template nenhum.
   */
  test("o trecho do item vem da chave canônica heading", () => {
    renderList();

    const itens = screen.getAllByRole("button");

    expect(itens[0].textContent).toContain("Ninguém lê docs");
    expect(itens[1].textContent).toContain("O cache mentiu");
  });

  test("slide sem heading não quebra a lista", () => {
    const deck = makeDeck();
    deck.slides[1] = { ...deck.slides[1], fields: { kicker: "log/ · 02" } };

    renderList(deck);

    expect(screen.getAllByRole("button")[1].textContent).toContain("Capa — declaração");
  });

  test("o item ativo se distingue dos outros", () => {
    renderList();

    const itens = screen.getAllByRole("button");

    expect(itens[0].getAttribute("aria-current")).toBe("true");
    expect(itens[1].getAttribute("aria-current")).toBeNull();
  });

  test("clicar num item troca o slide ativo no store", () => {
    const store = renderList();

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
});
