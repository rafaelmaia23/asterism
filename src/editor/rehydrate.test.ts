import { describe, expect, test } from "vitest";
import type { Deck } from "@/deck/types";
import { reviveDeck } from "@/editor/rehydrate";
import { get } from "@/templates";

/**
 * O deck de fixture é montado com os defaults dos templates de verdade, porque é a forma
 * do que o `persist` grava: o que sai do localStorage passou pelo mesmo caminho que o
 * inspector escreve.
 */
function makeDeck(): Deck {
  return {
    version: 1,
    id: "d1",
    title: "Deck salvo",
    format: { w: 1080, h: 1350 },
    meta: { handle: "@rafael", pillar: "log" },
    slides: [
      {
        id: "s1",
        template: "cover-statement",
        fields: { kicker: "log/ · 01", heading: "Ninguém [[lê docs]]" },
        options: { ...get("cover-statement").defaults.options },
      },
      {
        id: "s2",
        template: "text-bullets",
        fields: { heading: "O que o log dizia", items: ["um", "dois"] },
        options: { ...get("text-bullets").defaults.options },
      },
    ],
    assets: {},
  };
}

/** O que o `persist` devolve: passou por `JSON.stringify` e voltou. */
function comoSalvo(deck: Deck): unknown {
  return JSON.parse(JSON.stringify(deck));
}

const semente = makeDeck();

describe("reviveDeck", () => {
  test("deck válido volta inteiro", () => {
    const deck = makeDeck();

    expect(reviveDeck(comoSalvo(deck), semente)).toEqual(deck);
  });

  /**
   * A decisão 31: o que está salvo deixa de bater com o código quando um template some, e
   * a resposta é derrubar só o slide que não passa. Tudo-ou-nada apagaria o carrossel
   * inteiro por causa de um slide.
   */
  test("slide de template desconhecido cai, e o resto do deck fica", () => {
    const deck = makeDeck();
    deck.slides[0].template = "template-que-nao-existe-mais";

    const revivido = reviveDeck(comoSalvo(deck), semente);

    expect(revivido.slides.map((slide) => slide.id)).toEqual(["s2"]);
    expect(revivido.title).toBe("Deck salvo");
  });

  test("slide que reprova no schema do próprio template cai", () => {
    const deck = makeDeck();
    // `items` é lista no `text-bullets`; uma string ali é dado de outra versão do código.
    deck.slides[1].fields.items = "não é lista";

    const revivido = reviveDeck(comoSalvo(deck), semente);

    expect(revivido.slides.map((slide) => slide.id)).toEqual(["s1"]);
  });

  test("slide a que falta uma opção do schema cai", () => {
    const deck = makeDeck();
    delete deck.slides[1].options.anchor;

    expect(reviveDeck(comoSalvo(deck), semente).slides.map((slide) => slide.id)).toEqual(["s1"]);
  });

  test("deck com forma errada devolve a semente", () => {
    expect(reviveDeck({ version: 1 }, semente)).toBe(semente);
    expect(reviveDeck("nada disso", semente)).toBe(semente);
    expect(reviveDeck(null, semente)).toBe(semente);
    expect(reviveDeck(undefined, semente)).toBe(semente);
  });

  /** O deck nunca fica sem slides — §11. Vale para o que se reidrata também. */
  test("deck sem nenhum slide sobrevivente devolve a semente", () => {
    const deck = makeDeck();
    deck.slides.forEach((slide) => {
      slide.template = "nada";
    });

    expect(reviveDeck(comoSalvo(deck), semente)).toBe(semente);
  });

  test("deck salvo sem slide nenhum devolve a semente", () => {
    const deck = makeDeck();
    deck.slides = [];

    expect(reviveDeck(comoSalvo(deck), semente)).toBe(semente);
  });

  /**
   * O `version` do deck é o da §6, e um número que não é 1 significa um formato que este
   * código não sabe ler — não há migração de dado para escrever ainda.
   */
  test("deck de outra versão devolve a semente", () => {
    const deck = { ...makeDeck(), version: 2 };

    expect(reviveDeck(comoSalvo(deck as unknown as Deck), semente)).toBe(semente);
  });
});
