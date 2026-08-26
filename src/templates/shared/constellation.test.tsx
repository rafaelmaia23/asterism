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
   * O recorte acima de 10 slides que a §10.5 pedia — "5 pontos mais um contador" — foi
   * **revogado** pelo experimento 2: nenhuma das três leituras possíveis sobreviveu à
   * comparação com o comportamento sem recorte. Decisão 40 da §16 do documento de
   * contexto.
   *
   * Os dois testes abaixo são o que impede a regra de voltar por engano. O primeiro
   * cerca o limiar que existia; o segundo vai muito além de qualquer limiar que alguém
   * pense em reintroduzir, e é por isso que ele conta 24 pontos em vez de 12.
   */
  test("não há limiar: 10 e 11 slides se comportam igual", () => {
    const { unmount } = render(<Constellation index={4} total={10} />);

    expect(dots()).toHaveLength(10);
    expect(lit()).toHaveLength(5);
    unmount();

    render(<Constellation index={4} total={11} />);

    expect(dots()).toHaveLength(11);
    expect(lit()).toHaveLength(5);
  });

  test("um ponto por slide vale em qualquer contagem, sem contador", () => {
    render(<Constellation index={10} total={24} />);

    expect(dots()).toHaveLength(24);
    expect(lit()).toHaveLength(11);
    // O contador `03 / 12` não existe: a constelação não escreve texto nenhum.
    expect(screen.queryByText(/\d+\s*\/\s*\d+/)).toBeNull();
  });
});
