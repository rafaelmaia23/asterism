import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { coverStatement } from "@/templates/cover-statement";
import type { DeckMeta } from "@/deck/types";

const deck: DeckMeta = { handle: "@rafael", pillar: "log" };

function renderCover(overrides: Partial<typeof coverStatement.defaults> = {}) {
  const { Component } = coverStatement;
  const { fields, options } = { ...coverStatement.defaults, ...overrides };

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
    renderCover({ options: { showChevron: true } });

    expect(screen.queryByTestId("chevron")).not.toBeNull();
  });

  test("showChevron desligado não desenha nada no lugar dela", () => {
    renderCover({ options: { showChevron: false } });

    expect(screen.queryByTestId("chevron")).toBeNull();
    expect(screen.getAllByTestId("constellation-dot")).toHaveLength(8);
  });

  test("a capa não traz handle nem rodapé de identidade", () => {
    renderCover();

    expect(screen.queryByText(deck.handle)).toBeNull();
  });

  test("o descritor declara fundo grid e grupo cover", () => {
    expect(coverStatement.background).toBe("grid");
    expect(coverStatement.group).toBe("cover");
  });
});
