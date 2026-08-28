import { afterEach, describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import type { DeckMeta } from "@/deck/types";
import { importImage } from "@/images/cache";
import { splitVertical } from "@/templates/split-vertical";
import { describeGuardedRegion } from "@/test/overflow";
import { stubImages, type StubbedImages } from "@/test/images";

const deck: DeckMeta = { handle: "@rafael", pillar: "log" };
const { defaults } = splitVertical;

let images: StubbedImages;

afterEach(() => {
  images?.restore();
});

function renderSplitVertical(overrides: Partial<typeof splitVertical.defaults> = {}) {
  const { Component } = splitVertical;
  const { fields, options } = { ...defaults, ...overrides };

  return render(<Component fields={fields} options={options} deck={deck} index={7} total={12} />);
}

const comCabecalho = { ...defaults.options, showHeader: true };

/**
 * Smoke test. A divisão 480 + 80 + 440, a sangria pelo topo e pela direita e a
 * centralização vertical do bloco não são verificáveis aqui — `happy-dom` não faz layout.
 * O que se guarda é a tabela de faixas, que é lógica, e o que chega ao DOM.
 */
describe("split-vertical", () => {
  test("renderiza o título e o corpo na coluna da esquerda", () => {
    renderSplitVertical();

    expect(screen.getByText("O gráfico que não mostrava nada")).toBeDefined();
    expect(screen.getByTestId("text-region").textContent).toContain("Latência estável");
  });

  test("o descritor declara fundo plain e grupo media", () => {
    expect(splitVertical.background).toBe("plain");
    expect(splitVertical.group).toBe("media");
  });

  test("o corpo passa pelo parser de marcação", () => {
    const { container } = renderSplitVertical({
      fields: { ...defaults.fields, body: "O painel inteiro em ==verde==." },
    });

    expect(container.querySelector("[data-testid=text-region] mark")?.textContent).toBe("verde");
  });

  /** O título é literal: a §11.9 não dá marcação a ele. */
  test("o título não passa pelo parser de marcação", () => {
    const { container } = renderSplitVertical({
      fields: { ...defaults.fields, heading: "O gráfico ==vazio==" },
    });

    expect(container.querySelector("[data-testid=heading] mark")).toBeNull();
    expect(screen.getByTestId("heading").textContent).toBe("O gráfico ==vazio==");
  });

  /** Título vazio não deixa buraco: some junto com o gap, e o corpo se recentraliza. */
  test("título vazio some, e a faixa não muda", () => {
    renderSplitVertical({ fields: { ...defaults.fields, heading: "" } });

    expect(screen.queryByTestId("heading")).toBeNull();
    expect(screen.getByTestId("text-region").className).toContain("top-[80px]");
    expect(screen.getByTestId("text-region").className).toContain("h-[1080px]");
  });

  describe("a faixa de texto, nas duas geometrias da §11.9", () => {
    test("sem cabeçalho: 80–1160", () => {
      renderSplitVertical();

      expect(screen.queryByTestId("header-band")).toBeNull();
      expect(screen.getByTestId("text-region").className).toContain("top-[80px]");
      expect(screen.getByTestId("text-region").className).toContain("h-[1080px]");
    });

    test("com cabeçalho: 212–1160, e o bloco se recentraliza", () => {
      renderSplitVertical({ options: comCabecalho });

      expect(screen.queryByTestId("header-band")).not.toBeNull();
      expect(screen.getByTestId("text-region").className).toContain("top-[212px]");
      expect(screen.getByTestId("text-region").className).toContain("h-[948px]");
    });

    /** A §11.9: o kicker fica na coluna da esquerda, então a imagem não se mexe. */
    test("a imagem não se mexe quando o cabeçalho liga", () => {
      renderSplitVertical();
      const semCabecalho = screen.getByTestId("image-band").className;

      screen.getByTestId("image-band").remove();
      renderSplitVertical({ options: comCabecalho });

      expect(screen.getByTestId("image-band").className).toBe(semCabecalho);
    });
  });

  describe("a faixa da imagem", () => {
    test("sangra pelo topo e pela direita, e para em 1174", () => {
      renderSplitVertical();

      const band = screen.getByTestId("image-band").className;

      expect(band).toContain("top-0");
      expect(band).toContain("right-0");
      expect(band).toContain("w-[440px]");
      expect(band).toContain("h-[1174px]");
    });

    test("sem imagem, a faixa é a superfície com o rótulo", () => {
      images = stubImages();
      renderSplitVertical();

      expect(screen.getByTestId("image-band").textContent).toBe("Sem imagem");
    });

    test("com imagem, a faixa desenha o `img` e o ajuste da opção", async () => {
      images = stubImages();
      const id = await importImage(new Blob(["foto"], { type: "image/png" }));

      renderSplitVertical({
        fields: { ...defaults.fields, image: id },
        options: { ...defaults.options, imageFit: "contain" },
      });

      expect(screen.getByTestId("image").getAttribute("src")).toMatch(/^blob:/);
      expect(screen.getByTestId("image").className).toContain("object-contain");
    });
  });

  /**
   * A §11.9 marca **uma** região: título e corpo moram no mesmo bloco centralizado, e a
   * imagem nunca é guardada — ela se ajusta em vez de crescer.
   */
  describeGuardedRegion(splitVertical, 1);
});
