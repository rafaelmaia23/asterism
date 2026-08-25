import { describe, expect, test } from "vitest";
import type { Deck } from "@/deck/types";
import { createEditorStore, selectActiveIndex } from "@/editor/store";
import { get } from "@/templates";

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
  test("id desconhecido lança em toda ação que recebe um", () => {
    const store = createEditorStore(makeDeck());

    expect(() => store.getState().selectSlide("nada")).toThrow(/nada/);
    expect(() => store.getState().setField("nada", "heading", "x")).toThrow(/nada/);
    expect(() => store.getState().setOption("nada", "showChevron", false)).toThrow(/nada/);
    expect(() => store.getState().setTemplate("nada", "text-bullets")).toThrow(/nada/);
    expect(() => store.getState().removeSlide("nada")).toThrow(/nada/);
  });

  /**
   * `addSlide` e `removeSlide` — decisão 30 da §16, antecipados da Etapa 4. Sem eles o
   * "pronto quando" da Etapa 2 é inalcançável: o store da 1D não tinha como acrescentar
   * um slide sequer, e o critério pede um carrossel de 8 a 12.
   */
  describe("addSlide", () => {
    test("acrescenta no fim e torna o novo slide ativo", () => {
      const store = createEditorStore(makeDeck());

      store.getState().addSlide();

      const slides = store.getState().deck.slides;
      expect(slides).toHaveLength(3);
      expect(store.getState().activeId).toBe(slides[2].id);
    });

    test("o slide novo nasce `text-bullets`, com os defaults do descritor", () => {
      const store = createEditorStore(makeDeck());

      store.getState().addSlide();

      const novo = store.getState().deck.slides[2];
      expect(novo.template).toBe("text-bullets");
      expect(novo.fields).toEqual(get("text-bullets").defaults.fields);
      expect(novo.options).toEqual(get("text-bullets").defaults.options);
    });

    test("dois slides novos não compartilham o array do campo `list`", () => {
      const store = createEditorStore(makeDeck());

      store.getState().addSlide();
      store.getState().addSlide();

      const [, , terceiro, quarto] = store.getState().deck.slides;
      expect(terceiro.fields.items).not.toBe(quarto.fields.items);
    });
  });

  describe("removeSlide", () => {
    test("tira o slide do deck", () => {
      const store = createEditorStore(makeDeck());

      store.getState().removeSlide("s2");

      expect(store.getState().deck.slides.map((slide) => slide.id)).toEqual(["s1"]);
    });

    test("removendo o ativo, o vizinho seguinte assume", () => {
      const store = createEditorStore(makeDeck());

      store.getState().removeSlide("s1");

      expect(store.getState().activeId).toBe("s2");
    });

    test("removendo o último, o anterior assume", () => {
      const store = createEditorStore(makeDeck());
      store.getState().selectSlide("s2");

      store.getState().removeSlide("s2");

      expect(store.getState().activeId).toBe("s1");
    });

    test("removendo um slide que não é o ativo, o ativo não muda", () => {
      const store = createEditorStore(makeDeck());

      store.getState().removeSlide("s2");

      expect(store.getState().activeId).toBe("s1");
    });

    /**
     * O deck nunca fica sem slides — §11. Deck vazio pediria um estado vazio, que é da
     * Etapa 5; e o controle da lista lateral já fica desabilitado, então isto é a última
     * linha de defesa, não a primeira.
     */
    test("com um slide só, remover é recusado", () => {
      const store = createEditorStore(makeDeck());
      store.getState().removeSlide("s2");
      const antes = store.getState().deck;

      store.getState().removeSlide("s1");

      expect(store.getState().deck).toBe(antes);
      expect(store.getState().activeId).toBe("s1");
    });
  });

  /**
   * A troca de layout — 2.11. O que ela preserva é `fields`, pela interseção de chaves
   * que o vocabulário único da §6 garante; o que ela reseta é `options`, sempre, pelos
   * defaults do template novo (decisão 5).
   */
  describe("setTemplate", () => {
    test("troca o template e migra o conteúdo pelas chaves compartilhadas", () => {
      const store = createEditorStore(makeDeck());

      store.getState().setTemplate("s1", "text-bullets");

      const slide = store.getState().deck.slides[0];
      expect(slide.template).toBe("text-bullets");
      expect(slide.fields.heading).toBe("Primeiro");
      expect("kicker" in slide.fields).toBe(false);
      expect(slide.fields.items).toEqual(get("text-bullets").defaults.fields.items);
    });

    test("as opções resetam para os defaults do template novo", () => {
      const store = createEditorStore(makeDeck());

      store.getState().setTemplate("s1", "text-bullets");

      expect(store.getState().deck.slides[0].options).toEqual(
        get("text-bullets").defaults.options,
      );
    });

    test("as opções resetadas não compartilham referência com o descritor", () => {
      const store = createEditorStore(makeDeck());

      store.getState().setTemplate("s1", "text-bullets");

      expect(store.getState().deck.slides[0].options).not.toBe(
        get("text-bullets").defaults.options,
      );
    });

    /**
     * Escolher no select o template que o slide já tem não pode custar as opções que a
     * pessoa ajustou. Preservar a referência do slide é também o que mantém o `memo` da
     * lista lateral valendo.
     */
    test("trocar pelo template que já está não mexe em nada", () => {
      const store = createEditorStore(makeDeck());
      const antes = store.getState().deck.slides[0];

      store.getState().setTemplate("s1", "cover-statement");

      expect(store.getState().deck.slides[0]).toBe(antes);
    });

    test("não toca nos outros slides", () => {
      const store = createEditorStore(makeDeck());
      const antes = store.getState().deck.slides[1];

      store.getState().setTemplate("s1", "text-bullets");

      expect(store.getState().deck.slides[1]).toBe(antes);
    });

    test("template desconhecido lança, como no registry", () => {
      const store = createEditorStore(makeDeck());

      expect(() => store.getState().setTemplate("s1", "não-existe")).toThrow(/não-existe/);
    });
  });
});
