import { describe, expect, test } from "vitest";
import { MAX_EDGE, fitWithin } from "@/images/downscale";

describe("fitWithin", () => {
  test("o teto é o 1080 do formato vezes a escala 2 do alvo PDF", () => {
    expect(MAX_EDGE).toBe(2160);
  });

  test("o que já cabe não é tocado", () => {
    expect(fitWithin(1600, 900, 2160)).toEqual({ width: 1600, height: 900 });
  });

  test("o que mede exatamente o teto não é tocado", () => {
    expect(fitWithin(2160, 2160, 2160)).toEqual({ width: 2160, height: 2160 });
  });

  test("reduz pela largura quando ela é o maior lado", () => {
    expect(fitWithin(4320, 2160, 2160)).toEqual({ width: 2160, height: 1080 });
  });

  test("reduz pela altura quando ela é o maior lado", () => {
    expect(fitWithin(3000, 4000, 2160)).toEqual({ width: 1620, height: 2160 });
  });

  /**
   * O resultado vai para `canvas.width`, que trunca o que não for inteiro. Arredondar aqui
   * é o que mantém a proporção mais perto da original do que truncar depois.
   */
  test("devolve inteiros", () => {
    const { width, height } = fitWithin(4001, 3001, 2160);

    expect(Number.isInteger(width)).toBe(true);
    expect(Number.isInteger(height)).toBe(true);
    expect(width).toBe(2160);
    expect(height).toBe(1620);
  });

  /** Um lado zero é imagem sem dimensão — não há proporção a preservar, e nada a reduzir. */
  test("dimensão zero passa intacta, sem divisão por zero", () => {
    expect(fitWithin(0, 0, 2160)).toEqual({ width: 0, height: 0 });
  });
});
