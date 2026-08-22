import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { textBullets } from "@/templates/text-bullets";
import type { DeckMeta } from "@/deck/types";

const deck: DeckMeta = { handle: "@rafael", pillar: "log" };

function renderBullets(overrides: Partial<typeof textBullets.defaults> = {}) {
  const { Component } = textBullets;
  const { fields, options } = { ...textBullets.defaults, ...overrides };

  return render(
    <Component fields={fields} options={options} deck={deck} index={3} total={5} />,
  );
}

/**
 * Smoke test. A âncora dos itens — o critério de pronto da 2.8 — não é verificável aqui:
 * `happy-dom` não faz layout, então "centralizado no miolo" mediria zero contra zero. O
 * que se guarda é a classe que decide, e o resto se confere olhando, como manda o
 * CLAUDE.md.
 */
describe("text-bullets", () => {
  test("renderiza o cabeçalho e um item por entrada da lista", () => {
    renderBullets({
      fields: { heading: "Três coisas que eu mudaria", items: ["Um", "Dois", "Três"] },
    });

    expect(screen.getByText("Três coisas que eu mudaria")).toBeDefined();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  test("cada item leva o travessão da §11.2, e ele fica fora da árvore acessível", () => {
    const { container } = renderBullets({
      fields: { heading: "Cabeçalho", items: ["Um", "Dois"] },
    });

    const markers = container.querySelectorAll("li > span[aria-hidden]");

    expect(markers).toHaveLength(2);
    expect(markers[0].textContent).toBe("—");
    // Travessão em mono sobre o corpo em Sora: só a família troca, o tamanho é herdado.
    expect(markers[0].className).toContain("font-mono");
  });

  test("os itens são interpretados como marcação — o cabeçalho não", () => {
    const { container } = renderBullets({
      fields: {
        heading: "Um [[cabeçalho]] literal",
        items: ["Um ponto com [[destaque]]"],
      },
    });

    // Fora do marcador, que também é azure: o que se procura é o `[[destaque]]` dentro
    // do texto do item.
    const accent = container.querySelector(
      "li > span:not([aria-hidden]) span.text-azure-radiance-400",
    );

    expect(accent?.textContent).toBe("destaque");
    // O cabeçalho sai com os colchetes na tela: a §11.2 não lhe dá marcação.
    expect(screen.getByText("Um [[cabeçalho]] literal")).toBeDefined();
  });

  test("anchor center centraliza o bloco; top encosta no topo da região", () => {
    const { unmount } = renderBullets({ options: { showGrid: false, anchor: "center" } });

    expect(screen.getByTestId("items-region").className).toContain("justify-center");
    unmount();

    renderBullets({ options: { showGrid: false, anchor: "top" } });

    expect(screen.getByTestId("items-region").className).toContain("justify-start");
  });

  /** O oposto da asserção da capa: aqui o rodapé de identidade existe. */
  test("traz o rodapé completo — glyph, handle e constelação", () => {
    renderBullets();

    expect(screen.getByRole("img", { name: "maiahub" })).toBeDefined();
    expect(screen.getByText("@rafael")).toBeDefined();
    expect(screen.getAllByTestId("constellation-dot")).toHaveLength(5);
  });

  test("o descritor declara fundo plain e grupo content", () => {
    expect(textBullets.background).toBe("plain");
    expect(textBullets.group).toBe("content");
  });
});
