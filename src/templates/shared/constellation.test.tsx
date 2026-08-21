import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Constellation } from "@/templates/shared/constellation";

function dots() {
  return screen.getAllByTestId("constellation-dot");
}

function lit() {
  return dots().filter((dot) => dot.dataset.lit === "true");
}

describe("Constellation", () => {
  test("um ponto por slide", () => {
    render(<Constellation index={0} total={8} />);

    expect(dots()).toHaveLength(8);
  });

  test("acende do primeiro ponto até o slide atual, inclusive", () => {
    render(<Constellation index={2} total={8} />);

    expect(lit()).toHaveLength(3);
    expect(dots().slice(0, 3).map((dot) => dot.dataset.lit)).toEqual([
      "true",
      "true",
      "true",
    ]);
  });

  test("no primeiro slide acende um só", () => {
    render(<Constellation index={0} total={8} />);

    expect(lit()).toHaveLength(1);
  });

  test("no último slide a constelação está inteira acesa", () => {
    render(<Constellation index={7} total={8} />);

    expect(lit()).toHaveLength(8);
  });

  /**
   * O recorte acima de 10 slides — "5 pontos mais um contador" na §10.5 do design
   * system — está reservado ao experimento 2 / tarefa 2.4b. Até lá, doze slides são
   * doze pontos, sem janela e sem contador.
   */
  test("acima de dez slides ainda desenha um ponto por slide", () => {
    render(<Constellation index={10} total={12} />);

    expect(dots()).toHaveLength(12);
    expect(lit()).toHaveLength(11);
  });
});
