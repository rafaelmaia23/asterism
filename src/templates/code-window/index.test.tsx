import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { PALETTE } from "@/code/theme";
import { codeWindow } from "@/templates/code-window";
import { describeGuardedRegion } from "@/test/overflow";
import type { DeckMeta } from "@/deck/types";

const deck: DeckMeta = { handle: "@rafael", pillar: "log" };
const { defaults } = codeWindow;

function renderCodeWindow(overrides: Partial<typeof codeWindow.defaults> = {}) {
  const { Component } = codeWindow;
  const { fields, options } = { ...defaults, ...overrides };

  return render(<Component fields={fields} options={options} deck={deck} index={3} total={12} />);
}

/**
 * Smoke test. Os 92px da barra, o raio de 12px e a centralização da janela nos 866px não
 * são verificáveis aqui: `happy-dom` não faz layout. O que se guarda é a classe que decide
 * e o realce que chega ao nó; o resto se confere olhando, como manda o `CLAUDE.md`.
 */
describe("code-window", () => {
  test("renderiza o título, o nome do arquivo e o código", () => {
    const { container } = renderCodeWindow();

    expect(screen.getByText("A linha que ninguém tinha lido")).toBeDefined();
    expect(screen.getByText("cache.ts")).toBeDefined();
    expect(container.querySelectorAll("[data-testid=code-line]").length).toBeGreaterThan(0);
  });

  test("o descritor declara fundo plain e grupo code", () => {
    expect(codeWindow.background).toBe("plain");
    expect(codeWindow.group).toBe("code");
  });

  test("nasce com o rodapé completo e sem cabeçalho", () => {
    renderCodeWindow();

    expect(screen.getByRole("img", { name: "maiahub" })).toBeDefined();
    expect(screen.getByText("@rafael")).toBeDefined();
    expect(screen.queryByTestId("header-band")).toBeNull();
  });

  /**
   * O realce chega ao nó **realçado**, e não como texto cru. É o critério que a 3D existe
   * para provar: com o realçador síncrono não há um quadro em que o código apareça sem
   * cor, e é isso que faz o palco de exportação não precisar esperar por nada além das
   * fontes.
   */
  test("o código chega colorido no primeiro render, sem espera", () => {
    const { container } = renderCodeWindow();
    const keyword = [...container.querySelectorAll("span")].find(
      (span) => span.textContent === "const",
    );

    expect(keyword?.getAttribute("style")).toContain(PALETTE.keyword.hex);
  });

  /**
   * O código é literal: nem marcação inline, nem interpretação nenhuma. `**` num trecho de
   * código é exponenciação, e o dia em que o parser da §7 encostasse aqui o slide passaria
   * a mentir sobre o que o arquivo diz.
   */
  test("o código não passa pelo parser de marcação", () => {
    const { container } = renderCodeWindow({
      fields: { ...defaults.fields, lang: "text", code: "a ** b" },
    });

    expect(container.querySelector("strong")).toBeNull();
    expect(container.querySelector("[data-testid=code-window]")?.textContent).toContain("a ** b");
  });

  /** A exceção da §10.3: o nome do arquivo é identificador literal, e não versaliza. */
  test("o nome do arquivo sai em caixa baixa", () => {
    renderCodeWindow();

    expect(screen.getByText("cache.ts").className).toContain("normal-case");
  });

  test("a barra tem os três pontos da §10.3", () => {
    const { container } = renderCodeWindow();

    expect(container.querySelectorAll("[data-testid=code-window] .rounded-full")).toHaveLength(3);
  });

  /**
   * A janela **não** tem altura de faixa — é a armadilha da §13, e aqui é a forma mais
   * fácil de errar dela: dar `h-[866px]` à janela desenharia um painel vazio para quatro
   * linhas e faria o guard medir uma coisa dimensionada pelo que ela contém.
   */
  test("a janela cresce com o código, e não com a região", () => {
    const { container } = renderCodeWindow();

    expect(container.querySelector("[data-testid=code-window]")?.className).not.toMatch(
      /(^|\s)h-\[/,
    );
  });

  /**
   * As mesmas quatro combinações do `context`, e a §11.6 diz isso com todas as letras: os
   * dois têm título em cima e um bloco embaixo, e nas quatro o bloco acaba em 1160.
   */
  describe("as quatro geometrias do bloco", () => {
    const semTitulo = { ...defaults.fields, heading: "" };

    test("sem cabeçalho e com título: 80–230 e 294–1160", () => {
      renderCodeWindow();

      expect(screen.getByTestId("heading-region").className).toContain("top-[80px]");
      expect(screen.getByTestId("code-region").className).toContain("top-[294px]");
      expect(screen.getByTestId("code-region").className).toContain("h-[866px]");
    });

    test("com cabeçalho e com título: as duas regiões descem 132px", () => {
      renderCodeWindow({ options: { ...defaults.options, showHeader: true } });

      expect(screen.queryByTestId("header-band")).not.toBeNull();
      expect(screen.getByTestId("heading-region").className).toContain("top-[212px]");
      expect(screen.getByTestId("code-region").className).toContain("top-[426px]");
      expect(screen.getByTestId("code-region").className).toContain("h-[734px]");
    });

    test("sem cabeçalho e sem título: a janela ocupa 80–1160", () => {
      renderCodeWindow({ fields: semTitulo });

      expect(screen.queryByTestId("heading-region")).toBeNull();
      expect(screen.getByTestId("code-region").className).toContain("top-[80px]");
      expect(screen.getByTestId("code-region").className).toContain("h-[1080px]");
    });

    test("com cabeçalho e sem título: a janela sobe para 212, não para 80", () => {
      renderCodeWindow({
        fields: semTitulo,
        options: { ...defaults.options, showHeader: true },
      });

      expect(screen.queryByTestId("heading-region")).toBeNull();
      expect(screen.getByTestId("code-region").className).toContain("top-[212px]");
      expect(screen.getByTestId("code-region").className).toContain("h-[948px]");
    });
  });

  test("o rodapé inteiro some com o interruptor da faixa", () => {
    renderCodeWindow({ options: { ...defaults.options, showFooter: false } });

    expect(screen.queryByRole("img", { name: "maiahub" })).toBeNull();
    expect(screen.queryAllByTestId("constellation-dot")).toHaveLength(0);
  });

  // A região é a do bloco — a §11.6 a marca com ⌐ —, e o que cresce dentro dela é a janela.
  describeGuardedRegion(codeWindow);
});
