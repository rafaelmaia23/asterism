import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import type { DeckMeta } from "@/deck/types";
import { finalCta } from "@/templates/final-cta";

const deck: DeckMeta = { handle: "@rafael", pillar: "log" };
const { defaults } = finalCta;

/** Por padrão o fechamento é o último slide do deck — é o que ele é por definição. */
function renderFinal(
  overrides: Partial<typeof finalCta.defaults> = {},
  position = { index: 5, total: 6 },
) {
  const { Component } = finalCta;
  const { fields, options } = { ...defaults, ...overrides };

  return render(
    <Component
      fields={fields}
      options={options}
      deck={deck}
      index={position.index}
      total={position.total}
    />,
  );
}

/**
 * Smoke test. O ancoramento à base e os gaps de 48px e 64px não são verificáveis aqui —
 * `happy-dom` não faz layout —, então o que se guarda é a presença dos blocos e a classe
 * que decide. O resto se confere olhando, como manda o CLAUDE.md.
 */
describe("final-cta", () => {
  test("renderiza fecho, complemento e bloco de CTA", () => {
    renderFinal();

    expect(screen.getByText(defaults.fields.heading)).toBeDefined();
    expect(screen.getByText(defaults.fields.lead)).toBeDefined();
    expect(screen.getByTestId("cta-block").textContent).toContain("blog.maiahub.com.br");
  });

  /** O critério de pronto da 2.9: o bloco some **e** o gap junto, porque o gap é dele. */
  test("lead vazio some do DOM, e o gap sai junto", () => {
    renderFinal({ fields: { ...defaults.fields, lead: "" } });

    expect(screen.queryByText(defaults.fields.lead)).toBeNull();
    // O que sobrou no miolo é título e CTA; nenhum elemento vazio segurando espaço.
    expect(document.querySelectorAll(".slide-lead")).toHaveLength(0);
  });

  test("lead só de espaços conta como vazio", () => {
    renderFinal({ fields: { ...defaults.fields, lead: "   " } });

    expect(document.querySelectorAll(".slide-lead")).toHaveLength(0);
  });

  test("o fecho aceita marcação; lead e CTA são literais", () => {
    const { container } = renderFinal({
      fields: {
        kicker: "log/ · 01",
        heading: "Escrevo sobre os [[erros]]",
        lead: "Um [[complemento]] literal",
        cta: "blog.maiahub.com.br",
      },
    });

    const accent = container.querySelector(".slide-title span.text-azure-radiance-400");

    expect(accent?.textContent).toBe("erros");
    expect(screen.getByText("Um [[complemento]] literal")).toBeDefined();
  });

  test("showArrow põe e tira o prefixo sem mexer no destino", () => {
    const { unmount } = renderFinal();

    expect(screen.getByTestId("cta-arrow").textContent).toBe("→ ");
    unmount();

    renderFinal({ options: { ...defaults.options, showArrow: false } });

    expect(screen.queryByTestId("cta-arrow")).toBeNull();
    expect(screen.getByTestId("cta-block").textContent).toBe("blog.maiahub.com.br");
  });

  /** Decisão 29: o fechamento leva o rodapé completo, ao contrário da capa. */
  test("nasce com glyph, handle e a constelação inteira acesa", () => {
    renderFinal();

    expect(screen.getByRole("img", { name: "maiahub" })).toBeDefined();
    expect(screen.getByText("@rafael")).toBeDefined();

    const dots = screen.getAllByTestId("constellation-dot");

    expect(dots).toHaveLength(6);
    expect(dots.every((dot) => dot.dataset.lit === "true")).toBe(true);
  });

  /**
   * A constelação é acesa por **posição**, não pelo template — decisão 36 aplicada à peça
   * vizinha. Um fechamento parado no meio do deck mostra o progresso real, e o rodapé
   * nunca discorda da lista lateral.
   */
  test("fora do fim, a constelação mostra o progresso real", () => {
    renderFinal({}, { index: 2, total: 6 });

    const lit = screen
      .getAllByTestId("constellation-dot")
      .filter((dot) => dot.dataset.lit === "true");

    expect(lit).toHaveLength(3);
  });

  test("nasce sem chevron, e ele continua suprimido no último slide", () => {
    const { unmount } = renderFinal();

    expect(screen.queryByTestId("chevron")).toBeNull();
    unmount();

    renderFinal({ options: { ...defaults.options, showChevron: true } });

    expect(screen.queryByTestId("chevron")).toBeNull();
  });

  test("o descritor declara fundo grid e grupo final", () => {
    expect(finalCta.background).toBe("grid");
    expect(finalCta.group).toBe("final");
  });
});
