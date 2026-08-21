import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { SlideGrid, gridPath, gridStep } from "@/render/slide-grid";

const FORMAT = { w: 1080, h: 1350 };

/** As coordenadas das verticais e das horizontais de um `d`. */
function lines(d: string) {
  return {
    v: [...d.matchAll(/M([\d.]+) 0V/g)].map((m) => Number(m[1])),
    h: [...d.matchAll(/M0 ([\d.]+)H/g)].map((m) => Number(m[1])),
  };
}

describe("gridStep", () => {
  test("4:5 fecha em 54 — 20 por 25 módulos inteiros", () => {
    expect(gridStep(1080, 1350)).toBe(54);
  });

  test("quadrado também fecha em 54", () => {
    expect(gridStep(1080, 1080)).toBe(54);
  });

  test("9:16 fecha em 60, o divisor comum mais próximo do alvo", () => {
    expect(gridStep(1080, 1920)).toBe(60);
  });

  test("formato sem divisor comum utilizável cai no alvo", () => {
    // Divisor comum 1: nenhum passo inteiro serve, e um módulo de 1px seria absurdo.
    expect(gridStep(1081, 1350)).toBe(54);
  });
});

describe("gridPath", () => {
  test("o 4:5 dá 21 verticais e 26 horizontais, contando as de fechamento", () => {
    const { v, h } = lines(gridPath(FORMAT.w, FORMAT.h, 54));

    expect(v).toHaveLength(21);
    expect(h).toHaveLength(26);
  });

  test("a primeira linha entra meia espessura, para caber inteira dentro da borda", () => {
    const { v, h } = lines(gridPath(FORMAT.w, FORMAT.h, 54));

    expect(v[0]).toBe(1);
    expect(h[0]).toBe(1);
  });

  test("as últimas fecham a moldura por dentro da direita e da base", () => {
    const { v, h } = lines(gridPath(FORMAT.w, FORMAT.h, 54));

    expect(v.at(-1)).toBe(1079);
    expect(h.at(-1)).toBe(1349);
  });

  test("as internas caem no múltiplo do passo, deslocadas meia espessura", () => {
    const { v } = lines(gridPath(FORMAT.w, FORMAT.h, 54));

    expect(v.slice(0, 4)).toEqual([1, 55, 109, 163]);
  });

  test("nenhuma linha passa da borda", () => {
    const { v, h } = lines(gridPath(FORMAT.w, FORMAT.h, 54));

    expect(Math.max(...v)).toBeLessThan(FORMAT.w);
    expect(Math.max(...h)).toBeLessThan(FORMAT.h);
  });

  test("outro formato dá outra contagem — nada de 1080 escrito à mão", () => {
    const { v, h } = lines(gridPath(1080, 1080, 54));

    expect(v).toHaveLength(21);
    expect(h).toHaveLength(21);
  });
});

describe("SlideGrid", () => {
  test("desenha um path só, no tamanho do formato", () => {
    render(<SlideGrid format={FORMAT} />);
    const svg = screen.getByTestId("slide-grid");

    expect(svg.getAttribute("viewBox")).toBe("0 0 1080 1350");
    expect(svg.querySelectorAll("path")).toHaveLength(1);
  });

  test("é decoração: fica fora da árvore de acessibilidade", () => {
    render(<SlideGrid format={FORMAT} />);

    expect(screen.getByTestId("slide-grid").getAttribute("aria-hidden")).toBe("true");
  });

  test("a espessura sai da variável de compensação, nunca de um número fixo", () => {
    render(<SlideGrid format={FORMAT} />);
    const path = screen.getByTestId("slide-grid").querySelector("path");

    expect(path?.getAttribute("style")).toContain("--slide-grid-line-render");
  });
});
