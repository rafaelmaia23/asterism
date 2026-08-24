import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { coverStatement } from "@/templates/cover-statement";
import type { DeckMeta } from "@/deck/types";

const deck: DeckMeta = { handle: "@rafael", pillar: "log" };
const { defaults } = coverStatement;

function renderCover(overrides: Partial<typeof coverStatement.defaults> = {}) {
  const { Component } = coverStatement;
  const { fields, options } = { ...defaults, ...overrides };

  return render(
    <Component fields={fields} options={options} deck={deck} index={0} total={8} />,
  );
}

/**
 * Smoke test. O alinhamento do título à base da região — o critério de pronto da 1.7 —
 * não é verificável aqui: `happy-dom` não faz layout, então uma asserção sobre altura
 * mediria zero contra zero. Conforme o CLAUDE.md, layout de template se verifica
 * olhando, e é o que a 1C faz quando existir canvas.
 */
describe("cover-statement", () => {
  test("renderiza o kicker e o título que recebeu", () => {
    renderCover({
      fields: { kicker: "api/ · 04", heading: "Um título que declara algo" },
    });

    expect(screen.getByText("api/ · 04")).toBeDefined();
    expect(screen.getByText("Um título que declara algo")).toBeDefined();
  });

  test("showChevron ligado desenha a afordância de deslize", () => {
    renderCover({ options: { ...defaults.options, showChevron: true } });

    expect(screen.queryByTestId("chevron")).not.toBeNull();
  });

  test("showChevron desligado não desenha nada no lugar dela", () => {
    renderCover({ options: { ...defaults.options, showChevron: false } });

    expect(screen.queryByTestId("chevron")).toBeNull();
    expect(screen.getAllByTestId("constellation-dot")).toHaveLength(8);
  });

  test("o título é interpretado como marcação — `[[destaque]]` vira accent", () => {
    const { container } = renderCover({
      fields: { kicker: "log/ · 01", heading: "Ninguém [[lê docs]]" },
    });

    // Dentro do `<p>`: o kicker também é um span em accent, e vem antes no documento.
    const accent = container.querySelector("p > span.text-azure-radiance-400");

    expect(accent?.textContent).toBe("lê docs");
    // O resto do título fica fora do span, e a marcação não aparece na tela.
    expect(container.querySelector("p")?.textContent).toBe("Ninguém lê docs");
  });

  test("título sem marcação continua saindo inteiro, sem elemento a mais", () => {
    const { container } = renderCover({
      fields: { kicker: "log/ · 01", heading: "Um título literal" },
    });

    expect(screen.getByText("Um título literal")).toBeDefined();
    expect(container.querySelector("p > span")).toBeNull();
  });

  /**
   * Desde a 2B isto é **padrão**, não regra: as três peças da faixa são opção do slide, e
   * a capa é o único template que nasce com a identidade desligada — a §11.1 diz que nada
   * compete com o título, e a recomendação virou o valor com que o slide nasce.
   */
  test("a capa nasce sem logo nem handle", () => {
    renderCover();

    expect(screen.queryByText(deck.handle)).toBeNull();
    expect(screen.queryByRole("img", { name: "maiahub" })).toBeNull();
  });

  test("mas a identidade liga pela opção, como em qualquer outro slide", () => {
    renderCover({
      options: { ...defaults.options, showLogo: true, showHandle: true },
    });

    expect(screen.getByText(deck.handle)).toBeDefined();
    expect(screen.getByRole("img", { name: "maiahub" })).toBeDefined();
  });

  test("o descritor declara fundo grid e grupo cover", () => {
    expect(coverStatement.background).toBe("grid");
    expect(coverStatement.group).toBe("cover");
  });
});
