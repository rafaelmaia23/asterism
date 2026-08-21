import { describe, expect, test } from "vitest";
import { fitScale } from "@/editor/fit-scale";

const FORMAT = { w: 1080, h: 1350 };

describe("fitScale", () => {
  test("área do tamanho exato do slide vale 1", () => {
    expect(fitScale({ w: 1080, h: 1350 }, FORMAT)).toBe(1);
  });

  test("área estreita e alta é limitada pela largura", () => {
    expect(fitScale({ w: 540, h: 1350 }, FORMAT)).toBe(0.5);
  });

  test("área larga e baixa é limitada pela altura", () => {
    expect(fitScale({ w: 1080, h: 675 }, FORMAT)).toBe(0.5);
  });

  test("área maior que o slide não passa de 1 — auto-fit não amplia", () => {
    expect(fitScale({ w: 3000, h: 3000 }, FORMAT)).toBe(1);
  });

  test("o formato é dado: um slide quadrado usa a própria proporção", () => {
    expect(fitScale({ w: 540, h: 1350 }, { w: 1080, h: 1080 })).toBe(0.5);
  });

  test("área ainda não medida vale 0, e quem chama não desenha quadro", () => {
    expect(fitScale({ w: 0, h: 0 }, FORMAT)).toBe(0);
    expect(fitScale({ w: 800, h: 0 }, FORMAT)).toBe(0);
  });

  test("medida negativa também vale 0 — nunca escala invertida", () => {
    expect(fitScale({ w: -10, h: 800 }, FORMAT)).toBe(0);
  });
});
