import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { compare2col } from "@/templates/compare-2col";
import { describeGuardedRegion } from "@/test/overflow";
import type { DeckMeta } from "@/deck/types";

const deck: DeckMeta = { handle: "@rafael", pillar: "log" };
const { defaults } = compare2col;

function renderCompare(overrides: Partial<typeof compare2col.defaults> = {}) {
  const { Component } = compare2col;
  const { fields, options } = { ...defaults, ...overrides };

  return render(<Component fields={fields} options={options} deck={deck} index={6} total={12} />);
}

/**
 * Smoke test. Os 24px entre o rótulo e a régua e a altura de cada coluna não são
 * verificáveis aqui — `happy-dom` não faz layout. O que se guarda é a divisão dos 920px,
 * que é a classe, e o que chega ao DOM.
 */
describe("compare-2col", () => {
  test("renderiza o título, os dois rótulos e as duas colunas", () => {
    renderCompare();

    expect(screen.getByText("O que mudou no monitoramento")).toBeDefined();
    expect(screen.getByText("Antes")).toBeDefined();
    expect(screen.getByText("Depois")).toBeDefined();
    expect(screen.getByTestId("column-before").textContent).toContain("Alertas de infraestrutura");
    expect(screen.getByTestId("column-after").textContent).toContain("invariante de negócio");
  });

  test("o descritor declara fundo plain e grupo content", () => {
    expect(compare2col.background).toBe("plain");
    expect(compare2col.group).toBe("content");
  });

  /**
   * O critério de pronto da 3.14: **as duas colunas dentro dos 920px úteis**. 428 + 64 +
   * 428 = 920, e os 64 são o `--slide-gap-block` da §4.2, que é o degrau sancionado para
   * separar duas coisas de igual peso.
   */
  test("as duas colunas dividem os 920px em 428 + 64 + 428", () => {
    const { container } = renderCompare();
    const row = container.querySelector("[data-testid=columns]");

    expect(row?.className).toContain("gap-[var(--slide-gap-block)]");
    expect(row?.className).toContain("items-start");

    for (const id of ["column-before", "column-after"]) {
      expect(container.querySelector(`[data-testid=${id}]`)?.className).toContain("w-[428px]");
    }
  });

  /**
   * As duas ancoram ao **topo** para que os dois rótulos fiquem na mesma linha: é o que faz
   * a comparação ser lida como par e não como duas listas soltas. E não se equalizam — cada
   * uma acaba onde acaba, §11.8.
   */
  test("cada coluna tem rótulo, régua e conteúdo, nessa ordem", () => {
    const { container } = renderCompare();

    for (const id of ["column-before", "column-after"]) {
      const column = container.querySelector(`[data-testid=${id}]`);
      const children = [...(column?.children ?? [])];

      expect(children).toHaveLength(3);
      expect(children[0]?.className).toContain("slide-meta");
      expect(children[1]?.className).toContain("slide-hairline");
      expect(children[2]?.className).toContain("slide-caption");
    }
  });

  /**
   * A régua usa a utility com a compensação de `--slide-scale` da decisão 38: 1px fixo a
   * k = 0,28 dá 0,28 pixel de dispositivo e o navegador não pinta, então a linha apareceria
   * no PDF e faltaria no preview.
   */
  test("a régua é `slide-hairline`, e não `h-px`", () => {
    const { container } = renderCompare();
    const rules = container.querySelectorAll("[data-testid=column-rule]");

    expect(rules).toHaveLength(2);
    for (const rule of rules) {
      expect(rule.className).toContain("slide-hairline");
      expect(rule.className).not.toMatch(/(^|\s)h-px(\s|$)/);
    }
  });

  /**
   * **As duas colunas são iguais em cor.** Nada de verde no "depois" e vermelho no "antes":
   * a §2.5 do design system reserva verde e vermelho a estado de sistema. O que distingue
   * os lados são os rótulos, e o que o leitor conclui é assunto dele.
   */
  test("as duas colunas têm exatamente as mesmas classes", () => {
    const { container } = renderCompare();
    const before = container.querySelector("[data-testid=column-before]");
    const after = container.querySelector("[data-testid=column-after]");

    expect(before?.className).toBe(after?.className);
    expect(before?.lastElementChild?.className).toBe(after?.lastElementChild?.className);
  });

  test("a marcação vale nos dois conteúdos, e não nos rótulos", () => {
    const { container } = renderCompare({
      fields: {
        ...defaults.fields,
        beforeLabel: "sem `cache`",
        before: "A chave era `user:id`.",
        after: "A chave passou a ser `user:id:tenant`.",
      },
    });

    expect(container.querySelector("[data-testid=column-before] code")?.textContent).toBe(
      "user:id",
    );
    expect(container.querySelector("[data-testid=column-after] code")?.textContent).toBe(
      "user:id:tenant",
    );
    expect(screen.getByText("sem `cache`")).toBeDefined();
  });

  /** As mesmas quatro combinações do `context`: título em cima, um bloco embaixo. */
  describe("as quatro geometrias das colunas", () => {
    const semTitulo = { ...defaults.fields, heading: "" };

    test("sem cabeçalho e com título: 80–230 e 294–1160", () => {
      renderCompare();

      expect(screen.getByTestId("heading-region").className).toContain("top-[80px]");
      expect(screen.getByTestId("columns-region").className).toContain("top-[294px]");
      expect(screen.getByTestId("columns-region").className).toContain("h-[866px]");
    });

    test("com cabeçalho e com título: as duas regiões descem 132px", () => {
      renderCompare({ options: { ...defaults.options, showHeader: true } });

      expect(screen.queryByTestId("header-band")).not.toBeNull();
      expect(screen.getByTestId("heading-region").className).toContain("top-[212px]");
      expect(screen.getByTestId("columns-region").className).toContain("top-[426px]");
      expect(screen.getByTestId("columns-region").className).toContain("h-[734px]");
    });

    test("sem cabeçalho e sem título: as colunas ocupam 80–1160", () => {
      renderCompare({ fields: semTitulo });

      expect(screen.queryByTestId("heading-region")).toBeNull();
      expect(screen.getByTestId("columns-region").className).toContain("top-[80px]");
      expect(screen.getByTestId("columns-region").className).toContain("h-[1080px]");
    });

    test("com cabeçalho e sem título: as colunas sobem para 212, não para 80", () => {
      renderCompare({
        fields: semTitulo,
        options: { ...defaults.options, showHeader: true },
      });

      expect(screen.getByTestId("columns-region").className).toContain("top-[212px]");
      expect(screen.getByTestId("columns-region").className).toContain("h-[948px]");
    });
  });

  test("o rodapé inteiro some com o interruptor da faixa", () => {
    renderCompare({ options: { ...defaults.options, showFooter: false } });

    expect(screen.queryByRole("img", { name: "maiahub" })).toBeNull();
    expect(screen.queryAllByTestId("constellation-dot")).toHaveLength(0);
  });

  /**
   * **Uma** região guardada, não duas: a §11.8 marca "Colunas ⌐" como uma linha só, e o nó
   * que cresce é a linha flex — num flex-row a altura é a da coluna mais alta, que é
   * exatamente o que precisa ser comparado com os 866px da faixa.
   */
  describeGuardedRegion(compare2col);
});
