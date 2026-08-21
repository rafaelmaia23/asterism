import { beforeEach, describe, expect, test, vi } from "vitest";
import { createSlide } from "@/deck/factories";
import { pdf } from "@/export/targets/pdf";
import type { Frame, RenderSource } from "@/export/types";

const { rasterize, addImage, addPage, output } = vi.hoisted(() => ({
  rasterize: vi.fn(),
  addImage: vi.fn(),
  addPage: vi.fn(),
  output: vi.fn(() => new Blob(["%PDF"], { type: "application/pdf" })),
}));

const jsPDF = vi.hoisted(() => vi.fn());

vi.mock("@/export/rasterize", () => ({ rasterize }));
vi.mock("jspdf", () => ({
  jsPDF: class {
    constructor(...args: unknown[]) {
      jsPDF(...args);
    }
    addImage = addImage;
    addPage = addPage;
    output = output;
  },
}));

/**
 * O alvo é o estágio 2: recebe `RenderSource`, chama a rasterização compartilhada e
 * empacota. Com `rasterize` mockado, o que se prova aqui é o laço de páginas, a unidade e
 * o formato do documento — o conteúdo binário do PDF é assunto da conferência final,
 * abrindo o arquivo fora da ferramenta.
 */
function sources(quantos: number): RenderSource[] {
  return Array.from({ length: quantos }, () => ({
    slide: createSlide("cover-statement", { fields: {}, options: {} }),
    node: document.createElement("div"),
  }));
}

function frame(width = 2160, height = 2700): Frame {
  return {
    slide: createSlide("cover-statement", { fields: {}, options: {} }),
    width,
    height,
    data: "data:image/png;base64,AAAA",
  };
}

describe("alvo pdf", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    rasterize.mockImplementation(async () => frame());
  });

  test("o documento sai em pt, no formato do slide", async () => {
    await pdf.produce(sources(1), {});

    expect(jsPDF).toHaveBeenCalledWith(
      expect.objectContaining({ unit: "pt", format: [1080, 1350] }),
    );
  });

  test("o formato vem do bitmap, não de constante", async () => {
    rasterize.mockImplementation(async () => frame(2160, 2160));

    await pdf.produce(sources(1), {});

    expect(jsPDF).toHaveBeenCalledWith(expect.objectContaining({ format: [1080, 1080] }));
  });

  test("uma página por slide: três slides, dois addPage", async () => {
    await pdf.produce(sources(3), {});

    expect(addImage).toHaveBeenCalledTimes(3);
    expect(addPage).toHaveBeenCalledTimes(2);
  });

  test("rasteriza na escala 2", async () => {
    const srcs = sources(2);

    await pdf.produce(srcs, {});

    expect(rasterize).toHaveBeenNthCalledWith(1, srcs[0], 2);
    expect(rasterize).toHaveBeenNthCalledWith(2, srcs[1], 2);
  });

  test("a página recebe o PNG cobrindo o slide inteiro", async () => {
    await pdf.produce(sources(1), {});

    expect(addImage).toHaveBeenCalledWith(
      "data:image/png;base64,AAAA",
      "PNG",
      0,
      0,
      1080,
      1350,
    );
  });

  test("devolve uma lista de arquivos, mesmo com um só", async () => {
    const result = await pdf.produce(sources(3), {});

    expect(result.files).toHaveLength(1);
    expect(result.files[0].name).toMatch(/\.pdf$/);
    expect(result.files[0].blob.type).toBe("application/pdf");
  });

  test("deck sem slide não produz arquivo nenhum", async () => {
    const result = await pdf.produce([], {});

    expect(result.files).toEqual([]);
    expect(jsPDF).not.toHaveBeenCalled();
  });
});
