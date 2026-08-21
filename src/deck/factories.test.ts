import { describe, expect, test } from "vitest";
import { createDeck, createSlide } from "@/deck/factories";
import type { SlideDefaults } from "@/deck/types";

describe("createDeck", () => {
  test("carimba a versão e o formato 1080×1350", () => {
    const deck = createDeck();

    expect(deck.version).toBe(1);
    expect(deck.format).toEqual({ w: 1080, h: 1350 });
  });

  test("dá um id não vazio e diferente a cada chamada", () => {
    const a = createDeck();
    const b = createDeck();

    expect(a.id).not.toHaveLength(0);
    expect(a.id).not.toBe(b.id);
  });

  test("sem argumento, cai nos defaults e nasce vazio", () => {
    const deck = createDeck();

    expect(deck.title).toBe("Novo carrossel");
    expect(deck.meta).toEqual({ handle: "@rafael", pillar: "api" });
    expect(deck.slides).toEqual([]);
    expect(deck.assets).toEqual({});
  });

  test("o init parcial sobrescreve só o que veio", () => {
    const deck = createDeck({ title: "Registries", pillar: "forge" });

    expect(deck.title).toBe("Registries");
    expect(deck.meta.pillar).toBe("forge");
    expect(deck.meta.handle).toBe("@rafael");
  });
});

describe("createSlide", () => {
  const defaults: SlideDefaults = {
    fields: { kicker: "api/ · 01", heading: "Um título", items: ["um", "dois"] },
    options: { anchor: "center", showArrow: true },
  };

  test("guarda o template recebido e gera um id único", () => {
    const a = createSlide("cover-statement", defaults);
    const b = createSlide("cover-statement", defaults);

    expect(a.template).toBe("cover-statement");
    expect(a.id).not.toHaveLength(0);
    expect(a.id).not.toBe(b.id);
  });

  test("copia os defaults recebidos para fields e options", () => {
    const slide = createSlide("cover-statement", defaults);

    expect(slide.fields).toEqual(defaults.fields);
    expect(slide.options).toEqual(defaults.options);
  });

  test("copia em profundidade: mexer no slide não contamina os defaults", () => {
    const slide = createSlide("cover-statement", defaults);

    (slide.fields.items as string[]).push("três");
    slide.fields.heading = "Outro título";

    expect(defaults.fields.items).toEqual(["um", "dois"]);
    expect(defaults.fields.heading).toBe("Um título");
  });
});
