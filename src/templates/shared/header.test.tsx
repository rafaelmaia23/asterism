import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "@/templates/shared/header";

/**
 * Como no `Footer`, o que se testa aqui é **lógica de faixa**. As medidas da §10.5 —
 * `slide-meta` a 28px, a faixa 80–148 — não são verificáveis: `happy-dom` não faz layout e
 * mediria zero contra zero. Layout se verifica olhando, conforme o CLAUDE.md.
 */
describe("Header", () => {
  test("ligado, desenha o kicker do slide", () => {
    render(<Header kicker="api/ · 04" show />);

    expect(screen.getByText("api/ · 04")).toBeDefined();
  });

  test("desligado, não desenha nada — nem a faixa vazia", () => {
    render(<Header kicker="api/ · 04" show={false} />);

    expect(screen.queryByTestId("header-band")).toBeNull();
    expect(screen.queryByText("api/ · 04")).toBeNull();
  });

  /**
   * Kicker vazio com o cabeçalho ligado é escolha de quem edita, não erro: a faixa fica
   * reservada e o slide mantém o ritmo da série. Quem não quer a faixa desliga a opção.
   */
  test("ligado com o texto vazio, a faixa continua lá", () => {
    render(<Header kicker="" show />);

    expect(screen.queryByTestId("header-band")).not.toBeNull();
  });

  test("o kicker sai em slide-meta azure-400 — §10.5", () => {
    render(<Header kicker="api/ · 04" show />);

    const kicker = screen.getByText("api/ · 04");

    expect(kicker.className).toContain("slide-meta");
    expect(kicker.className).toContain("text-azure-radiance-400");
  });
});
