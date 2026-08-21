import { describe, expect, test } from "vitest";
import type { Deck } from "@/deck/types";
import { createEditorStore, selectActiveIndex } from "@/editor/store";

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
        fields: { kicker: "log/ · 01", heading: "Primeiro" },
        options: { showChevron: true },
      },
      {
        id: "s2",
        template: "cover-statement",
        fields: { kicker: "log/ · 02", heading: "Segundo" },
        options: { showChevron: true },
      },
    ],
    assets: {},
  };
}

describe("store do editor", () => {
  test("abre com o deck recebido e o primeiro slide ativo", () => {
    const store = createEditorStore(makeDeck());

    expect(store.getState().deck.title).toBe("Deck de teste");
    expect(store.getState().activeId).toBe("s1");
  });

  test("setField troca o valor e preserva os outros campos do slide", () => {
    const store = createEditorStore(makeDeck());

    store.getState().setField("s1", "heading", "Outro título");

    const slide = store.getState().deck.slides[0];
    expect(slide.fields.heading).toBe("Outro título");
    expect(slide.fields.kicker).toBe("log/ · 01");
    expect(slide.options.showChevron).toBe(true);
  });

  test("setField não toca nos outros slides — nem no conteúdo, nem na identidade", () => {
    const deck = makeDeck();
    const store = createEditorStore(deck);
    const antes = store.getState().deck.slides[1];

    store.getState().setField("s1", "heading", "Outro título");

    // Identidade referencial preservada: quem não mudou não re-renderiza.
    expect(store.getState().deck.slides[1]).toBe(antes);
  });

  test("setField não muta o deck que entrou", () => {
    const deck = makeDeck();
    const store = createEditorStore(deck);

    store.getState().setField("s1", "heading", "Outro título");

    expect(deck.slides[0].fields.heading).toBe("Primeiro");
  });

  test("setOption troca a opção e preserva os campos", () => {
    const store = createEditorStore(makeDeck());

    store.getState().setOption("s2", "showChevron", false);

    const slide = store.getState().deck.slides[1];
    expect(slide.options.showChevron).toBe(false);
    expect(slide.fields.heading).toBe("Segundo");
  });

  test("selectSlide troca o slide ativo", () => {
    const store = createEditorStore(makeDeck());

    store.getState().selectSlide("s2");

    expect(store.getState().activeId).toBe("s2");
  });

  test("selectActiveIndex devolve a posição do slide ativo", () => {
    const store = createEditorStore(makeDeck());

    expect(selectActiveIndex(store.getState())).toBe(0);

    store.getState().selectSlide("s2");

    expect(selectActiveIndex(store.getState())).toBe(1);
  });

  /**
   * Id que não está no deck é erro de programação, como o template desconhecido do
   * registry: nenhuma tela oferece um slide que o deck não tem. Falhar em silêncio
   * esconderia a causa longe do ponto onde ela nasceu.
   */
  test("id desconhecido lança nas três ações", () => {
    const store = createEditorStore(makeDeck());

    expect(() => store.getState().selectSlide("nada")).toThrow(/nada/);
    expect(() => store.getState().setField("nada", "heading", "x")).toThrow(/nada/);
    expect(() => store.getState().setOption("nada", "showChevron", false)).toThrow(/nada/);
  });
});
