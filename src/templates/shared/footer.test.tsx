import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "@/templates/shared/footer";

/**
 * O que se testa aqui é **lógica de faixa**: quais peças aparecem sob quais opções, e a
 * supressão do chevron no último slide. As medidas da §10.5 — glyph a 32px, gap 20px,
 * faixa a 80px do fundo — não são verificáveis: `happy-dom` não faz layout e mediria zero
 * contra zero. Conforme o CLAUDE.md, layout se verifica olhando.
 */

const all = {
  showRule: true,
  showLogo: true,
  showLogoPlate: true,
  showHandle: true,
  showChevron: true,
};

function renderFooter(props: Partial<Parameters<typeof Footer>[0]> = {}) {
  return render(
    <Footer handle="@rafael" index={0} total={5} {...all} {...props} />,
  );
}

describe("Footer", () => {
  test("com tudo ligado, traz régua, glyph na placa, handle, constelação e chevron", () => {
    renderFooter();

    expect(screen.queryByTestId("footer-rule")).not.toBeNull();
    expect(screen.getByRole("img", { name: "maiahub" })).toBeDefined();
    expect(screen.queryByTestId("logo-plate")).not.toBeNull();
    expect(screen.getByText("@rafael")).toBeDefined();
    expect(screen.getAllByTestId("constellation-dot")).toHaveLength(5);
    expect(screen.queryByTestId("chevron")).not.toBeNull();
  });

  /** A constelação é a única peça sem opção: progresso é o que a faixa é. */
  test("com tudo desligado, sobra a constelação", () => {
    renderFooter({
      showRule: false,
      showLogo: false,
      showLogoPlate: false,
      showHandle: false,
      showChevron: false,
    });

    expect(screen.queryByTestId("footer-rule")).toBeNull();
    expect(screen.queryByRole("img", { name: "maiahub" })).toBeNull();
    expect(screen.queryByTestId("logo-plate")).toBeNull();
    expect(screen.queryByText("@rafael")).toBeNull();
    expect(screen.queryByTestId("chevron")).toBeNull();
    expect(screen.getAllByTestId("constellation-dot")).toHaveLength(5);
  });

  test("a régua é independente do resto da faixa", () => {
    const { unmount } = renderFooter({ showRule: false });

    expect(screen.queryByTestId("footer-rule")).toBeNull();
    expect(screen.getByRole("img", { name: "maiahub" })).toBeDefined();
    unmount();

    renderFooter({ showLogo: false, showHandle: false, showChevron: false });

    expect(screen.queryByTestId("footer-rule")).not.toBeNull();
  });

  test("a placa desligada deixa a glyph solta, sem tirá-la", () => {
    renderFooter({ showLogoPlate: false });

    expect(screen.getByRole("img", { name: "maiahub" })).toBeDefined();
    expect(screen.queryByTestId("logo-plate")).toBeNull();
  });

  /** Placa sem logo não é meia peça: é nada. Ela existe para emoldurar a glyph. */
  test("a placa não aparece sozinha quando a logo está desligada", () => {
    renderFooter({ showLogo: false, showLogoPlate: true });

    expect(screen.queryByTestId("logo-plate")).toBeNull();
    expect(screen.queryByRole("img", { name: "maiahub" })).toBeNull();
  });

  test("logo e handle são independentes — um não arrasta o outro", () => {
    const { unmount } = renderFooter({ showLogo: true, showHandle: false });

    expect(screen.getByRole("img", { name: "maiahub" })).toBeDefined();
    expect(screen.queryByText("@rafael")).toBeNull();
    unmount();

    renderFooter({ showLogo: false, showHandle: true });

    expect(screen.queryByRole("img", { name: "maiahub" })).toBeNull();
    expect(screen.getByText("@rafael")).toBeDefined();
  });

  /**
   * A regra mora aqui, e não nos templates: no último slide não há para onde deslizar, e
   * a seta que convida ao próximo mentiria. O `Footer` já recebe `index` e `total` para a
   * constelação, então a supressão sai de graça e é escrita uma vez só.
   */
  test("o chevron some no último slide, mesmo com a opção ligada", () => {
    renderFooter({ index: 4, total: 5 });

    expect(screen.queryByTestId("chevron")).toBeNull();
  });

  test("no penúltimo slide o chevron continua aparecendo", () => {
    renderFooter({ index: 3, total: 5 });

    expect(screen.queryByTestId("chevron")).not.toBeNull();
  });

  test("deck de um slide só é último e primeiro ao mesmo tempo", () => {
    renderFooter({ index: 0, total: 1 });

    expect(screen.queryByTestId("chevron")).toBeNull();
  });

  test("a constelação acende até o slide atual, inclusive", () => {
    renderFooter({ index: 2, total: 5 });

    const lit = screen
      .getAllByTestId("constellation-dot")
      .map((dot) => dot.getAttribute("data-lit"));

    expect(lit).toEqual(["true", "true", "true", "false", "false"]);
  });

  test("o handle sai em slide-meta ink-400 — §10.5", () => {
    renderFooter();

    expect(screen.getByText("@rafael").className).toContain("slide-meta");
    expect(screen.getByText("@rafael").className).toContain("text-ink-400");
  });
});
