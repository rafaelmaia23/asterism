import { beforeEach, describe, expect, test, vi } from "vitest";
import { createSlide } from "@/deck/factories";
import { rasterize } from "@/export/rasterize";
import type { RenderSource } from "@/export/types";

const domToPng = vi.hoisted(() => vi.fn(async () => "data:image/png;base64,AAAA"));

vi.mock("modern-screenshot", () => ({ domToPng }));

/**
 * O que se prova aqui é o contrato: a aritmética da escala, o que chega à biblioteca e o
 * que volta no `Frame`. A captura de verdade não cabe em teste — `happy-dom` não faz
 * layout nem tem canvas, e a prova de que a fonte foi inlinada é o PDF aberto fora da
 * ferramenta.
 */
function source(w = 1080, h = 1350): RenderSource {
  const node = document.createElement("div");
  // `offsetWidth` é 0 sem layout, então o teste o define: é a medida que o `rasterize`
  // lê para dizer à biblioteca em que tamanho o nó está.
  Object.defineProperty(node, "offsetWidth", { value: w });
  Object.defineProperty(node, "offsetHeight", { value: h });

  return { slide: createSlide("cover-statement", { fields: {}, options: {} }), node };
}

describe("rasterize", () => {
  beforeEach(() => {
    domToPng.mockClear();
  });

  test("a escala 2 sobre 1080×1350 devolve um frame de 2160×2700", async () => {
    const frame = await rasterize(source(), 2);

    expect(frame.width).toBe(2160);
    expect(frame.height).toBe(2700);
  });

  test("o frame carrega o slide e o PNG em data URL", async () => {
    const src = source();

    const frame = await rasterize(src, 2);

    expect(frame.slide).toBe(src.slide);
    expect(frame.data).toBe("data:image/png;base64,AAAA");
  });

  test("a captura recebe o nó, a escala e o tamanho real do slide", async () => {
    const src = source();

    await rasterize(src, 2);

    expect(domToPng).toHaveBeenCalledWith(
      src.node,
      expect.objectContaining({ scale: 2, width: 1080, height: 1350 }),
    );
  });

  test("o formato não é constante: um nó 1080×1080 sai 2160×2160", async () => {
    const frame = await rasterize(source(1080, 1080), 2);

    expect(frame.height).toBe(2160);
  });
});
