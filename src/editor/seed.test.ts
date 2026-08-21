import { describe, expect, test } from "vitest";
import { createSeedDeck } from "@/editor/seed";
import { get } from "@/templates";

describe("createSeedDeck", () => {
  test("nasce com três slides de capa", () => {
    const deck = createSeedDeck();

    expect(deck.slides).toHaveLength(3);
    expect(deck.slides.every((slide) => slide.template === "cover-statement")).toBe(true);
  });

  test("as opções vêm dos defaults do registry, não de cópia à mão", () => {
    const deck = createSeedDeck();
    const { defaults } = get("cover-statement");

    for (const slide of deck.slides) {
      expect(slide.options).toEqual(defaults.options);
    }
  });

  test("cada slide tem título próprio — é o que torna a lista da 1D verificável", () => {
    const headings = createSeedDeck().slides.map((slide) => slide.fields.heading);

    expect(new Set(headings).size).toBe(3);
  });

  test("os títulos vão de uma linha a quatro, para conferir a âncora de base", () => {
    const [curto, , longo] = createSeedDeck().slides.map(
      (slide) => String(slide.fields.heading).length,
    );

    // ~19 caracteres por linha em 96px sobre 920px de largura útil — §11.1 dos templates.
    expect(curto).toBeLessThanOrEqual(19);
    expect(longo).toBeGreaterThan(57);
    expect(longo).toBeLessThanOrEqual(70);
  });

  test("o kicker numera a posição do slide", () => {
    const kickers = createSeedDeck().slides.map((slide) => slide.fields.kicker);

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
