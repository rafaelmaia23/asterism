import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { textImpact } from "@/templates/text-impact";
import { describeGuardedRegion } from "@/test/overflow";
import type { DeckMeta } from "@/deck/types";

const deck: DeckMeta = { handle: "@rafael", pillar: "log" };
const { defaults } = textImpact;

function renderImpact(overrides: Partial<typeof textImpact.defaults> = {}) {
  const { Component } = textImpact;
  const { fields, options } = { ...defaults, ...overrides };

  return render(
    <Component fields={fields} options={options} deck={deck} index={5} total={12} />,
  );
}

/**
 * Smoke test. "Centralizada nos dois eixos" não é verificável aqui — `happy-dom` não faz
 * layout, e a asserção mediria zero contra zero. O que se guarda é a classe que decide, e
 * o resto se confere olhando, como manda o `CLAUDE.md`.
 */
describe("text-impact", () => {
  test("renderiza a frase que recebeu", () => {
    renderImpact({
      fields: { kicker: "log/ · 06", heading: "Três semanas para uma linha" },
    });

    expect(screen.getByText("Três semanas para uma linha")).toBeDefined();
  });

  test("a frase é interpretada como marcação — `[[destaque]]` vira accent", () => {
    const { container } = renderImpact({
      fields: { kicker: "log/ · 06", heading: "Três semanas para um [[bug]]" },
    });

    const accent = container.querySelector(
      "[data-testid=phrase-region] span.text-azure-radiance-400",
    );

    expect(accent?.textContent).toBe("bug");
    expect(container.querySelector("[data-testid=phrase-region] p")?.textContent).toBe(
      "Três semanas para um bug",
    );
  });

  /**
   * O único template de miolo que nasce com o fundo ligado, e é o que o marca visualmente
   * como pausa: o leitor reconhece o respiro antes de ler a frase. §11.5.
   */
  test("o descritor declara fundo grid e grupo content", () => {
    expect(textImpact.background).toBe("grid");
    expect(textImpact.group).toBe("content");
    expect(defaults.options.showGrid).toBe(true);
  });

  /** Como o resto do miolo, e ao contrário da capa: nasce assinado. §11.0. */
  test("nasce com o rodapé completo e sem cabeçalho", () => {
    renderImpact();

    expect(screen.getByRole("img", { name: "maiahub" })).toBeDefined();
    expect(screen.getByText("@rafael")).toBeDefined();
    expect(screen.queryByTestId("header-band")).toBeNull();
  });

  /**
   * A única exceção de alinhamento do sistema — a §3.4 do design system a abre
   * nominalmente para este template. Vale para a frase e para mais nada: o kicker continua
   * no canto superior esquerdo e o rodapé continua sendo o rodapé.
   */
  test("a frase é centralizada nos dois eixos", () => {
    const { container } = renderImpact();
    const band = screen.getByTestId("phrase-region");

    expect(band.className).toContain("items-center");
    expect(band.className).toContain("justify-center");
    expect(container.querySelector("[data-testid=phrase-region] p")?.className).toContain(
      "text-center",
    );
  });

  /**
   * Com o cabeçalho ligado a região começa em 212 e a frase se recentraliza — desce 66px,
   * metade do que as outras descem inteiro. É consequência de centralizar dentro de uma
   * faixa menor, não uma regra à parte. §11.5.
   */
  describe("as duas geometrias da frase", () => {
    test("sem cabeçalho: 80–1160, a faixa inteira", () => {
      renderImpact();

      expect(screen.getByTestId("phrase-region").className).toContain("top-[80px]");
      expect(screen.getByTestId("phrase-region").className).toContain("h-[1080px]");
    });

    test("com cabeçalho: 212–1160, e a frase se recentraliza sozinha", () => {
      renderImpact({ options: { ...defaults.options, showHeader: true } });

      expect(screen.queryByTestId("header-band")).not.toBeNull();
      expect(screen.getByTestId("phrase-region").className).toContain("top-[212px]");
      expect(screen.getByTestId("phrase-region").className).toContain("h-[948px]");
    });
  });

  test("o rodapé inteiro some com o interruptor da faixa", () => {
    renderImpact({ options: { ...defaults.options, showFooter: false } });

    expect(screen.queryByRole("img", { name: "maiahub" })).toBeNull();
    expect(screen.queryAllByTestId("constellation-dot")).toHaveLength(0);
  });

  // A região é a da frase — a §11.5 a marca com ⌐. Como a capa, é conteúdo que não está
  // ancorado ao topo: centralizado, o que não cabe estoura para os dois lados, e só a
  // medida de dois nós da decisão 47 o pega.
  describeGuardedRegion(textImpact);
});
