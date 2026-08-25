import { describe, expect, test } from "vitest";
import { createSeedDeck } from "@/editor/seed";
import { parseInline } from "@/markup/parse";
import { get } from "@/templates";

describe("createSeedDeck", () => {
  test("nasce com três capas, dois text-bullets e um fechamento, nessa ordem", () => {
    const deck = createSeedDeck();

    expect(deck.slides.map((slide) => slide.template)).toEqual([
      "cover-statement",
      "cover-statement",
      "cover-statement",
      "text-bullets",
      "text-bullets",
      "final-cta",
    ]);
  });

  /**
   * O fechamento é o último por definição, e é a posição que faz a constelação sair
   * inteira acesa e o chevron ser suprimido — decisão 36. Sem ele no fim, os dois
   * comportamentos da 2.9 não teriam onde ser conferidos olhando.
   */
  test("o fechamento é o último slide do deck", () => {
    expect(createSeedDeck().slides.at(-1)?.template).toBe("final-cta");
  });

  /** Os limites da §11.3 são conselho, mas a semente não tem por que estourá-los. */
  test("o fechamento cabe nos limites da §11.3", () => {
    const final = createSeedDeck().slides.at(-1)!;
    const rendered = parseInline(String(final.fields.heading))
      .map((node) => node.v)
      .join("");

    expect(rendered.length).toBeLessThanOrEqual(55);
    expect(String(final.fields.lead).length).toBeLessThanOrEqual(90);
    expect(String(final.fields.cta).length).toBeLessThanOrEqual(40);
  });

  test("as opções vêm dos defaults do registry, não de cópia à mão", () => {
    for (const slide of createSeedDeck().slides) {
      const { defaults } = get(slide.template);

      // O `anchor` do segundo `text-bullets` é o único desvio, e é deliberado — ver o
      // teste abaixo. Tudo o mais tem de bater com o que o template diz, chave por chave:
      // o dia em que um template ganhar opção, a semente a ganha junto.
      expect(Object.keys(slide.options)).toEqual(Object.keys(defaults.options));

      for (const [key, value] of Object.entries(defaults.options)) {
        if (key !== "anchor") {
          expect(slide.options[key]).toEqual(value);
        }
      }
    }
  });

  /**
   * A 2.7 tornou o `anchor` trocável no inspector, mas a semente continua nascendo com um
   * de cada: as duas leituras da §11.2 ficam lado a lado na lista lateral, e o critério de
   * pronto da 2.8 se confere olhando, sem trocar opção nenhuma.
   */
  test("os dois text-bullets trazem âncoras diferentes, para comparar olhando", () => {
    const anchors = createSeedDeck()
      .slides.filter((slide) => slide.template === "text-bullets")
      .map((slide) => slide.options.anchor);

    expect(anchors).toEqual(["center", "top"]);
  });

  test("os itens ficam dentro do teto de quatro da §11.2 — três é o alvo", () => {
    const lists = createSeedDeck()
      .slides.filter((slide) => slide.template === "text-bullets")
      .map((slide) => slide.fields.items as string[]);

    expect(lists.map((items) => items.length)).toEqual([3, 4]);
    for (const items of lists) {
      expect(items.every((item) => item.length <= 80)).toBe(true);
    }
  });

  test("cada slide tem título próprio — é o que torna a lista da 1D verificável", () => {
    const headings = createSeedDeck().slides.map((slide) => slide.fields.heading);

    expect(new Set(headings).size).toBe(6);
  });

  test("os títulos vão de uma linha a quatro, para conferir a âncora de base", () => {
    // O que ocupa linha é o texto renderizado, não a marcação: os colchetes de
    // `[[destaque]]` não chegam ao canvas e não podem contar aqui.
    const [curto, , longo] = createSeedDeck().slides.map((slide) =>
      parseInline(String(slide.fields.heading))
        .map((node) => node.v)
        .join("").length,
    );

    // ~19 caracteres por linha em 96px sobre 920px de largura útil — §11.1 dos templates.
    expect(curto).toBeLessThanOrEqual(19);
    expect(longo).toBeGreaterThan(57);
    expect(longo).toBeLessThanOrEqual(70);
  });

  /** Só as capas têm kicker: a §11.2 não dá o campo ao `text-bullets`. */
  test("o kicker numera a posição do slide", () => {
    const kickers = createSeedDeck()
      .slides.filter((slide) => slide.template === "cover-statement")
      .map((slide) => slide.fields.kicker);

    expect(kickers).toEqual(["log/ · 01", "log/ · 02", "log/ · 03"]);
  });

  test("dois decks semente não compartilham id nem objeto de campos", () => {
    const a = createSeedDeck();
    const b = createSeedDeck();

    expect(a.id).not.toBe(b.id);
    expect(a.slides[0].id).not.toBe(b.slides[0].id);
    expect(a.slides[0].fields).not.toBe(b.slides[0].fields);
  });

  test("o formato é o 4:5 do deck, e vem do factory", () => {
    expect(createSeedDeck().format).toEqual({ w: 1080, h: 1350 });
  });
});
