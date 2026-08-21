import { beforeEach, describe, expect, test, vi } from "vitest";
import { download, fileName } from "@/export/download";

/**
 * O alvo não conhece o deck, então nomeia o arquivo pelo que ele é (`carrossel.pdf`) e
 * quem sabe o título é quem renomeia. A regra é uma só: o título vira o nome, a extensão
 * vem do alvo.
 */
describe("fileName", () => {
  test("o título do deck vira o nome do arquivo, com a extensão do alvo", () => {
    expect(fileName("Carrossel de exemplo", "carrossel.pdf")).toBe(
      "carrossel-de-exemplo.pdf",
    );
  });

  test("acento, pontuação e maiúscula saem", () => {
    expect(fileName("Três semanas de investigação!", "x.pdf")).toBe(
      "tres-semanas-de-investigacao.pdf",
    );
  });

  test("espaço repetido e borda não viram traço solto", () => {
    expect(fileName("  o cache   mentiu  ", "x.pdf")).toBe("o-cache-mentiu.pdf");
  });

  test("título sem nenhum caractere aproveitável cai no nome do alvo", () => {
    expect(fileName("!!!", "carrossel.pdf")).toBe("carrossel.pdf");
  });
});

describe("download", () => {
  const createObjectURL = vi.fn(() => "blob:fake");
  const revokeObjectURL = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    URL.createObjectURL = createObjectURL;
    URL.revokeObjectURL = revokeObjectURL;
  });

  test("entrega o blob ao navegador e devolve a URL temporária", () => {
    const blob = new Blob(["%PDF"], { type: "application/pdf" });

    download({ name: "deck.pdf", blob });

    expect(createObjectURL).toHaveBeenCalledWith(blob);
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:fake");
  });

  test("não deixa o âncora no documento", () => {
    download({ name: "deck.pdf", blob: new Blob([""]) });

    expect(document.querySelectorAll("a")).toHaveLength(0);
  });
});
