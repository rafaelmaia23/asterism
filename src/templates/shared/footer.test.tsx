import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/templates/shared/footer";

/**
 * Smoke test. As medidas da §10.5 — glyph a 32px, gap 20px, faixa a 80px do fundo — não
 * são verificáveis aqui: `happy-dom` não faz layout e mediria zero contra zero. Conforme
 * o CLAUDE.md, layout se verifica olhando. O que este arquivo guarda é a composição: as
 * três peças presentes, e a constelação recebendo o par índice/total que lhe foi dado.
 */
describe("Footer", () => {
  test("traz a glyph, o handle e a constelação", () => {
    render(<Footer handle="@rafael" index={2} total={5} />);

    expect(screen.getByRole("img", { name: "maiahub" })).toBeDefined();
    expect(screen.getByText("@rafael")).toBeDefined();
    expect(screen.getAllByTestId("constellation-dot")).toHaveLength(5);
  });

  test("a constelação acende até o slide atual, inclusive", () => {
    render(<Footer handle="@rafael" index={2} total={5} />);

    const lit = screen
      .getAllByTestId("constellation-dot")
      .map((dot) => dot.getAttribute("data-lit"));

    expect(lit).toEqual(["true", "true", "true", "false", "false"]);
  });

  test("o handle sai em slide-meta ink-400 — §10.5", () => {
    render(<Footer handle="@rafael" index={0} total={3} />);

    expect(screen.getByText("@rafael").className).toContain("slide-meta");
    expect(screen.getByText("@rafael").className).toContain("text-ink-400");
  });
});
